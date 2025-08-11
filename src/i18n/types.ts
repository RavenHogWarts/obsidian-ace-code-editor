import en from "./locales/en";
import zh from "./locales/zh";
import zhTW from "./locales/zhTW";

// 定义支持的语言类型
export const SupportedLocales: Record<string, BaseMessage> = {
	en,
	zh,
	"zh-TW": zhTW,
};

interface IBaseSettingsItem {
	name: string;
	desc: string;
}
type SettingsItem<T = Record<string, never>> = IBaseSettingsItem & T;

// 定义翻译结构类型
export type BaseMessage = {
	common: {
		confirm: string;
		cancel: string;
		create: string;
		save: string;
	};
	notice: {
		file_name_validate: string;
		file_name_with_extension_validate: string;
		file_already_exists: string;
		create_file_success: string;
		create_file_failed: string;
		file_deleted: string;
	};
	command: {
		reload: string;
		create_code_file: string;
		open_in_code_editor: string;
		edit_code_block: string;
		open_css_snippet_manager: string;
		open_settings_view: string;
		quick_config: string;
	};
	modal: {
		createCodeFile: {
			header: string;
			file_type: string;
			file_type_placeholder: string;
			file_name: string;
			file_name_placeholder: string;
			file_name_with_extension: string;
			file_name_with_extension_placeholder: string;
			preview: string;
			open_file_after_create: string;
		};
		editCodeBlock: {
			header: string;
		};
		snippetsFile: {
			header: string;
			deleteFile: string;
			deleteFileMessage: string;
			new_snippet_name: string;
			search_snippets: string;
			refresh: string;
			new_snippet: string;
			open_snippets_folder: string;
			no_matching_snippets: string;
			no_snippets: string;
		};
	};
	setting: {
		tabs: {
			renderer: string;
			session: string;
			editor: string;
			extend: string;
			about: string;
		};
		desc: string;
		supportExtensions: SettingsItem<{
			placeholder: string;
		}>;
		snippetsManager: IBaseSettingsItem;
		lightTheme: IBaseSettingsItem;
		darkTheme: IBaseSettingsItem;
		keyboard: IBaseSettingsItem;
		showLineNumbers: IBaseSettingsItem;
		fontSize: IBaseSettingsItem;
		fontFamily: SettingsItem<{
			placeholder: string;
		}>;
		tabSize: IBaseSettingsItem;
		showPrintMargin: IBaseSettingsItem;
		showInvisibles: IBaseSettingsItem;
		displayIndentGuides: IBaseSettingsItem;
		showFoldWidgets: IBaseSettingsItem;
		highlightActiveLine: IBaseSettingsItem;
		highlightSelectedWord: IBaseSettingsItem;
	};
};

// 生成所有可能的翻译键路径类型
type PathsToStringProps<T> = T extends string
	? []
	: {
			[K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
	  }[Extract<keyof T, string>];

// 将路径数组转换为点号分隔的字符串
type JoinPath<T extends string[]> = T extends []
	? never
	: T extends [infer F]
	? F extends string
		? F
		: never
	: T extends [infer F, ...infer R]
	? F extends string
		? R extends string[]
			? `${F}.${JoinPath<R>}`
			: never
		: never
	: never;

// 生成所有可能的翻译键
export type TranslationKeys = JoinPath<PathsToStringProps<BaseMessage>>;

// 参数类型定义
export type TranslationParams = Record<string, unknown> | unknown[];
