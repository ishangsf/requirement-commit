import * as vscode from 'vscode';
import { Requirement, generateCommitMessage } from './requirementService';
import { REQUIREMENT_DISPLAY_FORMAT } from './constants';

export class RequirementTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly requirement?: Requirement
  ) {
    super(label, collapsibleState);
    
    if (requirement) {
      this.description = requirement.description || requirement.title;
      this.tooltip = `${requirement.id}\n${requirement.title}`;
      this.iconPath = new vscode.ThemeIcon('file');
      this.contextValue = 'requirement';
    } else {
      this.iconPath = new vscode.ThemeIcon('folder');
      this.contextValue = 'requirementGroup';
    }
  }
}

export class RequirementTreeProvider implements vscode.TreeDataProvider<RequirementTreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<RequirementTreeItem | undefined | null | void> = new vscode.EventEmitter<RequirementTreeItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<RequirementTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

  private requirements: Requirement[] = [];

  constructor() {}

  refresh(requirements: Requirement[]): void {
    this.requirements = requirements;
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: RequirementTreeItem): vscode.TreeItem {
    return element;
  }

  // 获取需求项的显示文本
  private getRequirementLabel(req: Requirement): string {
    // 使用生成提交信息的函数来处理模板
    return generateCommitMessage(req, REQUIREMENT_DISPLAY_FORMAT);
  }

  getChildren(element?: RequirementTreeItem): Thenable<RequirementTreeItem[]> {
    if (!element) {
      const groupedRequirements = this.requirements.reduce((groups: { [key: string]: Requirement[] }, req) => {
        const type = req.type || '未分类';
        if (!groups[type]) {
          groups[type] = [];
        }
        groups[type].push(req);
        return groups;
      }, {});

      return Promise.resolve(
        Object.entries(groupedRequirements).map(([type, _]) => 
          new RequirementTreeItem(type, vscode.TreeItemCollapsibleState.Expanded)
        )
      );
    } else {
      const requirements = this.requirements.filter(req => (req.type || '未分类') === element.label);
      return Promise.resolve(
        requirements.map(req => 
          new RequirementTreeItem(
            this.getRequirementLabel(req),
            vscode.TreeItemCollapsibleState.None,
            req
          )
        )
      );
    }
  }
} 