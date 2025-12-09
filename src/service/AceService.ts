import * as ace from "ace-builds";
import "ace-builds/esm-resolver";
// 导入扩展
import "./AceExtensions";
// 导入语言包
// import "./AceLanguages";
// 导入主题
// import "./AceThemes";
// 导入键盘绑定
// import "ace-builds/src-noconflict/keybinding-emacs";
// import "ace-builds/src-noconflict/keybinding-sublime";
// import "ace-builds/src-noconflict/keybinding-vim";
// import "ace-builds/src-noconflict/keybinding-vscode";

import { ICodeEditorConfig, LineRange } from "@src/type/types";
import { extractLineRange } from "@src/utils/LineRange";
import { getLanguageMode } from "./AceLanguages";
import { getAceTheme } from "./AceThemes";

export class AceService {
	private editor: ace.Ace.Editor | null = null;

	constructor() {
		// esm-resolver 会自动处理模块路径，无需设置 basePath
	}

	isEditorInitialized(): boolean {
		return this.editor !== null;
	}

	createEditor(element: HTMLElement): ace.Ace.Editor {
		this.editor = ace.edit(element);
		return this.editor;
	}

	async configureEditor(config: ICodeEditorConfig, fileExtension: string) {
		if (!this.editor) return;

		const languageMode = await this.getLanguageMode(fileExtension);

		this.editor.setOptions(this.getEditorOptions(config));
		this.editor.session.setOptions(
			this.getEditSessionOptions(config, languageMode)
		);

		// 设置键盘处理器
		if (config.keyboard === "default") {
			this.editor.setKeyboardHandler(null); // 使用 Ace Editor 默认键盘处理器
		} else {
			this.editor.setKeyboardHandler(`ace/keyboard/${config.keyboard}`);
		}

		this.updateTheme(config.lightTheme, config.darkTheme);
	}

	async updateTheme(lightTheme: string, darkTheme: string) {
		if (!this.editor) return;
		const themeName = document.body.classList.contains("theme-dark")
			? darkTheme
			: lightTheme;

		const theme = await getAceTheme(themeName);

		this.editor.setTheme(`ace/theme/${theme}`);
	}

	getValue(): string {
		return this.editor?.getValue() ?? "";
	}

	setValue(content: string, cursorPos?: number) {
		if (!this.editor) return;

		if (cursorPos !== undefined) {
			const currentPos = this.editor.getCursorPosition();
			this.editor.setValue(content, cursorPos);
			if (cursorPos === -1) {
				this.editor.moveCursorToPosition(currentPos);
				this.editor.clearSelection();
			}
		} else {
			this.editor.setValue(content);
		}

		// 重置撤销管理器以防止初始化时的撤销问题
		this.editor.getSession().getUndoManager().reset();
	}

	resize() {
		this.editor?.resize();
	}

	hasFocus(): boolean {
		return this.editor?.isFocused() ?? false;
	}

	setKeyboardHandler(handler: string): void {
		if (!this.editor) return;
		this.editor.setKeyboardHandler(handler);
	}

	destroy() {
		if (this.editor) {
			this.editor.destroy();
			this.editor = null;
		}
	}

	public async getLanguageMode(extension: string): Promise<string> {
		const aliasStart = "run-";
		if (extension.startsWith(aliasStart)) {
			extension = extension.slice(aliasStart.length);
		}

		return await getLanguageMode(extension);
	}

