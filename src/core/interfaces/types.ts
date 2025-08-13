import {
	AceDarkThemes,
	AceKeyboard,
	AceLightThemes,
} from "../../service/AceThemes";

export const CODE_EDITOR_VIEW_TYPE = "ace-code-editor";

export interface ICodeEditorConfig {
	supportExtensions: string[];
	lightTheme: AceLightThemes;
	darkTheme: AceDarkThemes;
	keyboard: AceKeyboard;
	showLineNumbers: boolean;
	fontSize: number;
	fontFamily: string[];
	tabSize: number;
	snippetsManager: {
		location: boolean;
		icon: string;
	};
	showPrintMargin: boolean;
	showInvisibles: boolean;
	displayIndentGuides: boolean;
	showFoldWidgets: boolean;
	embedMaxHeight: number;
}

export const DEFAULT_CONFIG: ICodeEditorConfig = {
	supportExtensions: ["js"],
	lightTheme: "chrome",
	darkTheme: "monokai",
	keyboard: "default",
	showLineNumbers: true,
	fontSize: 14,
	fontFamily: ["Consolas", "Courier New", "monospace"],
	tabSize: 4,
	snippetsManager: {
		location: false,
		icon: "code",
	},
	showPrintMargin: true,
	showInvisibles: false,
	displayIndentGuides: true,
	showFoldWidgets: true,
	embedMaxHeight: 500,
};

export interface ICodeBlock {
	language: string;
	code: string;
	range: { start: number; end: number };
	context?: {
		isInCallout: boolean;
		calloutType?: string;
		calloutStartLine?: number;
	};
	indent?: number;
}

export interface LineRange {
	startLine: number;
	endLine: number;
}
