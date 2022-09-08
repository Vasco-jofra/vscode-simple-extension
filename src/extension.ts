import * as vscode from 'vscode';
import * as crypto from 'crypto';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
    console.log('"simple-vscode-extension" loaded!');

    const fetchWebview = new FetchWebview(context.extensionUri);
    context.subscriptions.push(vscode.commands.registerCommand('simple-vscode-extension.showFetchWebview', () => {
        fetchWebview.show();
    }));
}

// this method is called when your extension is deactivated
export function deactivate() { }

class FetchWebview {
    private _webview?: vscode.WebviewPanel;

    constructor(
        private readonly _extensionUri: vscode.Uri,
    ) { }

    public async show() {
        if (this._webview) {
            if (!this._webview.active) {
                this._webview.reveal(undefined, true);
            }
            return;
        }

        this._webview = vscode.window.createWebviewPanel('Index', `Fetch Files`, { viewColumn: vscode.ViewColumn.Two });
        this._webview.webview.options = {
            // Enable script in the Webview
            enableScripts: true,
            
            // Prevent the Webview from accessing files outside of the extension's directory
            localResourceRoots: [this._extensionUri],
        };
        this._webview.webview.html = this._getHtml(this._webview.webview);
    }


    private _getHtml(webview: vscode.Webview) {
        // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js'));

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
		<html lang="en">

		<head>
		    <meta charset="UTF-8">
		    <meta http-equiv="Content-Security-Policy" content="
				    default-src 'none'; 
				    connect-src ${webview.cspSource}; 
				    script-src 'nonce-${nonce}';
				    style-src 'unsafe-inline';
				">

		    <title>Sample Webview</title>
		</head>

		<body>
		    <table>
			<tr>
			    <td>File to fetch:</td>
			    <td><input style="width:650px;" id="file_to_fetch" type="text"
				    value="${vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js').path}" /></td>
			</tr>
			<tr>
			    <td></td>
			    <td>
				<input id="fetch_button" type="submit" />
			    </td>
			</tr>
		    </table>
		    <div id="output_div"></div>

		    <script nonce="${nonce}" src="${scriptUri}"></script>
		</body>

		</html>`;
    }
}

function getNonce() {
    return crypto.randomBytes(16).toString('base64');
}
