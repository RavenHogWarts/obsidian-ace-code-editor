import "@/style/styles";
import { Editor, Menu, Plugin, setIcon, TFile, TFolder } from "obsidian";
import { BaseModal } from "./components/Modal/BaseModal";
import AceCodeEditorSettingTab from "./components/Settings/SettingsTab";
import { SettingsBus } from "./core/hook/useSettings";
import { EmbedCreator } from "./core/interfaces/obsidian-extend";
import {
	CODE_EDITOR_VIEW_TYPE,
	DEFAULT_CONFIG,
	ICodeBlock,
	ICodeEditorConfig,
} from "./core/interfaces/types";
import { getCodeBlockAtCursor, updateCodeBlock } from "./core/utils/CodeBlock";
import { t } from "./i18n/i18n";
import { CodeEditorView } from "./views/CodeEditorView";
import { CodeEmbedView } from "./views/CodeEmbedView";

export default class AceCodeEditorPlugin extends Plugin {
	settings: ICodeEditorConfig;
	statusBar: HTMLElement;

	async onload() {
		await this.loadSettings();

		this.registerLeafViews();

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

	private validateAndMergeSettings(savedData: any): ICodeEditorConfig {
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
				return new CodeEditorView(leaf, this.settings);
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
			() => import("./components/Modal/CreateCodeFileModal"),
			{
				folderPath,
				openInCodeEditor: (path: string, newTab: boolean) =>
					this.openInCodeEditor(path, newTab),
			},
			"modal-size-small"
		).open();
	}

	async openCssSnippetSelector(): Promise<void> {
		const snippetsFolder = `${this.app.vault.configDir}/snippets`;

		new BaseModal(
			this.app,
			this,
			() => import("./components/Modal/SnippetsFileModal"),
			{
				snippetsFolder,
				openExternalFile: (filePath: string, newTab: boolean) =>
					this.openExternalFile(filePath, newTab),
			},
			"modal-size-medium"
		).open();
	}

	async openCodeBlockEditor(codeBlock: ICodeBlock): Promise<void> {
		new BaseModal(
			this.app,
			this,
			() => import("./components/Modal/EditCodeBlockModal"),
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
		const view = new CodeEditorView(leaf, this.settings);
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
}
