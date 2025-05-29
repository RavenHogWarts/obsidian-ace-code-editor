import {
	AceDarkThemes,
	AceKeyboard,
	AceLightThemes,
} from "../services/AceThemes";

export const CODE_EDITOR_VIEW_TYPE = "ace-code-editor";

export interface ICodeEditorConfig {
	supportExtensions: string[];
	lightTheme: AceLightThemes;
	darkTheme: AceDarkThemes;
	keyboard: AceKeyboard;
	lineNumbers: boolean;
	fontSize: number;
	fontFamily: string[];
	tabSize: number;
	snippetsManager: {
		location: boolean;
		icon: string;
	};
}

export const DEFAULT_CONFIG: ICodeEditorConfig = {
	supportExtensions: ["js"],
	lightTheme: "chrome",
	darkTheme: "monokai",
	keyboard: "vscode",
	lineNumbers: true,
	fontSize: 14,
	fontFamily: ["Consolas", "Courier New", "monospace"],
	tabSize: 4,
	snippetsManager: {
		location: false,
		icon: "code",
	},
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