	private getEditorOptions(
		config: ICodeEditorConfig
	): Partial<ace.Ace.EditorOptions> {
		return {
			// -- EditorOptions --
			// selectionStyle: "fullLine" | "screenLine" | "text" | "line";
			selectionStyle: "text",
			// highlightActiveLine: boolean;
			highlightActiveLine: true,
			// highlightSelectedWord: boolean;
			highlightSelectedWord: true,
			// readOnly: boolean;
			readOnly: false,
			// copyWithEmptySelection: boolean;
			copyWithEmptySelection: true,
			// cursorStyle: "ace" | "slim" | "smooth" | "wide";
			cursorStyle: "ace",
			// mergeUndoDeltas: true | false | "always";
			mergeUndoDeltas: "always",
			// behavioursEnabled: boolean;
			behavioursEnabled: true,
			// wrapBehavioursEnabled: boolean;
			wrapBehavioursEnabled: true,
			// enableAutoIndent: boolean;
			enableAutoIndent: true,
			// enableBasicAutocompletion: boolean | Completer[];
			enableBasicAutocompletion: true,
			// enableLiveAutocompletion: boolean | Completer[];
			enableLiveAutocompletion: true,
			// liveAutocompletionDelay: number;
			// liveAutocompletionThreshold: number;
			// enableSnippets: boolean;
			enableSnippets: true,
			// autoScrollEditorIntoView: boolean;
			autoScrollEditorIntoView: false,
			// keyboardHandler: string | null;
			// placeholder: string;
			// value: string;
			// session: EditSession;
			// relativeLineNumbers: boolean;
			// enableMultiselect: boolean;
			enableMultiselect: true,
			// enableKeyboardAccessibility: boolean;
			enableKeyboardAccessibility: false,
			// enableCodeLens: boolean;
			// textInputAriaLabel: string;
			// enableMobileMenu: boolean;

			// -- VirtualRendererOptions --
			// animatedScroll: boolean;
			animatedScroll: false,
			// showInvisibles: boolean;
			showInvisibles: config.showInvisibles,
			// showPrintMargin: boolean;
			showPrintMargin: config.showPrintMargin,
			// printMarginColumn: number;
			printMarginColumn: 80,
			// printMargin: boolean | number;
			printMargin: false,
			// showGutter: boolean;
			showGutter: true,
			// fadeFoldWidgets: boolean;
			fadeFoldWidgets: false,
			// showFoldWidgets: boolean;
			showFoldWidgets: config.showFoldWidgets,
			// showLineNumbers: boolean;
			showLineNumbers: config.showLineNumbers,
			// displayIndentGuides: boolean;
			displayIndentGuides: config.displayIndentGuides,
			// highlightIndentGuides: boolean;
			highlightIndentGuides: false,
			// highlightGutterLine: boolean;
			highlightGutterLine: true,
			// hScrollBarAlwaysVisible: boolean;
			hScrollBarAlwaysVisible: false,
			// vScrollBarAlwaysVisible: boolean;
			vScrollBarAlwaysVisible: false,
			// fontSize: string | number;
			fontSize: config.fontSize,
			// fontFamily: string;
			fontFamily: Object.values(config.fontFamily).join(","),
			// maxLines: number;
			// minLines: number;
			// scrollPastEnd: number;
			scrollPastEnd: 0.5,
			// fixedWidthGutter: boolean;
			fixedWidthGutter: false,
			// customScrollbar: boolean;
			// theme: string;
			// hasCssTransforms: boolean;
			// maxPixelHeight: number;
			// useSvgGutterIcons: boolean;
			// showFoldedAnnotations: boolean;
			// useResizeObserver: boolean;

			// -- MouseHandlerOptions --
			// scrollSpeed: number;
			scrollSpeed: 2,
			// dragDelay: number;
			dragDelay: 0,
			// dragEnabled: boolean;
			dragEnabled: true,
			// focusTimeout: number;
			focusTimeout: 0,
		};
	}

	private getEditSessionOptions(
		config: ICodeEditorConfig,
		languageMode: string
	): Partial<ace.Ace.EditSessionOptions> {
		return {
			// wrap: "off" | "free" | "printmargin" | boolean | number;
			wrap: config.wrap,
			// wrapMethod: "code" | "text" | "auto";
			wrapMethod: "code",
			// indentedSoftWrap: boolean;
			indentedSoftWrap: false,
			// firstLineNumber: number;
			firstLineNumber: 1,
			// useWorker: boolean;
			useWorker: false,
			// useSoftTabs: boolean;
			useSoftTabs: false,
			// tabSize: number;
			tabSize: config.tabSize,
			// navigateWithinSoftTabs: boolean;
			navigateWithinSoftTabs: false,
			// foldStyle: "markbegin" | "markbeginend" | "manual";
			foldStyle: "markbegin",
			// overwrite: boolean;
			overwrite: false,
			// newLineMode: "auto" | "unix" | "windows";
			newLineMode: "auto",
			// mode: string;
			mode: `ace/mode/${languageMode}`,
		};
	}

