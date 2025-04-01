export const REQUIREMENT_FORMAT = `ItemID:\${id} \${title}`; // 默认模板格式

// 需求列表显示格式
export const REQUIREMENT_DISPLAY_FORMAT = `\${id} - \${title}`;

// 需求管理平台API接口
export const REQUIREMENT_API = {
  // 获取需求列表的API地址
  LIST_URL: 'http://172.1.1.251/alm/rest/items/',
  
  // API请求方法
  METHOD: 'GET',
  
  // API请求头
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

// 默认查询配置
export const DEFAULT_QUERY_CONFIG = [
  {
    "name": "用户故事",
    "queryParams": "select _valm_Name,_valm_ItemID,_valm_NodeType,_valm_Uid,_valm_LastModifyTime,_valm_AssignedTo,Status,Priority from UserStory where _valm_AssignedTo LIKE '%${username}%' order by _valm_LastModifyTime desc limit 1,10",
    "descriptionField": "_valm_AssignedTo",
    "ListItemTemplate": "ItemID:${id} ${title}"
  },
  {
    "name": "缺陷",
    "queryParams": "select _valm_Name,_valm_ItemID,_valm_NodeType,_valm_Uid,_valm_LastModifyTime,_valm_AssignedTo,Status,Priority from Defect where Status='Open' and _valm_AssignedTo LIKE '%${username}%' order by _valm_LastModifyTime desc limit 1,20",
    "descriptionField": "_valm_AssignedTo",
    "ListItemTemplate": "ItemID:${id} ${title}"
  }
];

// 需求列表模拟数据（在实际API可用前使用）
export const MOCK_REQUIREMENTS = [
  { id: 'JXKH2.0.1-weeklyS-20347', title: '2025年2月第2周周报', uid: '150027', type: '所有问题', description: 'shunfengzhou' },
  { id: 'JXKH2.0.1-weeklyS-20349', title: '2025年2月第2周周报', uid: '150029', type: '所有问题', description: 'shunfengzhou' },
  { id: 'JXKH2.0.1-weeklyS-20487', title: '2025年2月第3周周报', uid: '150422', type: '所有问题', description: 'shunfengzhou' },
  { id: 'JXKH2.0.1-weeklyS-20490', title: '2025年2月第3周周报', uid: '150425', type: '所有问题', description: 'shunfengzhou' },
  { id: 'JXKH2.0.1-weeklyS-20492', title: '2025年2月第3周周报', uid: '150427', type: '所有问题', description: 'shunfengzhou' }
]; 