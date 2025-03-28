export const REQUIREMENT_FORMAT = 'REQ-[ID]: '; // 需求编号格式，例如 "REQ-12345: "

// 需求管理平台API接口
export const REQUIREMENT_API = {
  // 获取需求列表的API地址
  LIST_URL: 'https://api.example.com/requirements',
  
  // API请求方法
  METHOD: 'GET',
  
  // API请求头
  HEADERS: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN' // 替换为您的实际token
  }
};

// 需求列表模拟数据（在实际API可用前使用）
export const MOCK_REQUIREMENTS = [
  { id: '12345', title: '优化登录界面' },
  { id: '12346', title: '修复数据统计bug' },
  { id: '12347', title: '新增用户管理功能' },
  { id: '12348', title: '提升应用性能' },
  { id: '12349', title: '完善文档系统' }
]; 