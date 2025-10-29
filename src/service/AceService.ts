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

import { ICodeEditorConfig, LineRange } from "@/src/type/types";
import { extractLineRange } from "@/src/utils/LineRange";
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
		const settings = this.getEditorSettings(languageMode, config);

		this.editor.setOptions(settings);
		this.editor.session.setMode(`ace/mode/${languageMode}`);

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

	private getEditorSettings(
		languageMode: string,
		config: ICodeEditorConfig
	): Partial<ace.Ace.EditorOptions> {
		return {
			// -- editor选项 --
			// 选中样式 selectionStyle: text [line|text]
			selectionStyle: "text",
			// 高亮当前行 highlightActiveLine: true
			highlightActiveLine: true,
			// 高亮选中文本 highlightSelectedWord: true
			highlightSelectedWord: true,
			// 是否只读 readOnly: false
			readOnly: false,
			// 光标样式 cursorStyle: ace [ace|slim|smooth|wide]
			cursorStyle: "ace",
			// 合并撤销 mergeUndoDeltas: false [always]
			mergeUndoDeltas: "always",
			// 启用行为 behavioursEnabled: true
			behavioursEnabled: true,
			// 启用换行行为 wrapBehavioursEnabled: true
			wrapBehavioursEnabled: true,
			// 自动滚动编辑器到视图 autoScrollEditorIntoView: false
			autoScrollEditorIntoView: false,
			// 复制空选择 copyWithEmptySelection: true
			copyWithEmptySelection: true,
			// 使用软标签  useSoftTabs: false
			useSoftTabs: false,
			// 缩进软换行 indentedSoftWrap: false
			indentedSoftWrap: false,
			// 软标签内导航 navigateWithinSoftTabs: false
			navigateWithinSoftTabs: false,
			// 选中多处 enableMultiselect: true
			enableMultiselect: true,
			// 启用自动缩进 enableAutoIndent: true
			enableAutoIndent: true,
			// 启用键盘辅助功能 enableKeyboardAccessibility: false
			enableKeyboardAccessibility: false,

			// -- renderer选项 --
			// 水平滚动条始终可见 hScrollBarAlwaysVisible: false
			hScrollBarAlwaysVisible: false,
			// 垂直滚动条始终可见 vScrollBarAlwaysVisible: false
			vScrollBarAlwaysVisible: false,
			// 高亮装订线(行号区域) highlightGutterLine: true
			highlightGutterLine: true,
			// 滚动动画 animatedScroll: false
			animatedScroll: false,
			// 显示不可见字符 showInvisibles: false
			showInvisibles: config.showInvisibles,
			// 显示打印边距 showPrintMargin: true
			showPrintMargin: config.showPrintMargin,
			// 设置页边距 printMarginColumn: 80
			printMarginColumn: 80,
			// 显示并设置页边距 printMargin: false
			printMargin: false,
			// 淡入折叠部件 fadeFoldWidgets: false
			fadeFoldWidgets: false,
			// 显示折叠部件 showFoldWidgets: true
			showFoldWidgets: config.showFoldWidgets,
			// 显示行号
			showLineNumbers: config.showLineNumbers,
			// 显示装订线(行号区域) showGutter: true
			showGutter: true,
			// 显示参考线 displayIndentGuides: true
			displayIndentGuides: config.displayIndentGuides,
			// 高亮缩进参考线 highlightIndentGuides: false
			highlightIndentGuides: false,
			// 设置字号
			fontSize: config.fontSize,
			// 设置字体
			fontFamily: Object.values(config.fontFamily).join(","),
			// 至多行数 maxLines
			// 至少行数 minLines
			// 滚动超过末尾 scrollPastEnd: 0
			scrollPastEnd: 0.5,
			// 固定行号区域宽度 fixedWidthGutter: false
			fixedWidthGutter: false,
			// 主题引用路径 theme `ace/theme/${theme}`, 在 updateTheme 中设置

			// -- mouseHandler选项 --
			// 滚动速度 scrollSpeed
			scrollSpeed: 2,
			// 拖拽延时(ms) dragDelay
			dragDelay: 0,
			// 是否启用拖动 dragEnabled: true
			dragEnabled: true,
			// 聚焦超时(ms) focusTimeout
			focusTimeout: 0,
			// 工具提示跟随鼠标 tooltipFollowsMouse: false
			tooltipFollowsMouse: false,

			// -- session选项 --
			// 起始行号 firstLineNumber: 1,
			firstLineNumber: 1,
			// 重做 overwrite
			overwrite: false,
			// 新开行模式 newLineMode: auto [auto|unix|windows]
			newLineMode: "auto",
			// 使用辅助对象
			useWorker: false,
			// 标签大小
			tabSize: config.tabSize,
			// 自动换行 wrap: false ["off"|"free"|"printmargin"|true|false|数字]
			wrap: config.wrap,
			// 换行方法 wrapMethod: "code" ["code"|"text"|"auto"]
			wrapMethod: "code",
			// 折叠样式 foldStyle: markbegin [markbegin|markbeginend|manual]
			foldStyle: "markbegin",
			// 代码匹配模式
			mode: `ace/mode/${languageMode}`,

			// -- 扩展选项 --
			// 启用基本自动完成 enableBasicAutocompletion: false
			enableBasicAutocompletion: true,
			// 启用实时自动完成 enableLiveAutocompletion: false
			enableLiveAutocompletion: true,
			// 启用代码段 enableSnippets: false
			enableSnippets: true,
			// 启用Emmet enableEmmet, 需要 ext-emmet.js 和 emmet 库
			// @deprecated 使用弹性制表位 useElasticTabstops, 需要 ext-elastic_tabstops_lite.js
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
