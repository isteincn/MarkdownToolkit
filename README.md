# Markdown Toolkit

将Markdown、VSCode和[DocFx](https://dotnet.github.io/docfx/index.html)结合，并再借助于VSCode的其他插件可以实现一套功能完备的知识管理系统。这套系统功能强大。但是在使用这套系统时，依然存在诸多影响使用体验的问题，包括但不限于：

- 为了实现DocFx额Toc功能，需要撰写大量配置。并且当md文件目录结构发生更改，也需要出现配置toc
- 使用中文编辑md文档时，有时必须切换中英文输入法。这比较影响写作体验。而其中一些切换是可以通过插件避免的，如可以将`·` 转换成`\``。


Markdown Toolkit 插件的目的是为了解决上述问题。

在创建这套工具时，也使用了其他插件的代码，其中包括：

- DocFx Toc Generator



## 使用方法：

- 生成DocFx TOC 相关配置：鼠标右击文件夹，并选中"DocFx-GenerateToc"

## Demo

## Requirements

The extension is only activated if there is a `docfx.json` file in the active workspace.

## Extension Settings

* `docFxToc.orderBy`: ascending/descending

