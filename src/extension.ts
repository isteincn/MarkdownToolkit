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
	let disposable = vscode.commands.registerCommand('markdown-toolkit.DocFxGenerateToc', Process);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

async function Process(folder: vscode.Uri)
{
	if (folder instanceof vscode.Uri === false) {
		vscode.window.showErrorMessage("Invalid command execution context");
	}

	await ProcessRecursively(folder.fsPath);
	
	
}

async function ProcessRecursively(folder: string)
{
	let docFxItems = docFxItemsListFactory(SortingTypeOptions.fileName);


	let filesArr = fs.readdirSync(folder,{encoding:'utf8', withFileTypes:true});
	let indexExist = false;
	filesArr.forEach(item => 
		{
			var filedir = path.join(folder, item.name);
			if(item.isDirectory())
			{
				var indexPath = path.join(filedir, "介绍.md");
				ProcessRecursively(filedir);
				docFxItems.add(new DocFxItem(item.name, indexPath, true));
			}
			if(item.isFile() && path.basename(item.name) === "介绍.md")
			{
				indexExist = true;
			}
		}
	);
	// 一定确保"index.md"不存在，否则将原有index.md的内容覆盖就不好了。
	if(!indexExist)
	{
		var fd = fs.openSync(path.join(folder, "介绍.md"),"w");
		fs.writeSync(fd,"# 介绍");
		fs.closeSync(fd);
	}



	let files = await vscode.workspace.findFiles(new vscode.RelativePattern(folder, "*.md"));

	if (files.length === 0) {
		//vscode.window.showWarningMessage(`No files found under ${folder.fsPath}`);
	}


	for (const file of files) {
		
		const doc = await vscode.workspace.openTextDocument(file);
		const filename = path.basename(doc.fileName,'.md');
		if(filename === "介绍")
		{
			continue;
		}
		const titleParser = new DocParser(doc);
		// let title = titleParser.extractTitle();
		// if (!title) {
		// 	vscode.window.showWarningMessage(`No title found in ${file.fsPath}`);
		// 	title = filename;
		// }
		let title = filename;
		docFxItems.add(new DocFxItem(title, file.fsPath, false));
	}
	

	const content = docFxItems.toString();
	const yamlPath = path.join(folder, "toc.yml");
	
	var fd = fs.openSync(yamlPath,"w");
	fs.writeSync(fd,content);
	fs.closeSync(fd);
}