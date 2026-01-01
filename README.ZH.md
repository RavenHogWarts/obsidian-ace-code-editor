中文 | [English](https://github.com/RavenHogWarts/obsidian-ace-code-editor/blob/master/README.md)

# ACE 代码编辑器

一个基于 Ace 编辑器增强的代码编辑器，提供语法高亮、代码折叠等高级编辑功能。

[![GitHub stars](https://img.shields.io/github/stars/RavenHogWarts/obsidian-ace-code-editor?style=flat&label=星标)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/stargazers)
[![Total Downloads](https://img.shields.io/github/downloads/RavenHogWarts/obsidian-ace-code-editor/total?style=flat&label=总下载量)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/releases)
[![Latest Downloads](https://img.shields.io/github/downloads/RavenHogWarts/obsidian-ace-code-editor/latest/total?style=flat&label=最新版下载量)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/releases/latest)
[![GitHub License](https://img.shields.io/github/license/RavenHogWarts/obsidian-ace-code-editor?style=flat&label=许可证)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/blob/master/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/RavenHogWarts/obsidian-ace-code-editor?style=flat&label=问题)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/RavenHogWarts/obsidian-ace-code-editor?style=flat&label=最后提交)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commits/master)

## 功能介绍

-   在 obsidian 中直接进行代码编辑
    ![](./assets/code_view_leaf.png)

-   管理 css 代码片段
    ![](./assets/snippet_manager.png)

-   编辑代码块
    ![](./assets/code_block_edit.png)

-   代码文件预览
    ![](./assets/code_file_preview.png)

## 安装

### 手动安装

1. 下载最新版本
2. 将 `main.js`、`styles.css` 和 `manifest.json` 复制到你的仓库插件文件夹中：`<vault>/.obsidian/plugins/obsidian-ace-code-editor/`
3. 重新加载 Obsidian
4. 在设置 → 社区插件中启用插件

### BRAT（推荐给测试用户）

1. 安装 [BRAT](https://github.com/TfTHacker/obsidian42-brat) 插件
2. 在 BRAT 设置中点击"添加测试插件"
3. 输入 `RavenHogWarts/obsidian-ace-code-editor`
4. 启用插件

## 开发指南

-   克隆此仓库
-   确保你的 NodeJS 版本至少为 v16 (`node --version`)
-   使用 `npm i` 或 `yarn` 安装依赖
-   使用 `npm run dev` 启动开发模式并进行实时编译
-   运行 `npm run build` 构建插件
-   运行 `npm run build:local` 构建插件并将其复制到您的 vault 插件文件夹（需要在项目根目录创建一个 `.env` 文件并添加：`VAULT_PATH=/path/to/your/vault`）
-   运行 `npm run version` 更新版本号并更新 manifest.json、version.json、package.json
-   运行 `npm run release` 构建插件并更新版本号

## 支持与帮助

如果你遇到任何问题或有建议：

-   [在 GitHub 上提交问题](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues)
-   [加入讨论](https://github.com/RavenHogWarts/obsidian-ace-code-editor/discussions) 提出问题或分享想法
-   [查看贡献指南](./CONTRIBUTING.md) 如果你想为项目做出贡献

如果你觉得这个插件对你有帮助，可以通过以下方式支持开发：

-   [爱发电](https://afdian.com/a/ravenhogwarts)

## 许可证

此项目基于 MIT LICENSE 许可 - 详情请参阅 [LICENSE](LICENSE) 文件。

## Star 历史

[![Star 历史图表](https://api.star-history.com/svg?repos=RavenHogWarts/obsidian-ace-code-editor&type=Timeline)](https://www.star-history.com/#RavenHogWarts/obsidian-ace-code-editor&Timeline)
