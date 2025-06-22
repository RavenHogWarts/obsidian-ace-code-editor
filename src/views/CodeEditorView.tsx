import { IconName, Scope, TextFileView, TFile, WorkspaceLeaf } from "obsidian";
import {
	CODE_EDITOR_VIEW_TYPE,
	ICodeEditorConfig,
} from "../core/interfaces/types";
import { AceService } from "../core/services/AceService";

export class CodeEditorView extends TextFileView {
	private aceService: AceService;
	editorScope: Scope;
	editorElement: HTMLElement;

	constructor(leaf: WorkspaceLeaf, private config: ICodeEditorConfig) {
		super(leaf);
		this.aceService = new AceService();
		this.editorScope = new Scope();
	}

	/*
	execute order: onOpen -> onLoadFile -> setViewData -> onUnloadFile -> onClose
	*/
	async onOpen() {
		await super.onOpen();
		this.editorElement = this.contentEl;

		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				this.aceService.updateTheme(
					this.config.lightTheme,
					this.config.darkTheme
				);
			})
		);

		// 启用Ace快捷键绑定
		this.registerAceKeybindings();

		this.registerDomEvent(
			this.editorElement,
			"focus",
			() => {
				this.app.keymap.pushScope(this.editorScope);
			},
			true
		);

		this.registerDomEvent(
			this.editorElement,
			"blur",
			() => {
				this.app.keymap.popScope(this.editorScope);
			},
			true
		);
	}

	async onLoadFile(file: TFile) {
		this.aceService.createEditor(this.editorElement);
		this.aceService.configureEditor(this.config, file?.extension ?? "");

		// 添加内容变化监听
		if (this.aceService.isEditorInitialized()) {
			const editor = this.aceService.getEditor();
			editor?.on("change", () => {
				// 触发自动保存
				this.requestSave();
			});
			
			// 在编辑器完全初始化后重置撤销管理器
			setTimeout(() => {
				editor?.getSession().getUndoManager().reset();
			}, 0);
		}

		await super.onLoadFile(file);
	}

	async onUnloadFile(file: TFile) {
		await super.onUnloadFile(file);
		this.aceService.destroy();
	}

	async onClose() {
		await super.onClose();
	}

	onResize() {
		this.aceService.resize();
	}

	getViewType(): string {
		return CODE_EDITOR_VIEW_TYPE;
	}

	getContext(file?: TFile) {
		return file?.path ?? this.file?.path;
	}

	getIcon(): IconName {
		return "code-xml";
	}

	getViewData(): string {
		return this.aceService.getValue();
	}

	setViewData(data: string, clear: boolean) {
		this.aceService.setValue(data, clear ? 1 : -1);
	}

	clear() {
		this.aceService.setValue("");
	}

	updateEditorConfig(newConfig: ICodeEditorConfig) {
		this.config = newConfig;
		this.aceService.configureEditor(
			this.config,
			this.file?.extension ?? ""
		);
	}

	private registerAceKeybindings() {
		// 设置键盘处理程序
		if (this.config.keyboard) {
			this.aceService.setKeyboardHandler(
				`ace/keyboard/${this.config.keyboard}`
			);
		}
	}
}
