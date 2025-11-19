import "@styles/styles";
import { Editor, Menu, Plugin, setIcon, TFile, TFolder } from "obsidian";
import { BaseModal } from "./component/modal/BaseModal";
import { QuickConfigModal } from "./component/modal/QuickConfigModal";
import { SettingsBus } from "./hooks/useSettings";
import { t } from "./i18n/i18n";
import SettingsStore from "./settings/SettingsStore";
import AceCodeEditorSettingTab from "./settings/SettingsTab";
import { EmbedCreator } from "./type/obsidian-extend";
import {
	CODE_EDITOR_VIEW_TYPE,
	DEFAULT_CONFIG,
	ICodeBlock,
	ICodeEditorConfig,
} from "./type/types";
import { getCodeBlockAtCursor, updateCodeBlock } from "./utils/CodeBlock";
import { CodeEditorView } from "./view/CodeEditorView";
import { CodeEmbedView } from "./view/CodeEmbedView";
import { SETTINGS_VIEW_TYPE, SettingsView } from "./view/SettingsView";

export default class AceCodeEditorPlugin extends Plugin {
	settings: ICodeEditorConfig;
	statusBar: HTMLElement;
	readonly settingsStore = new SettingsStore(this);

	async onload() {
		await this.loadSettings();

		this.registerLeafViews();
		this.registerMarkdownProcessor();

		this.addSettingTab(new AceCodeEditorSettingTab(this.app, this));

		this.registerEventHandlers();
		this.registerCommands();
		this.registerRibbonCommands();
	}

	onunload() {}

	async loadSettings() {
		const savedData = await this.loadData();
		this.settings = this.validateAndMergeSettings(savedData);
		this.saveSettings();
	}

	async saveSettings() {
		await this.saveData(this.settings);
		SettingsBus.publish();
		const leaves = this.app.workspace.getLeavesOfType(
			CODE_EDITOR_VIEW_TYPE
		);
		leaves.forEach((leaf) => {
			const view = leaf.view;
			if (view instanceof CodeEditorView) {
				view.updateEditorConfig(this.settings);
			}
		});
	}

	private validateAndMergeSettings(savedData: unknown): ICodeEditorConfig {
		let validatedSettings = structuredClone(DEFAULT_CONFIG);

		try {
			if (savedData && typeof savedData === "object") {
				validatedSettings = {
					...validatedSettings,
					...savedData,
				};
			}
		} catch (error) {
			throw new Error("Failed to validate and merge settings" + error);
		}

		return validatedSettings;
	}

	private registerLeafViews() {
		try {
			this.registerView(CODE_EDITOR_VIEW_TYPE, (leaf) => {
				return new CodeEditorView(leaf, this);
			});

			this.registerView(SETTINGS_VIEW_TYPE, (leaf) => {
				return new SettingsView(leaf, this);
			});

			this.registerFileExtensions();

			this.registerEmbed(
				this.settings.supportExtensions,
				(ctx, file, subpath) => {
					return new CodeEmbedView(
						this,
						ctx.containerEl,
						file,
						subpath
					);
				}
			);
		} catch (e) {
			throw new Error("Failed to register code editor view" + e);
		}
	}

