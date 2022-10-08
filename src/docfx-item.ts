import * as path from 'path';
import { Uri } from "vscode";

type ItemFormatter = (item : DocFxItem) => string;

function yamlFormatter(item : DocFxItem) {
    const filePath = path.basename(item.fsPath);
    if(item.isLowerIndex)
    {
        return `- name: ${item.name}\n  href: ${path.join(item.name, "toc.yml")}\n  homepage: ${path.join(item.name, "介绍.md")}`;
    }
    return `- name: ${item.name}\n  href: ${filePath}`;
}

export class DocFxItem {
    public name: string;

    // TODO: make private once DocFxItems Class is implemented to define custome sorting
    public fsPath: string;
    public itemFormatter: ItemFormatter;
    public isLowerIndex: Boolean;
    //public parentDir: string;
    constructor(name: string, path: string, index: Boolean, itemFormatter: ItemFormatter = yamlFormatter) {
        this.name = name;
        this.fsPath = path;
        this.isLowerIndex = index;
        //this.parentDir = parent;
        this.itemFormatter = itemFormatter;
    }

    toString(): string {
        
        return this.itemFormatter(this);
    }
}