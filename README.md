# 需求提交插件 (Requirement Commit)

一个VSCode扩展，用于在Source Control面板中添加需求选择功能，将需求编号自动插入到提交信息中。

## 功能

- 在VSCode Source Control面板的"Changes"选项右侧菜单中增加"选择需求"按钮
- 点击按钮后弹出需求列表选择框
- 选择需求后，自动将需求编号按照预定义格式填入commit message框

## 使用方法

1. 打开VSCode，进入Source Control视图（快捷键: `Ctrl+Shift+G`）
2. 在"Changes"分组上，点击右侧的"选择需求"按钮
3. 从弹出的需求列表中选择一个需求
4. 需求编号将自动插入到提交信息输入框中

## 配置说明

插件中有两个主要配置部分，可以在`src/constants.ts`文件中进行修改：

1. 需求编号格式配置：
   ```typescript
   export const REQUIREMENT_FORMAT = 'REQ-[ID]: '; // 修改成你需要的格式
   ```

2. 需求管理平台API接口配置：
   ```typescript
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
   ```

## 安装

在使用前，请执行以下命令安装依赖：

```bash
npm install
```

## 编译

```bash
npm run compile
```

## 打包成VSIX

```bash
npm install -g vsce
vsce package
```

生成的`.vsix`文件可以手动安装到VSCode中。

## 调试

按下`F5`在调试模式下运行此扩展。 