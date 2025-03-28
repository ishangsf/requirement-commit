import * as vscode from 'vscode';
import { getRequirementList, Requirement } from './requirementService';
import { REQUIREMENT_FORMAT } from './constants';

/**
 * 当插件激活时调用
 * @param context 扩展上下文
 */
export function activate(context: vscode.ExtensionContext) {
  console.log('需求提交插件已激活');

  // 注册命令
  let disposable = vscode.commands.registerCommand('requirement-commit.selectRequirement', async () => {
    // 获取需求列表
    const requirements = await getRequirementList();
    
    if (requirements.length === 0) {
      vscode.window.showInformationMessage('没有可用的需求');
      return;
    }

    // 构建需求选择列表
    const items = requirements.map(req => ({
      label: `${req.id} - ${req.title}`,
      requirement: req
    }));

    // 显示选择菜单
    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: '请选择一个需求'
    });

    if (!selected) {
      return; // 用户取消选择
    }

    // 格式化需求编号
    const requirementMessage = REQUIREMENT_FORMAT.replace('[ID]', selected.requirement.id);
    
    // 获取当前Git源代码控制视图
    const sourceControl = vscode.scm.inputBox;
    
    if (sourceControl) {
      // 如果有现有消息，在前面添加需求编号
      const currentMessage = sourceControl.value;
      
      if (currentMessage && currentMessage.trim() !== '') {
        // 检查是否已经有需求编号前缀
        if (!currentMessage.startsWith(requirementMessage)) {
          sourceControl.value = `${requirementMessage}${currentMessage}`;
        }
      } else {
        // 没有现有消息，直接设置需求编号
        sourceControl.value = requirementMessage;
      }
      
      vscode.window.showInformationMessage(`已应用需求: ${selected.requirement.id}`);
    } else {
      vscode.window.showErrorMessage('无法访问源代码控制输入框');
    }
  });

  context.subscriptions.push(disposable);
}

/**
 * 当插件停用时调用
 */
export function deactivate() {
  console.log('需求提交插件已停用');
} 