	private registerMarkdownProcessor() {
		// 注册markdown后处理器，用于处理带行范围的双链
		this.registerMarkdownPostProcessor((element, context) => {
			// 查找所有的内部链接
			const links = element.querySelectorAll("a.internal-link");

			links.forEach((link: HTMLAnchorElement) => {
				const href = link.getAttribute("href");
				if (!href) return;

				// 检查是否包含行范围语法 (#L10 或 #L10-L20)
				const lineRangeMatch = href.match(/#L\d+(-L\d+)?$/i);
				if (!lineRangeMatch) return;

				// 获取文件路径（去掉行范围部分）
				const filePath = href.replace(/#L\d+(-L\d+)?$/i, "");

				// 检查文件是否为支持的扩展名
				const extension = filePath.split(".").pop()?.toLowerCase();
				if (
					!extension ||
					!this.settings.supportExtensions.includes(extension)
				) {
					return;
				}

				// 获取对应的文件
				const file = this.app.vault.getAbstractFileByPath(filePath);
				if (!(file instanceof TFile)) return;

				// 创建嵌入视图来替换链接
				const embedContainer = createDiv();
				embedContainer.addClass("ace-embed-container");

				// 创建CodeEmbedView
				const embedView = new CodeEmbedView(
					this,
					embedContainer,
					file,
					lineRangeMatch[0] // 传递行范围字符串作为subpath
				);

				// 替换原链接
				link.replaceWith(embedContainer);

				// 加载嵌入视图
				embedView.onload();
			});
		});
	}

	private registerEventHandlers() {
		this.registerEvent(
			this.app.workspace.on("file-menu", this.handleFileMenu.bind(this))
		);

		this.registerEvent(
			this.app.workspace.on(
				"editor-menu",
				this.handleEditorMenu.bind(this)
			)
		);
	}

	private registerCommands() {
		this.addCommand({
			id: "createCodeFile",
			name: t("command.create_code_file"),
			callback: async () => {
				const activeFile = this.app.workspace.getActiveFile();
				const folderPath = activeFile?.parent?.path || "";
				await this.createCodeFile(folderPath);
			},
		});

		this.addCommand({
			id: "openCssSnippet",
			name: t("command.open_css_snippet_manager"),
			callback: async () => {
				await this.openCssSnippetSelector();
			},
		});

		this.addCommand({
			id: "openSettingsView",
			name: t("command.open_settings_view"),
			callback: async () => {
				await this.openPluginView(SETTINGS_VIEW_TYPE);
			},
		});

		this.addCommand({
			id: "quickConfig",
			name: t("command.quick_config"),
			callback: async () => {
				await this.openQuickConfig();
			},
		});
	}

	private registerRibbonCommands() {
		this.addRibbonIcon(
			this.settings.snippetsManager.icon,
			t("command.open_css_snippet_manager"),
			async () => {
				await this.openCssSnippetSelector();
			}
		);

		if (this.settings.snippetsManager.location) {
			this.app.workspace.onLayoutReady(() => {
				setTimeout(() => {
					this.statusBar = this.addStatusBarItem();
					this.statusBar.createDiv();
					this.statusBar.addClass("mod-clickable");
					this.statusBar.setAttribute("aria-label-position", "top");
					this.statusBar.setAttribute(
						"aria-label",
						t("command.open_css_snippet_manager")
					);
					setIcon(this.statusBar, this.settings.snippetsManager.icon);
					this.statusBar.addEventListener("click", async () => {
						await this.openCssSnippetSelector();
					});
				}, 500);
			});
		}
	}

	private registerEmbed(extensions: string[], embedCreator: EmbedCreator) {
		this.app.embedRegistry.registerExtensions(extensions, embedCreator);
		this.register(() => {
			return this.app.embedRegistry.unregisterExtensions(extensions);
		});
	}

	private registerFileExtensions(): void {
		const supportedExtensions = this.settings.supportExtensions;

		supportedExtensions.map((ext) => {
			try {
				this.registerExtensions([ext], CODE_EDITOR_VIEW_TYPE);
			} catch (e) {
				console.error(`Failed to register extension ${ext}`, e);
			}
		});
	}

	private handleFileMenu(menu: Menu, file: TFile | TFolder): void {
		if (file instanceof TFolder) {
			menu.addItem((item) => {
				item.setTitle(t("command.create_code_file"))
					.setIcon("code-xml")
					.onClick(() => {
						this.createCodeFile(file.path);
					});
			});
		}

		if (file instanceof TFile) {
			menu.addItem((item) => {
				item.setTitle(t("command.create_code_file"))
					.setIcon("code-xml")
					.onClick(() => {
						this.createCodeFile(file.parent?.path || "");
					});
			});
			menu.addItem((item) => {
				item.setTitle(t("command.open_in_code_editor"))
					.setIcon("code-xml")
					.onClick(async () => {
						await this.openInCodeEditor(file.path, true);
					});
			});
		}
	}

	private handleEditorMenu(menu: Menu, editor: Editor): void {
		menu.addItem((item) => {
			item.setTitle(t("command.edit_code_block"))
				.setIcon("code-xml")
				.onClick(async () => {
					const cursor = editor.getCursor();
					const codeBlock = await getCodeBlockAtCursor(
						editor,
						cursor
					);
					if (codeBlock) {
						await this.openCodeBlockEditor(codeBlock);
					}
				});
		});
	}

	async createCodeFile(folderPath: string): Promise<void> {
		new BaseModal(
			this.app,
			this,
			() => import("./component/modal/CreateCodeFileModal"),
			{
				app: this.app,
				folderPath,
				openInCodeEditor: (path: string, newTab: boolean) =>
					this.openInCodeEditor(path, newTab),
				onClose: () => {},
			},
			"modal-size-small"
		).open();
	}

	async openCssSnippetSelector(): Promise<void> {
		const snippetsFolder = `${this.app.vault.configDir}/snippets`;

		new BaseModal(
			this.app,
			this,
			() => import("./component/modal/SnippetsFileModal"),
			{
				app: this.app,
				plugin: this,
				snippetsFolder,
				openExternalFile: (filePath: string, newTab: boolean) =>
					this.openExternalFile(filePath, newTab),
				onClose: () => {},
			},
			"modal-size-medium"
		).open();
	}

	async openCodeBlockEditor(codeBlock: ICodeBlock): Promise<void> {
		new BaseModal(
			this.app,
			this,
			() => import("./component/modal/EditCodeBlockModal"),
			{
				codeBlock,
				config: this.settings,
				onSave: (newCode: string) =>
					updateCodeBlock(
						this.app,
						codeBlock.range,
						newCode,
						codeBlock.indent
					),
				onClose: () => {},
			},
			"modal-size-large"
		).open();
	}

	async openInCodeEditor(
		filePath: string,
		newTab: boolean = false
	): Promise<void> {
		const leaf = this.app.workspace.getLeaf(newTab);
		await leaf.setViewState({
			type: CODE_EDITOR_VIEW_TYPE,
			state: { file: filePath },
		});
		this.app.workspace.setActiveLeaf(leaf);
	}

	private async openExternalFile(
		filePath: string,
		newTab: boolean = false
	): Promise<void> {
		const adapter = this.app.vault.adapter;
		const exists = await adapter.exists(filePath);
		if (!exists) {
			return;
		}

		// @ts-ignore
		const file = new TFile(this.app.vault, filePath);
		const content = await adapter.read(filePath);

		const leaf = this.app.workspace.getLeaf(newTab);
		const view = new CodeEditorView(leaf, this);
		view.file = file;

		await view.onOpen();
		await view.onLoadFile(file);

		view.setViewData(content, true);

		await leaf.open(view);
		leaf.setViewState({
			type: CODE_EDITOR_VIEW_TYPE,
		});
		this.app.workspace.setActiveLeaf(leaf);
	}

	async openQuickConfig(): Promise<void> {
		const modal = new QuickConfigModal(
			this.app,
			this.settings,
			(newSettings) => this.updateSettings(newSettings)
		);
		modal.open();
	}

	public getSettings() {
		return this.settings;
	}

	public async updateSettings(newSettings: Partial<ICodeEditorConfig>) {
		this.settings = {
			...this.settings,
			...newSettings,
		};
		await this.saveSettings();
	}

	public async openPluginView(viewType: string) {
		// 检查是否已经有打开的视图
		const existingLeaves = this.app.workspace.getLeavesOfType(viewType);

		if (existingLeaves.length > 0) {
			// 如果存在，则激活第一个视图
			this.app.workspace.revealLeaf(existingLeaves[0]);
		} else {
			// 如果不存在，则创建新的视图
			const leaf = this.app.workspace.getLeaf("tab");
			await leaf.setViewState({
				type: viewType,
				active: true,
			});

			this.app.workspace.revealLeaf(leaf);
		}
	}
}
