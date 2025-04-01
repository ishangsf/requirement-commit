import * as vscode from 'vscode';
import { getRequirementList, Requirement, generateCommitMessage } from './requirementService';
import { REQUIREMENT_FORMAT } from './constants';
import { RequirementTreeProvider, RequirementTreeItem } from './requirementTreeProvider';

/**
 * 当插件激活时调用
 * @param context 扩展上下文
 */
export function activate(context: vscode.ExtensionContext) {
  const requirementTreeProvider = new RequirementTreeProvider();
  const treeView = vscode.window.createTreeView('requirementList', {
    treeDataProvider: requirementTreeProvider,
    showCollapseAll: true
  });

  let disposableRefresh = vscode.commands.registerCommand('requirement-commit.refreshRequirements', async () => {
    const requirements = await getRequirementList();
    requirementTreeProvider.refresh(requirements);
  });

  // 将需求应用到提交信息的函数
  async function applyRequirementToCommit(requirement: Requirement) {
    const requirementMessage = generateCommitMessage(requirement, REQUIREMENT_FORMAT);

    // 获取Git扩展
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    if (!gitExtension) {
      vscode.window.showErrorMessage('无法获取Git扩展');
      return;
    }

    const git = gitExtension.getAPI(1);
    if (!git || !git.repositories || git.repositories.length === 0) {
      vscode.window.showErrorMessage('未打开Git仓库');
      return;
    }

    const repo = git.repositories[0];
    if (!repo.inputBox) {
      vscode.window.showErrorMessage('无法访问Git提交输入框');
      return;
    }

    // 应用提交信息
    const currentMessage = repo.inputBox.value;
    if (currentMessage && currentMessage.trim() !== '') {
      if (!currentMessage.includes(requirementMessage)) {
        repo.inputBox.value = `${requirementMessage}\n${currentMessage}`;
      }
    } else {
      repo.inputBox.value = requirementMessage;
    }
    
    // 根据需求类型显示不同的提示消息
    const typeName = requirement.type;
    vscode.window.showInformationMessage(`已应用${typeName}: ${requirement.title}`);
  }

  // 注册应用需求命令（hover按钮）
  let disposableApplyRequirement = vscode.commands.registerCommand('requirement-commit.applyRequirement', async (item?: RequirementTreeItem) => {
    if (item?.requirement) {
      await applyRequirementToCommit(item.requirement);
    }
  });

  // 注册选择需求命令（顶部按钮）
  let disposableSelectRequirement = vscode.commands.registerCommand('requirement-commit.selectRequirement', async (item?: RequirementTreeItem) => {
    if (item?.requirement) {
      await applyRequirementToCommit(item.requirement);
    } else {
      const requirements = await getRequirementList();
      requirementTreeProvider.refresh(requirements);
      
      if (requirements.length === 0) {
        vscode.window.showInformationMessage('没有可用的需求');
        return;
      }

      await vscode.commands.executeCommand('requirementList.focus');
    }
  });

  let disposableOpenSettings = vscode.commands.registerCommand('requirement-commit.openSettings', async () => {
    await vscode.commands.executeCommand('workbench.action.openSettings', 'requirementCommit');
  });

  vscode.commands.executeCommand('requirement-commit.refreshRequirements');

  context.subscriptions.push(disposableSelectRequirement);
  context.subscriptions.push(disposableApplyRequirement);
  context.subscriptions.push(disposableOpenSettings);
  context.subscriptions.push(disposableRefresh);
  context.subscriptions.push(treeView);
}

/**
 * 当插件停用时调用
 */
export function deactivate() {} 