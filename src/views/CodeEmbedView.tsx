import { TFile } from "obsidian";
import AceCodeEditorPlugin from "../main";
import { AcePluginComponent } from "../core/interfaces/component";
import { Embed } from "../core/interfaces/obsidian-extend";
import { Ace } from "ace-builds";
import { AceService } from "../core/services/AceService";

export class CodeEmbedView extends AcePluginComponent implements Embed {
	private contentEl: HTMLElement;
	private file: TFile;
	private editorEl: HTMLDivElement;
	private aceEditor: Ace.Editor | null = null;
	private aceService: AceService | null = null;

	constructor(
		plugin: AceCodeEditorPlugin,
		containerEl: HTMLElement,
		file: TFile,
		subpath: string
	) {
		super(plugin);
		this.contentEl = containerEl;
		this.file = file;
	}

	async onload() {
		super.onload();
		this.contentEl.addClass("ace-embed-view");
		this.editorEl = this.contentEl.createDiv("ace-embed-editor");

		await this.loadFile();
	}

	async loadFile(): Promise<void> {
		if (!this.editorEl) return;

		await this.app.vault.process(this.file, (data) => {
			this.aceService = new AceService();
			this.aceEditor = this.aceService.createEditor(this.editorEl);
			this.aceService.configureEditor(this.settings, this.file.extension);
			this.aceEditor.setReadOnly(true);
			this.aceService.setValue(data);

			return data;
		});
	}

	onunload(): void {
		if (this.aceService) {
			this.aceService.destroy();
			this.aceService = null;
			this.aceEditor = null;
		}
		super.onunload();
	}
}
