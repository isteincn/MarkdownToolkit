import * as vscode from 'vscode';
import { DocParser } from './docParser';
import { DocFxItem } from './docfx-item';
import { docFxItemsListFactory } from './docfx-items-list';
import { SortingTypeOptions } from './configurations';
import { FileFolderModel } from "./FileFolderModel";
import path = require('path');
import * as fs from 'fs-extra';

const fileFolderModel = new FileFolderModel();

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('markdown-toolkit.generateYamlToc', Process);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function Process(folder: vscode.Uri)
{
	if (folder instanceof vscode.Uri === false) {
		vscode.window.showErrorMessage("Invalid command execution context");
	}

	const files = await vscode.workspace.findFiles(new vscode.RelativePattern(folder, "*.md"));

	if (files.length === 0) {
		vscode.window.showWarningMessage(`No files found under ${folder.fsPath}`);
	}

	const docFxItems = docFxItemsListFactory(SortingTypeOptions.fileName);

	for (const file of files) {
		
		const doc = await vscode.workspace.openTextDocument(file);
		const titleParser = new DocParser(doc);
		let title = titleParser.extractTitle();
		if (!title) {
			vscode.window.showWarningMessage(`No title found in ${file.fsPath}`);
			title = doc.fileName;
		}
		docFxItems.add(new DocFxItem(title, file));
	}

	const content = docFxItems.toString();
	const yamlPath = path.join(folder.fsPath, "toc.yaml");
	
	var fd = fs.openSync(yamlPath,"w");
	fs.writeSync(fd,content);
	fs.closeSync(fd);
	
}