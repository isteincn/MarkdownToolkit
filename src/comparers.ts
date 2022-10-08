import { DocFxItem } from "./docfx-item";

export const filenameComparer = (a: DocFxItem, b: DocFxItem) => 
{
    if(a.isLowerIndex !== b.isLowerIndex)
    {
        if(a.isLowerIndex) return 1;
        return -1;
    }
    return b.fsPath.localeCompare(a.fsPath);
};