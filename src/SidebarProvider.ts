import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { readFileSync, writeFileSync, promises as fsPromises } from 'fs';

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case "onInfo": {
          if (!data.text) {
            return;
          }
          vscode.window.showInformationMessage(data.text);
          break;
        }
        case "onError": {
          if (!data.text) {
            return;
          }
          vscode.window.showErrorMessage(data.text);
          break;
        }
        case "onOpenPanel": {
          await vscode.commands.executeCommand(
            "effort-estimator.estimateEffort"
          );
          vscode.window.showInformationMessage('Starting computing, this might take a few seconds ..');

          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );
    const controllerUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "controller", "controlsSidePannel.js")
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">
			</head>
      <body>
        <input id="lenght" type="number" placeholder="Lenght"/>
        <input id="entities" type="number" placeholder="No. entities"/>
        <input id="transactions" type="number" placeholder="No. transactions"/>
        <input id="pointsAdj" type="number" placeholder="Adjusted points"/>
        <input id="pointsNonAdj" type="number" placeholder="Non adjusted points"/>
    
        <button id="computeEffortBtn">Compute effort</button>
      
        <p>or</p>
        <input id="fileInput" style="display:none" type="file" accept=".csv" hidden/>
        <button id="uploadFileBtn">Upload file</button>
        <script nonce="${nonce}" src="${controllerUri}"></script>
			</body>
			</html>`;
  }
}