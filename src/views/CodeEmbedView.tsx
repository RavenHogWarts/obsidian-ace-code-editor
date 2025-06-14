import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { TFile } from "obsidian";
import AceCodeEditorPlugin from "../main";
import { AcePluginComponent } from "../core/interfaces/component";
import { Embed } from "../core/interfaces/obsidian-extend";
import { Ace } from "ace-builds";
import { AceService } from "../core/services/AceService";
import { getLanguageMode } from "../core/services/AceLanguages";

interface CodeEmbedContainerProps {
	plugin: AceCodeEditorPlugin;
	file: TFile;
}

const CodeEmbedContainer: React.FC<CodeEmbedContainerProps> = ({
	plugin,
	file,
}) => {
	const editorRef = React.useRef<HTMLDivElement>(null);
	const aceEditorRef = React.useRef<Ace.Editor | null>(null);
	const aceServiceRef = React.useRef<AceService | null>(null);
	const [lang, setLang] = React.useState<string>();

	React.useEffect(async () => {
		await plugin.app.vault.process(file, (data) => {
			aceServiceRef.current = new AceService();
			aceEditorRef.current = aceServiceRef.current.createEditor(
				editorRef.current
			);
			aceServiceRef.current.configureEditor(
				plugin.settings,
				file.extension
			);
			aceServiceRef.current.setValue(data);
			setLang(getLanguageMode(file.extension));
		});

		return () => {
			if (aceServiceRef.current) {
				aceServiceRef.current.destroy();
				aceServiceRef.current = null;
				aceEditorRef.current = null;
			}
		};
	}, []);

	return (
		<>
			<div className="ace-embed-language-label">{lang}</div>
			<div ref={editorRef} className="ace-embed-editor"></div>
		</>
	);
};

export class CodeEmbedView extends AcePluginComponent implements Embed {
	private contentEl: HTMLElement;
	private root: Root | null = null;
	private file: TFile;

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
		this.root = createRoot(this.contentEl);

		await this.loadFile();
	}

	async loadFile(): Promise<void> {
		if (this.root) {
			this.root.render(
				React.createElement(CodeEmbedContainer, {
					plugin: this,
					file: this.file,
				})
			);
		}
	}

	onunload(): void {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
		super.onunload();
	}
}
