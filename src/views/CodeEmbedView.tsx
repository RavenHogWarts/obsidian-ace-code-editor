import { Ace } from "ace-builds";
import { TFile } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { AcePluginComponent } from "../core/interfaces/component";
import { Embed } from "../core/interfaces/obsidian-extend";
import { LineRange } from "../core/interfaces/types";
import { getLanguageMode } from "../core/services/AceLanguages";
import { AceService } from "../core/services/AceService";
import { parseLinkWithRange } from "../core/utils/LineRange";
import AceCodeEditorPlugin from "../main";

interface CodeEmbedContainerProps {
	plugin: AceCodeEditorPlugin;
	file: TFile;
	range?: LineRange;
}

const CodeEmbedContainer: React.FC<CodeEmbedContainerProps> = ({
	plugin,
	file,
	range,
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

				// 如果有行范围，使用行范围显示，否则显示全部内容
				if (range) {
					aceServiceRef.current.setValueWithLineRange(data, range);
				} else {
					aceServiceRef.current.setValue(data);
				}

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

	const displayLabel = React.useMemo(() => {
		if (range) {
			if (range.startLine === range.endLine) {
				return `${lang} (Line ${range.startLine})`;
			} else {
				return `${lang} (Lines ${range.startLine}-${range.endLine})`;
			}
		}
		return lang;
	}, [lang, range]);

	return (
		<>
			<div className="ace-embed-language-label">{displayLabel}</div>
			<div ref={editorRef} className="ace-embed-editor"></div>
		</>
	);
};

export class CodeEmbedView extends AcePluginComponent implements Embed {
	private contentEl: HTMLElement;
	private root: Root | null = null;
	private file: TFile;
	private subpath: string;
	private range: LineRange | null = null;

	constructor(
		plugin: AceCodeEditorPlugin,
		containerEl: HTMLElement,
		file: TFile,
		subpath: string
	) {
		super(plugin);
		this.contentEl = containerEl;
		this.file = file;
		this.subpath = subpath;

		// 解析subpath中的行范围信息
		if (subpath) {
			const parsed = parseLinkWithRange(subpath);
			this.range = parsed.range;
		}
	}

	async onload() {
		super.onload();
		this.contentEl.addClass("ace-embed-view");

		// 如果有行范围，添加特殊样式
		if (this.range) {
			this.contentEl.addClass("line-range");
		}

		this.root = createRoot(this.contentEl);

		await this.loadFile();
	}

	async loadFile(): Promise<void> {
		if (this.root) {
			this.root.render(
				React.createElement(CodeEmbedContainer, {
					plugin: this.plugin,
					file: this.file,
					range: this.range || undefined,
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
