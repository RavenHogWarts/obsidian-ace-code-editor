import { BaseMessage } from "../types";

const translations: BaseMessage = {
	common: {
		confirm: "确定",
		cancel: "取消",
		create: "创建",
		save: "保存",
	},
	command: {
		reload: "重载插件",
		create_code_file: "创建代码文件",
		open_in_code_editor: "在代码编辑器中打开",
		edit_code_block: "编辑代码块",
		open_css_snippet_manager: "打开CSS代码片段管理器",
	},
	notice: {
		file_name_validate: "文件名不能为空",
		file_name_with_extension_validate: "自定义文件名必须包含扩展名",
		file_already_exists: "文件已存在",
		create_file_success: "文件创建成功，{{path}}",
		create_file_failed: "文件创建失败，{{error}}",
		file_deleted: "文件 {{fileName}} 已删除",
	},
	modal: {
		createCodeFile: {
			header: "创建代码文件",
			file_type: "文件类型",
			file_type_placeholder: "选择文件类型",
			file_name: "文件名",
			file_name_placeholder: "请输入文件名",
			file_name_with_extension: "文件名（包含扩展名）",
			file_name_with_extension_placeholder: "输入文件名（包含扩展名）",
			preview: "预览",
			open_file_after_create: "创建后打开文件",
		},
		editCodeBlock: {
			header: "编辑代码块",
		},
		snippetsFile: {
			header: "代码片段文件",
			deleteFile: "删除文件",
			deleteFileMessage: "确定要删除文件 {{fileName}} 吗？",
			new_snippet_name: "新代码片段名称",
			search_snippets: "搜索代码片段",
			refresh: "刷新",
			new_snippet: "新代码片段",
			open_snippets_folder: "打开代码片段文件夹",
			no_matching_snippets: "没有匹配的代码片段",
			no_snippets: "没有代码片段",
		},
	},
	setting: {
		desc: "查看<a href='https://docs.ravenhogwarts.top/obsidian-ace-code-editor/' target='_blank'>wiki文档</a>了解更多功能",
		supportExtensions: {
			name: "注册文件类型",
			desc: "注册后，点击文件将直接在代码编辑器中打开，修改后需重载插件",
			placeholder: "输入文件扩展名，按下Enter键添加",
		},
		snippetsManager: {
			name: "css片段管理",
			desc: "css片段管理按钮是否在底部状态栏显示，修改后需重载插件",
		},
		lightTheme: {
			name: "亮色主题",
			desc: "代码编辑器的亮色主题",
		},
		darkTheme: {
			name: "暗色主题",
			desc: "代码编辑器的暗色主题",
		},
		keyboard: {
			name: "键盘",
			desc: "代码编辑器的键盘风格",
		},
		lineNumbers: {
			name: "行号",
			desc: "显示行号",
		},
		fontSize: {
			name: "字体大小",
			desc: "代码编辑器的字体大小",
		},
		fontFamily: {
			name: "字体",
			desc: "代码编辑器使用的字体",
			placeholder: "选择或输入字体名称",
		},
		tabSize: {
			name: "缩进宽度",
			desc: "tab键的宽度",
		},
	},
};

export default translations;
