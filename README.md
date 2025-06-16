English | [中文](https://github.com/RavenHogWarts/obsidian-ace-code-editor/blob/master/README-zh.md)

# ACE CODE EDITOR

An enhanced code editor using Ace editor, providing syntax highlighting, code folding, and other advanced editing features.

[![GitHub stars](https://img.shields.io/github/stars/RavenHogWarts/obsidian-ace-code-editor?style=flat&label=Stars)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/stargazers)
[![Total Downloads](https://img.shields.io/github/downloads/RavenHogWarts/obsidian-ace-code-editor/total?style=flat&label=Total%20Downloads)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/releases)
[![GitHub License](https://img.shields.io/github/license/RavenHogWarts/obsidian-ace-code-editor?style=flat&label=License)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/blob/master/LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/RavenHogWarts/obsidian-ace-code-editor?style=flat&label=Issues)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/RavenHogWarts/obsidian-ace-code-editor?style=flat&label=Last%20Commit)](https://github.com/RavenHogWarts/obsidian-ace-code-editor/commits/master)

## Features

- Edit code directly in Obsidian
![](./assets/code_view_leaf.png)

- Manage CSS snippets
![](./assets/snippet_manager.png)

- Edit code blocks
![](./assets/code_block_edit.png)

- Code file preview
![](./assets/code_file_preview.png)

## Installation
### Manual Installation

1. Download the latest release
2. Copy `main.js`, `styles.css`, and `manifest.json` to your vault's plugins folder: `<vault>/.obsidian/plugins/obsidian-ace-code-editor/`
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

### BRAT (Recommended for Beta Users)
1. Install [BRAT](https://github.com/TfTHacker/obsidian42-brat) plugin
2. Click "Add Beta plugin" in BRAT settings
3. Enter `RavenHogWarts/obsidian-ace-code-editor`
4. Enable the plugin

## Development

- Clone this repo
- Make sure your NodeJS is at least v16 (`node --version`)
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode
- `npm run build` to build the plugin
- `npm run build:local` to build the plugin and copy it to your vault's plugins folder(need create a .env file in the project root and add the line: VAULT_PATH=/path/to/your/vault)
- `npm run version` to bump the version number and update the manifest.json, version.json, package.json
- `npm run release` to build the plugin and bump the version number

## Support

If you encounter any issues or have suggestions:
- [Open an issue](https://github.com/RavenHogWarts/obsidian-ace-code-editor/issues) on GitHub
- [Join the discussion](https://github.com/RavenHogWarts/obsidian-ace-code-editor/discussions) for questions and ideas
- [Check the contributing guidelines](./CONTRIBUTING.md) if you'd like to contribute to the project

If you find this plugin helpful, you can support the development through:
- WeChat/Alipay: [QR Code](https://s2.loli.net/2024/05/06/lWBj3ObszUXSV2f.png)

## License

This project is licensed under the MIT LICENSE - see the [LICENSE](LICENSE) file for details.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=RavenHogWarts/obsidian-ace-code-editor&type=Timeline)](https://www.star-history.com/#RavenHogWarts/obsidian-ace-code-editor&Timeline)
