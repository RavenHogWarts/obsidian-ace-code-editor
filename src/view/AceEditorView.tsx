import AceCodeEditorPlugin from "@src/main";
import { AceService } from "@src/service/AceService";
import { ICodeEditorConfig } from "@src/type/types";
import { ObsidianUtils } from "@src/utils/ObsidianUtils";
import { Scope, TFile, TextFileView, WorkspaceLeaf } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import { Minimap } from "./Minimap";

export abstract class AceEditorView extends TextFileView {
	public aceService: AceService;
	protected config: ICodeEditorConfig;
	protected editorScope: Scope;

	private minimapRoot: Root | null = null;
	private minimapContainer: HTMLElement | null = null;

	constructor(leaf: WorkspaceLeaf, protected plugin: AceCodeEditorPlugin) {
		super(leaf);
		this.aceService = new AceService();
		this.editorScope = new Scope();
		this.config = plugin.getSettings();
	}

	abstract getEditorContainer(): HTMLElement;

	protected getFileExtension(file?: TFile | null): string {
		return file?.extension || "";
	}

	/*
	execute order: onOpen -> onLoadFile -> setViewData -> onUnloadFile -> onClose
	*/
	async onOpen() {
		await super.onOpen();

		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				this.aceService.updateTheme(
					this.config.lightTheme,
					this.config.darkTheme
				);
			})
		);

		this.registerAceKeybindings();
	}

	async onUnloadFile(file: TFile) {
		await super.onUnloadFile(file);
		this.unmountMinimap();
		this.aceService.destroy();
	}

	async onClose() {
		await super.onClose();
		this.unmountMinimap();
	}

	onResize() {
		this.aceService.resize();
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
			this.getFileExtension(this.file)
		);
		this.renderMinimap();
	}

	protected init() {
		const container = this.getEditorContainer();

		this.aceService.createEditor(container);
		this.aceService.configureEditor(
			this.config,
			this.getFileExtension(this.file)
		);

		if (this.aceService.isEditorInitialized()) {
			const editor = this.aceService.getEditor();

			editor?.on("change", () => {
				this.requestSave();
			});

			setTimeout(() => {
				editor?.getSession().getUndoManager().reset();
			}, 0);

			this.renderMinimap();

			this.registerDomEvents(container);
		}
	}

	protected renderMinimap() {
		if (!this.config.minimap.enabled) {
			this.unmountMinimap();
			return;
		}

		const container = this.getEditorContainer();

		if (!this.minimapContainer) {
			this.minimapContainer = document.createElement("div");
			this.minimapContainer.className = "ace-minimap-wrapper";
			container.appendChild(this.minimapContainer);
		}

		if (!this.minimapRoot) {
			this.minimapRoot = createRoot(this.minimapContainer);
		}

		const editor = this.aceService.getEditor();
		this.minimapRoot.render(
			<StrictMode>
				<Minimap
					editor={editor}
					enabled={this.config.minimap.enabled}
				/>
			</StrictMode>
		);

		container.classList.add("ace-minimap-enabled");
	}

	protected unmountMinimap() {
		if (this.minimapRoot) {
			this.minimapRoot.unmount();
			this.minimapRoot = null;
		}

		if (this.minimapContainer && this.minimapContainer.parentNode) {
			this.minimapContainer.parentNode.removeChild(this.minimapContainer);
			this.minimapContainer = null;
		}

		const container = this.getEditorContainer();
		if (container) {
			container.classList.remove("ace-minimap-enabled");
		}
	}

	protected registerAceKeybindings() {
		if (this.config.keyboard) {
			this.aceService.setKeyboardHandler(
				`ace/keyboard/${this.config.keyboard}`
			);
		}

		this.editorScope.register(["Alt"], "p", (event: KeyboardEvent) => {
			event.preventDefault();
			event.stopPropagation();
			ObsidianUtils.runCommandById(this.app, "command-palette:open");
			return false;
		});
	}

	private registerDomEvents(element: HTMLElement) {
		this.registerDomEvent(
			element,
			"focus",
			() => {
				this.app.keymap.pushScope(this.editorScope);
			},
			true
		);

		this.registerDomEvent(
			element,
			"blur",
			() => {
				this.app.keymap.popScope(this.editorScope);
			},
			true
		);

		this.registerDomEvent(
			element,
			"wheel",
			(event: WheelEvent) => {
				if (event.ctrlKey || event.metaKey) {
					event.preventDefault();
					this.handleFontSizeChange(event.deltaY);
				}
			},
			{ passive: false }
		);
	}

	private handleFontSizeChange(deltaY: number) {
		let newFontSize: number;
		if (deltaY > 0) {
			newFontSize = this.aceService.decreaseFontSize(1);
		} else {
			newFontSize = this.aceService.increaseFontSize(1);
		}
		this.config.fontSize = newFontSize;
		this.plugin.updateSettings({ fontSize: newFontSize });
	}
}
