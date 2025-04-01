import * as vscode from 'vscode';
import { MOCK_REQUIREMENTS } from './constants';
import { getApiUrl, getApiToken, getQueryConfigs, isUseMockData, getUsername, QueryConfig } from './configService';

// 需求接口
export interface Requirement {
  type: string; // 类型名称，对应配置中的name字段
  [key: string]: string; // 支持动态属性
}

/**
 * 从API获取指定配置的需求列表
 * @param config 查询配置
 * @returns Promise<Requirement[]> 需求列表
 */
async function fetchRequirementsByConfig(config: QueryConfig): Promise<Requirement[]> {
  try {
    const apiUrl = getApiUrl();
    const apiToken = getApiToken();
    const username = getUsername();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    // 构建查询参数
    const formattedParams: Record<string, any> = {};
    
    // 添加用户名和API令牌到请求参数
    formattedParams['user'] = username;
    formattedParams['apiToken'] = apiToken;
    
    // 构建基础URL字符串
    let urlString = apiUrl;
    
    // 向URL添加参数分隔符
    urlString += (urlString.includes('?') ? '&' : '?');
    
    // 直接添加VSearch参数，使用encodeURIComponent但保留空格
    // 这里我们用自定义方式处理VSearch参数，避免空格变成+号
    if (config.queryParams && config.queryParams.trim()) {
      // 先替换查询语句中的${username}为实际用户名
      let queryWithUsername = config.queryParams.replace(/\${username}/g, username);
      
      // 使用正则替换空格为特殊标记，然后编码整个字符串，最后将标记替换回空格
      const tempMark = "SPACE_PLACEHOLDER";
      let encodedVSearch = queryWithUsername.replace(/ /g, tempMark);
      encodedVSearch = encodeURIComponent(encodedVSearch);
      encodedVSearch = encodedVSearch.replace(new RegExp(encodeURIComponent(tempMark), 'g'), ' ');
      
      urlString += `VSearch=${encodedVSearch}&`;
    }
    
    // 添加其他参数
    Object.entries(formattedParams).forEach(([key, value], index) => {
      if (value) {
        urlString += `${key}=${encodeURIComponent(String(value))}`;
        if (index < Object.entries(formattedParams).length - 1) {
          urlString += '&';
        }
      }
    });
    
    console.log(urlString);
    const response = await fetch(urlString, {
      method: 'GET',
      headers: headers
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 处理API返回的数据
    if (data && data.ErrorCode === 0 && Array.isArray(data.propList)) {
      // 将API返回的数据转换为需求列表格式
      const requirements: Requirement[] = data.propList.map((item: any) => {
        // 创建一个动态对象，包含所有API返回的字段
        const requirement: Requirement = {
          type: config.name // 使用配置名称作为类型
        };
        
        // 遍历API返回的所有字段，添加到需求对象中
        // 将API字段名规范化，移除前缀，便于模板中使用
        Object.entries(item).forEach(([key, value]) => {
          // 处理字段名，去掉前缀
          let fieldName = key;
          if (key.startsWith('_valm_')) {
            fieldName = key.substring(6); // 移除 _valm_ 前缀
          }
          
          // 添加原始字段和规范化字段
          requirement[key] = String(value || '');
          if (fieldName !== key) {
            requirement[fieldName] = String(value || '');
          }
          
          // 添加常用字段的别名
          if (key === '_valm_ItemID') requirement.id = String(value || '');
          if (key === '_valm_Name') requirement.title = String(value || '');
          if (key === '_valm_Uid') requirement.uid = String(value || '');
        });
        
        // 添加description属性，根据配置的descriptionField字段获取
        if (config.descriptionField) {
          requirement.description = item[config.descriptionField] || '';
        }
        
        return requirement;
      });
      
      return requirements;
    } else {
      // 没有数据或数据格式不正确
      vscode.window.showWarningMessage(`没有获取到"${config.name}"的需求数据或数据格式不正确`);
      return [];
    }
  } catch (error) {
    vscode.window.showErrorMessage(`获取"${config.name}"需求列表失败: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/**
 * 获取所有需求列表
 * 根据配置项数组，分别请求数据并组装
 * @returns Promise<Requirement[]> 需求列表
 */
export async function getRequirementList(): Promise<Requirement[]> {
  try {
    // 检查是否使用模拟数据
    if (isUseMockData()) {
      // 使用模拟数据
      return MOCK_REQUIREMENTS;
    }
    
    // 获取查询配置数组
    const queryConfigs = getQueryConfigs();
    
    if (!queryConfigs || queryConfigs.length === 0) {
      vscode.window.showWarningMessage('未配置查询参数，请在设置中配置');
      return [];
    }
    
    // 并行请求所有配置的数据
    const requirementsPromises = queryConfigs.map(config => fetchRequirementsByConfig(config));
    const requirementsArrays = await Promise.all(requirementsPromises);
    
    // 合并所有需求列表
    const allRequirements = requirementsArrays.flat();
    
    return allRequirements;
  } catch (error) {
    vscode.window.showErrorMessage(`获取需求列表失败: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

/**
 * 根据需求生成提交信息
 * 
 * @param requirement 选中的需求
 * @param format 需求编号格式
 * @returns string 格式化后的提交信息
 */
export function generateCommitMessage(requirement: Requirement, format: string): string {
  // 获取对应的配置模板
  const queryConfigs = getQueryConfigs();
  const matchingConfig = queryConfigs.find(config => config.name === requirement.type);
  
  // 使用匹配的配置模板，如果没有则使用传入的格式
  const template = matchingConfig?.ListItemTemplate || format;
  
  // 使用需求对象的全部属性来替换模板
  let message = template;
  
  // 匹配 ${xxx} 格式的模板变量
  const templateVarRegex = /\${([^}]+)}/g;
  
  // 执行替换
  message = message.replace(templateVarRegex, (match, fieldName) => {
    return requirement[fieldName] !== undefined ? requirement[fieldName] : match; // 如果字段不存在，保留原始匹配
  });
  
  return message;
} 