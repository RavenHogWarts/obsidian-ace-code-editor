import { Ace } from "ace-builds";
import { Maximize2 } from "lucide-react";
import { TFile } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { useSettings } from "../core/hook/useSettings";
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

	const { settings } = useSettings(plugin);

	React.useEffect(() => {
		const initializeEditor = async () => {
			if (editorRef.current) {
				const data = await plugin.app.vault.read(file);
				aceServiceRef.current = new AceService();
				aceEditorRef.current = aceServiceRef.current.createEditor(
					editorRef.current
				);
				aceServiceRef.current.configureEditor(settings, file.extension);

				let contentLines: number;
				// 如果有行范围，使用行范围显示，否则显示全部内容
				if (range) {
					aceServiceRef.current.setValueWithLineRange(data, range);
					contentLines = range.endLine - range.startLine + 1;
				} else {
					aceServiceRef.current.setValue(data);
					contentLines = data.split("\n").length;
				}

				// 设置编辑器高度
				const editorHeight = Math.min(
					contentLines * (settings.fontSize + 4) + 20,
					settings.embedMaxHeight
				);
				editorRef.current.style.height = `${editorHeight}px`;

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

	const handleOpenInNewTab = React.useCallback(async () => {
		// 使用 Obsidian API 在新标签页打开文件
		const leaf = plugin.app.workspace.getLeaf("tab");
		await leaf.openFile(file);

		// 如果有行范围，跳转到指定行
		if (range) {
			// 等待一小段时间确保编辑器已完全加载
			setTimeout(() => {
				const view = leaf.view;
				// 检查是否是代码编辑器视图（ACE编辑器）
				if (view && "aceService" in view && view.aceService) {
					const aceService = view.aceService as AceService;

					// 使用改进的 AceService 方法
					if (range.startLine === range.endLine) {
						// 单行：跳转到指定行并居中显示
						aceService.gotoLine(range.startLine, 0, true, true);
					} else {
						// 多行：跳转到起始行并选中整个范围
						aceService.gotoLine(range.startLine, 0, true, false);
						aceService.selectLineRange(
							range.startLine,
							range.endLine
						);
						aceService.scrollCursorIntoView(true);
					}
				}
			}, 100); // 100ms 延迟确保编辑器已加载
		}
	}, [plugin.app, file, range]);

	return (
		<>
			<div className="ace-embed-header">
				<div className="ace-embed-title">{file.name}</div>
				<div className="ace-embed-header-right">
					<div className="ace-embed-language-label">
						{displayLabel}
					</div>
					<div
						className="ace-embed-link"
						onClick={handleOpenInNewTab}
					>
						<Maximize2 size={16} />
					</div>
				</div>
			</div>
			<div className="ace-embed-content">
				<div ref={editorRef} className="ace-embed-editor"></div>
			</div>
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
