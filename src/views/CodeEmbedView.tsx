import { Ace } from "ace-builds";
import { TFile } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { AcePluginComponent } from "../core/interfaces/component";
import { Embed } from "../core/interfaces/obsidian-extend";
import { getLanguageMode } from "../core/services/AceLanguages";
import { AceService } from "../core/services/AceService";
import AceCodeEditorPlugin from "../main";

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

	React.useEffect(() => {
		const initializeEditor = async () => {
			if (editorRef.current) {
				const data = await plugin.app.vault.read(file);
				aceServiceRef.current = new AceService();
				aceEditorRef.current = aceServiceRef.current.createEditor(
					editorRef.current
				);
				aceServiceRef.current.configureEditor(
					plugin.settings,
					file.extension
				);
				aceServiceRef.current.setValue(data);
				const languageMode = await getLanguageMode(file.extension);
				setLang(languageMode);
			}
		};

		initializeEditor();

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
					plugin: this.plugin,
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
