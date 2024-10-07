const vscode = require('vscode');
const { generateCommitMessage } = require('../../lib/generateMessage');
const { aiCommitMessage } = require('../../src/aiCommit');

function activate(context) {
  let disposable = vscode.commands.registerCommand('commitflow.generateCommitMessage', async function () {
    const mode = await vscode.window.showQuickPick(['Manual', 'AI'], {
      placeHolder: 'Choose commit mode',
    });

    if (mode === 'Manual') {
      // Collect manual commit info from the user
      const type = await vscode.window.showInputBox({ prompt: 'Commit type:' });
      const scope = await vscode.window.showInputBox({ prompt: 'Commit scope (optional):' });
      const description = await vscode.window.showInputBox({ prompt: 'Commit description:' });
      const issue = await vscode.window.showInputBox({ prompt: 'Issue/ticket number (optional):' });

      const commitMessage = generateCommitMessage({ type, scope, description, issue });
      vscode.window.showInformationMessage(`Generated Commit Message: ${commitMessage}`);

    } else if (mode === 'AI') {
      const apiKey = await vscode.window.showInputBox({ prompt: 'Enter your OpenAI API key:' });
      const diff = await vscode.commands.executeCommand('git.diff');

      const commitMessage = await aiCommitMessage(diff, apiKey);
      vscode.window.showInformationMessage(`AI-Generated Commit Message: ${commitMessage}`);
    }
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
