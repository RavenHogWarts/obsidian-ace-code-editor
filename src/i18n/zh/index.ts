import type { BaseTranslation } from "../i18n-types";

const zh = {
	common: {
		confirm: "确定",
		cancel: "取消",
		create: "创建",
		save: "保存",
		enable: "启用",
		disable: "禁用",
		rename: "重命名",
		delete: "删除",
	},
	command: {
		reload: "重载插件",
		create_code_file: "创建代码文件",
		open_in_code_editor: "在代码编辑器中打开",
		edit_code_block: "编辑代码块",
		open_css_snippet_manager: "打开css片段管理器",
		open_settings_view: "打开设置视图",
		quick_config: "快速配置",
	},
	notice: {
		file_name_validate: "文件名不能为空",
		file_name_with_extension_validate: "自定义文件名必须包含扩展名",
		file_already_exists: "文件已存在",
		rename_file_success: "文件重命名成功，{path:string}",
		create_file_success: "文件创建成功，{path:string}",
		file_deleted: "文件 {fileName:string} 已删除",
	},
	view: {
		snippets: {
			created: "创建于 {date:string}",
			modified: "最后修改于 {date:string}",
			no_snippets: "没有发现代码片段",
			create_new_snippet: "新建代码片段",
			sort_by: "排序",
			sort_by_name_asc: "文件名(A-Z)",
			sort_by_name_desc: "文件名(Z-A)",
			sort_by_mtime_asc: "修改时间(旧->新)",
			sort_by_mtime_desc: "修改时间(新->旧)",
			sort_by_ctime_asc: "创建时间(旧->新)",
			sort_by_ctime_desc: "创建时间(新->旧)",
			batch_operation: "批量操作",
			enable_all_snippets: "启用所有代码片段",
			disable_all_snippets: "禁用所有代码片段",
			reload_snippets: "重新加载代码片段",
			enable_snippet: "启用代码片段",
			disable_snippet: "禁用代码片段",
			rename_snippet: "重命名代码片段",
			delete_snippet: "删除代码片段",
			delete_snippet_message: "确定要删除代码片段 {fileName:string} 吗？",
			file_modal_message: "无需输入后缀 .css",
			search_placeholder: "请输入并开始搜索...",
			case_sensitive: "区分大小写",
			clear_search: "清除搜索",
		},
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
	},
	setting: {
		tabs: {
			renderer: "渲染",
			session: "会话",
			editor: "编辑",
			extend: "扩展",
			about: "关于",
		},
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
		showLineNumbers: {
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
		showPrintMargin: {
			name: "打印边距",
			desc: "显示代码编辑器中的竖线",
		},
		showInvisibles: {
			name: "不可见字符",
			desc: "在代码编辑器中显示不可见字符",
		},
		displayIndentGuides: {
			name: "缩进参考线",
			desc: "在代码编辑器中显示缩进参考线",
		},
		showFoldWidgets: {
			name: "折叠部件",
			desc: "在代码编辑器中显示折叠部件",
		},
		embedMaxHeight: {
			name: "嵌入代码块最大高度",
			desc: "嵌入代码块的最大高度(单位px)，超过该高度将出现滚动条",
		},
		wrap: {
			name: "自动换行",
			desc: "在代码编辑器中启用自动换行，超过编辑器宽度的代码将自动换行显示",
		},
		minimap: {
			enabled: {
				name: "启用缩略图",
				desc: "在编辑器右侧显示缩略图，方便快速导航代码",
			},
		},
	},
} satisfies BaseTranslation;

export default zh;
