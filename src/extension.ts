import * as vscode from 'vscode';
import { ExtensionPannel } from './ExtensionPannel';
import { SidebarProvider } from './SidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			"effort-estimator-sidebar",
			sidebarProvider
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("effort-estimator.estimateEffort", () => {
			ExtensionPannel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("effort-estimator.refreshPannel", () => {
			ExtensionPannel.kill();
			ExtensionPannel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand("effort-estimator.refreshSidebar", async () => {
			await vscode.commands.executeCommand("workbench.action.closeSidebar");
			await vscode.commands.executeCommand(
				"workbench.view.extension.effort-estimator-sidebar-view"
			);
		})
	);
}

export function deactivate() {}