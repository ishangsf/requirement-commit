import * as vscode from 'vscode';
import { DEFAULT_QUERY_CONFIG } from './constants';

// 查询配置接口
export interface QueryConfig {
  name: string;
  queryParams: string;
  ListItemTemplate: string;
  descriptionField: string;
}

/**
 * 获取配置值
 * @param key 配置键名
 * @param defaultValue 默认值
 * @returns 配置值
 */
export function getConfig<T>(key: string, defaultValue?: T): T {
  const config = vscode.workspace.getConfiguration('requirementCommit');
  return config.get<T>(key, defaultValue as T);
}

/**
 * 更新配置值
 * @param key 配置键名 
 * @param value 配置值
 * @param global 是否全局更新
 * @returns Promise<void>
 */
export async function updateConfig<T>(key: string, value: T, global: boolean = true): Promise<void> {
  const config = vscode.workspace.getConfiguration('requirementCommit');
  await config.update(key, value, global);
}

/**
 * 获取API URL配置
 * @returns string API URL
 */
export function getApiUrl(): string {
  return getConfig<string>('apiUrl', 'http://172.1.1.251/alm/rest/items/');
}

/**
 * 获取API Token配置
 * @returns string API Token
 */
export function getApiToken(): string {
  return getConfig<string>('apiToken', '');
}

/**
 * 获取登录用户名配置
 * @returns string 登录用户名
 */
export function getUsername(): string {
  return getConfig<string>('username', '');
}

/**
 * 获取查询配置数组
 * @returns QueryConfig[] 查询配置数组
 */
export function getQueryConfigs(): QueryConfig[] {
  return getConfig<QueryConfig[]>('queryConfigs', DEFAULT_QUERY_CONFIG);
}

/**
 * 是否使用模拟数据
 * @returns boolean 是否使用模拟数据
 */
export function isUseMockData(): boolean {
  return getConfig<boolean>('useMockData', true);
} 