	getEditor(): ace.Ace.Editor | null {
		return this.editor;
	}

	// 字体大小控制方法
	setFontSize(fontSize: number): void {
		if (!this.editor) return;
		this.editor.setOption("fontSize", fontSize);
	}

	getFontSize(): number {
		if (!this.editor) return 14;
		const fontSize = this.editor.getOption("fontSize");
		return typeof fontSize === "number" ? fontSize : 14;
	}

	increaseFontSize(step: number = 1): number {
		const currentSize = this.getFontSize();
		const newSize = Math.min(currentSize + step, 48); // 最大字体大小限制为48
		this.setFontSize(newSize);
		return newSize;
	}

	decreaseFontSize(step: number = 1): number {
		const currentSize = this.getFontSize();
		const newSize = Math.max(currentSize - step, 8); // 最小字体大小限制为8
		this.setFontSize(newSize);
		return newSize;
	}

	/**
	 * 设置显示特定行范围的内容
	 * @param content 完整文件内容
	 * @param range 要显示的行范围
	 */
	setValueWithLineRange(content: string, range: LineRange): void {
		if (!this.editor) return;

		// 提取指定行范围的内容
		const rangeContent = extractLineRange(content, range);

		// 设置内容
		this.setValue(rangeContent);

		// 设置起始行号
		this.editor.session.setOption("firstLineNumber", range.startLine);
	}

	/**
	 * 设置起始行号
	 * @param lineNumber 起始行号
	 */
	setFirstLineNumber(lineNumber: number): void {
		if (!this.editor) return;
		this.editor.session.setOption("firstLineNumber", lineNumber);
	}

	/**
	 * 跳转到指定行并可选择是否居中显示
	 * @param lineNumber 行号（1-based）
	 * @param column 列号，默认为0
	 * @param animate 是否动画滚动
	 * @param center 是否居中显示
	 */
	gotoLine(
		lineNumber: number,
		column: number = 0,
		animate: boolean = false,
		center: boolean = true
	): void {
		if (!this.editor) return;

		// 使用 ACE Editor 的 gotoLine 方法
		this.editor.gotoLine(lineNumber, column, animate);

		// 如果需要居中显示
		if (center) {
			this.editor.centerSelection();
		}
	}

	/**
	 * 滚动到指定行
	 * @param lineNumber 行号（1-based）
	 * @param center 是否居中显示
	 * @param animate 是否动画滚动
	 */
	scrollToLine(
		lineNumber: number,
		center: boolean = true,
		animate: boolean = false
	): void {
		if (!this.editor) return;
		this.editor.scrollToLine(lineNumber - 1, center, animate);
	}

	/**
	 * 选中指定行范围
	 * @param startLine 开始行号（1-based）
	 * @param endLine 结束行号（1-based）
	 * @param startColumn 开始列号，默认为0
	 * @param endColumn 结束列号，默认为行末
	 */
	selectLineRange(
		startLine: number,
		endLine: number,
		startColumn: number = 0,
		endColumn?: number
	): void {
		if (!this.editor) return;

		// 如果没有指定结束列号，使用行的长度
		if (endColumn === undefined) {
			const line = this.editor.session.getLine(endLine - 1);
			endColumn = line ? line.length : 0;
		}

		// 设置选择范围（ACE使用0-based索引）
		this.editor.selection.setRange({
			start: { row: startLine - 1, column: startColumn },
			end: { row: endLine - 1, column: endColumn },
		});
	}

	/**
	 * 移动光标到指定位置
	 * @param line 行号（1-based）
	 * @param column 列号
	 */
	moveCursorTo(line: number, column: number = 0): void {
		if (!this.editor) return;
		// ACE Editor 使用 0-based 索引
		this.editor.moveCursorTo(line - 1, column);
	}

	/**
	 * 滚动光标到可见区域
	 * @param center 是否居中显示
	 */
	scrollCursorIntoView(center: boolean = false): void {
		if (!this.editor) return;
		if (center) {
			this.editor.centerSelection();
		} else {
			this.editor.renderer.scrollCursorIntoView();
		}
	}
}
