# 需求提交插件 (Requirement Commit)

一个VSCode扩展，用于在Source Control面板中添加需求选择功能，将需求编号自动插入到提交信息中。

## 功能特点

- 在VSCode Source Control面板集成需求列表视图
- 支持从VISSLM平台获取用户故事、缺陷等需求数据
- 支持多种需求类型的配置与筛选
- 点击需求项可自动将需求编号插入到Git提交信息中
- 提供刷新需求列表、配置API接口等功能

## 安装方法

1. 下载最新的 `.vsix` 文件
2. 在VSCode中，打开命令面板（Ctrl+Shift+P）
3. 输入并选择 "Extensions: Install from VSIX..."
4. 选择下载的 `.vsix` 文件
5. 重启VSCode

## 使用方法

1. 打开VSCode，进入Source Control视图（快捷键: `Ctrl+Shift+G`）
2. 在右侧会显示"需求列表"视图，其中包含从系统获取的需求项
3. 鼠标悬停在某个需求项上，点击右侧的"应用"按钮(✓)，或直接点击需求项
4. 需求编号将自动插入到Git提交信息输入框中
5. 需要刷新需求列表时，点击视图标题栏的刷新按钮

## 配置说明

本插件提供多项配置选项，可以通过以下步骤进行设置：

1. 在VSCode中打开设置（文件 > 首选项 > 设置）
2. 搜索 "requirementCommit" 找到相关配置项
3. 或在Source Control面板菜单中点击"配置需求接口"按钮

### 可配置项说明

#### 基本配置

- **requirementCommit.apiUrl**: 设置VISSLM平台API地址
  - 默认值: `http://172.1.1.251/alm/rest/items/`
  - 说明: 需要根据实际环境修改为正确的API地址

- **requirementCommit.username**: 设置用户名
  - 说明: 用于API认证和筛选分配给自己的需求
  - 配置251平台的登录账号

- **requirementCommit.apiToken**: 设置API访问令牌
  - 说明: 用于API认证，请从VISSLM平台获取
  - 登录251平台后点击右上角的头像图标，点击 "设置" 按钮，在用户设置弹窗中选择 "集成" 选项卡，点击 "显示 API Token"
  - 填写你的 API Token

- **requirementCommit.useMockData**: 是否使用模拟数据
  - 默认值: `true`
  - 说明: 开发测试时使用，生产环境请设置为`false`

#### 需求查询配置

**requirementCommit.queryConfigs**: 需求列表查询配置，支持多种需求类型的定制化查询

每种需求类型的配置包括：

- **name**: 需求类型名称，如"用户故事"、"缺陷"等
- **queryParams**: VSearch查询语句，用于筛选和排序需求
  - 支持`${username}`变量引用当前用户名
  - 例如: `select _valm_Name,_valm_ItemID from UserStory where _valm_AssignedTo LIKE '%${username}%'`
  - 详细 VSearch 语法文档请参考内网：http://172.1.1.26:8090/display/VS/VSearch
- **descriptionField**: 用于显示需求描述的字段名
- **ListItemTemplate**: 需求项显示模板
  - 支持模板变量: `${id}` (需求ID), `${title}` (需求标题)
  - 例如: `ItemID:${id} ${title}`
  - 也可以直接使用字段名，字段需要在 select 语句中先定义查询

### 配置示例

```json
{
  "requirementCommit.apiUrl": "http://alm.example.com/rest/items/",
  "requirementCommit.username": "yourname",
  "requirementCommit.apiToken": "your-api-token",
  "requirementCommit.useMockData": false,
  "requirementCommit.queryConfigs": [
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
  ]
}
```

## 常见问题

1. **无法显示需求列表**
   - 检查API地址配置是否正确
   - 确认用户名和API令牌是否有效
   - 查看VSCode输出面板中的日志信息

2. **需求列表为空**
   - 检查查询配置是否正确
   - 确认当前用户是否有分配的需求
   - 尝试修改查询条件放宽筛选范围

3. **无法应用需求到提交信息**
   - 确认已打开Git源代码管理视图
   - 确保当前工作区是一个有效的Git仓库

## 版本历史

- **0.1.0**: 初始版本
  - 支持VISSLM平台需求获取
  - 提供需求列表视图
  - 支持需求应用到提交信息

## 打包和发布说明

如需自行打包或发布此插件，请确保在 `package.json` 中配置以下字段：

- **publisher**: 设置发布者名称，例如 `"publisher": "vsalm-team"`。此字段用于在VS Code插件市场中标识发布者，图形界面上显示为 `Publisher: vsalm-team`。如未设置，会显示为 `undefined publisher`。

如需发布到VS Code插件市场，请执行以下步骤：

1. 安装 vsce 工具：`npm install -g vsce`
2. 确保 package.json 中已设置 `publisher` 字段
3. 执行打包命令：`vsce package`
4. 生成的 .vsix 文件可以上传到插件市场或手动安装 