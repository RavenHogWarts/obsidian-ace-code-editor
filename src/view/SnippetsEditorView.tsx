import { SnippetsNavigation } from "@src/component/snippets/SnippetsNavigation";
import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { SNIPPETS_EDITOR_VIEW_TYPE } from "@src/type/types";
import { SnippetUtils } from "@src/utils/SnippetUtils";
import { WorkspaceLeaf } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { AceEditorView } from "./AceEditorView";

export class SnippetsEditorView extends AceEditorView {
	private leftPanel: HTMLElement;
	private rightPanel: HTMLElement;
	private NavigationRoot: Root | null = null;
	private currentFile: string | null = null;
	private snippetsFolder: string;
	private refreshToggleSnippetAction: (() => void) | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: AceCodeEditorPlugin) {
		super(leaf, plugin);
		this.snippetsFolder = SnippetUtils.getSnippetsFolder(this.app);
	}

	getEditorContainer(): HTMLElement {
		// Ensure rightPanel exists before returning it
		if (!this.rightPanel) {
			throw new Error("Right panel not initialized");
		}
		return this.rightPanel;
	}

	getViewType(): string {
		return SNIPPETS_EDITOR_VIEW_TYPE;
	}

	getIcon(): string {
		return "code-xml";
	}

	getDisplayText(): string {
		return "Snippets editor";
	}

	protected getFileExtension(): string {
		return "css";
	}

	async onOpen(): Promise<void> {
		await super.onOpen();
		this.contentEl.empty();
		this.contentEl.addClass("ace-snippets-editor");

		const splitContainer = this.contentEl.createDiv(
			"ace-snippets-split-container"
		);

		this.leftPanel = splitContainer.createDiv("ace-snippets-left-panel");
		this.renderFileNavigation();

		this.rightPanel = splitContainer.createDiv("ace-snippets-right-panel");

		// Only init editor if we have a file selected, otherwise show empty state
		if (this.currentFile) {
			this.init();
			this.aceService.editor?.setOption("readOnly", true);
		} else {
			this.renderEmptyState();
		}

		// this.addActions();

		this.registerEvent(
			this.app.workspace.on("css-change", () => {
				this.refreshToggleSnippetAction?.();
			})
		);
	}

	getState(): Record<string, unknown> {
		return {
			file: this.currentFile,
		};
	}

	async setState(
		state: unknown,
		result: { history: boolean }
	): Promise<void> {
		const viewState = state as Record<string, unknown> | null;
		if (viewState?.file && typeof viewState.file === "string") {
			setTimeout(async () => {
				await this.handleFileSelect(viewState.file as string);
			}, 100);
		}
	}

	async save(clear?: boolean | undefined): Promise<void> {
		if (!this.currentFile) {
			return;
		}
		const content = this.getViewData();
		try {
			await this.app.vault.adapter.write(
				`${this.snippetsFolder}/${this.currentFile}`,
				content
			);
			this.app.customCss.requestLoadSnippets();
		} catch (error) {
			console.error("Failed to save snippet file", error);
		}
	}

	requestSave = () => {
		if (this.currentFile) {
			this.save();
		}
	};

	async onClose() {
		if (this.NavigationRoot) {
			this.NavigationRoot.unmount();
		}
		await super.onClose();
	}

	addActions() {
		super.addActions();

		this.addAction("sidebar-open", "Toggle sidebar", () => {
			if (this.leftPanel) {
				const isCollapsed = this.leftPanel.hasClass("is-collapsed");
				this.leftPanel.toggleClass("is-collapsed", !isCollapsed);

				if (this.aceService.editor) {
					setTimeout(() => {
						this.aceService.editor?.resize();
					}, 310);
				}
			}
		});

		const { refresh } = this.addToggleAction(
			"power",
			"Toggle snippet",
			() =>
				this.currentFile
					? SnippetUtils.isSnippetEnabled(this.app, this.currentFile)
					: false,
			(enabled) => {
				if (this.currentFile) {
					SnippetUtils.toggleSnippetState(
						this.app,
						this.currentFile,
						enabled
					);
				}
			}
		);
		this.refreshToggleSnippetAction = refresh;
	}

	private renderEmptyState() {
		this.rightPanel.empty();
		const emptyState = this.rightPanel.createDiv(
			"ace-snippets-empty-state"
		);
		emptyState.createEl("div", {
			text: LL.view.snippets.no_snippets(),
		});
	}

	private renderFileNavigation() {
		if (!this.NavigationRoot) {
			this.NavigationRoot = createRoot(this.leftPanel);
		}

		this.NavigationRoot.render(
			<StrictMode>
				<SnippetsNavigation
					plugin={this.plugin}
					selectedFile={this.currentFile}
					onFileSelect={(file) => this.handleFileSelect(file)}
					onResize={() => {
						this.aceService.editor?.resize();
					}}
				/>
			</StrictMode>
		);
	}

	private async handleFileSelect(fileName: string) {
		this.currentFile = fileName;
		this.renderFileNavigation();
		this.refreshToggleSnippetAction?.();

		try {
			const content = await this.app.vault.adapter.read(
				`${this.snippetsFolder}/${this.currentFile}`
			);

			// Re-initialize editor if it was in empty state
			if (!this.aceService.isEditorInitialized()) {
				this.rightPanel.empty(); // Clear empty state
				this.init();
			}

			this.aceService.editor?.setOption("readOnly", false);
			this.setViewData(content, true);
		} catch (error) {
			console.error("Failed to load snippet file", error);
		}
	}
}
