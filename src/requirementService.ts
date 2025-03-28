import * as vscode from 'vscode';
import { REQUIREMENT_API, MOCK_REQUIREMENTS } from './constants';

// 需求接口
export interface Requirement {
  id: string;
  title: string;
}

/**
 * 获取需求列表
 * 
 * @returns Promise<Requirement[]> 需求列表
 */
export async function getRequirementList(): Promise<Requirement[]> {
  try {
    // 使用模拟数据进行开发测试
    // 在实际环境中，取消注释下面的代码，使用真实API
    /*
    const response = await fetch(REQUIREMENT_API.LIST_URL, {
      method: REQUIREMENT_API.METHOD,
      headers: REQUIREMENT_API.HEADERS
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`);
    }
    
    const data = await response.json();
    return data as Requirement[];
    */
    
    // 使用模拟数据
    return MOCK_REQUIREMENTS;
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
  return format.replace('[ID]', requirement.id);
} 