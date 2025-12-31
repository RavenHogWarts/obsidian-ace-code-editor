import type { BaseTranslation } from '../i18n-types'

const en = {
	common: {
		confirm: "Confirm",
		cancel: "Cancel",
		create: "Create",
		save: "Save",
		enable: "TODO: 启用",
		disable: "TODO: 禁用",
	},
	command: {
		reload: "Reload plugin",
		create_code_file: "Create code file",
		open_in_code_editor: "Open in code editor",
		edit_code_block: "Edit code block",
		open_css_snippet_manager: "Open CSS snippet manager",
		open_settings_view: "Open settings view",
		quick_config: "Quick configuration",
	},
	notice: {
		file_name_validate: "File name cannot be empty",
		file_name_with_extension_validate: "Custom file name must include extension",
		file_already_exists: "File already exists",
		create_file_success: "File created successfully, {{path}}",
		file_deleted: "File {{fileName}} has been deleted",
	},
	view: {
		snippets: {
			created: "Created at {date:string}",
			modified: "Last modified at {date:string}",
			no_snippets: "No snippets",
			create_new_snippet: "TODO: 新建代码片段",
			sort_by: "TODO: 排序",
			sort_by_name_asc: "TODO: 文件名(A-Z)",
			sort_by_name_desc: "TODO: 文件名(Z-A)",
			sort_by_mtime_asc: "TODO: 修改时间(旧->新)",
			sort_by_mtime_desc: "TODO: 修改时间(新->旧)",
			sort_by_ctime_asc: "TODO: 创建时间(旧->新)",
			sort_by_ctime_desc: "TODO: 创建时间(新->旧)",
			batch_operation: "TODO: 批量操作",
			enable_all_snippets: "TODO: 启用所有代码片段",
			disable_all_snippets: "TODO: 禁用所有代码片段",
			reload_snippets: "TODO: 重新加载代码片段",
			enable_snippet: "TODO: 启用代码片段",
			disable_snippet: "TODO: 禁用代码片段",
			rename_snippet: "TODO: 重命名代码片段",
			delete_snippet: "TODO: 删除代码片段",
		},
	},
	modal: {
		createCodeFile: {
			header: "Create code file",
			file_type: "File type",
			file_type_placeholder: "Select file type",
			file_name: "File name",
			file_name_placeholder: "Please enter file name",
			file_name_with_extension: "File name (with extension)",
			file_name_with_extension_placeholder: "Enter file name (with extension)",
			preview: "Preview",
			open_file_after_create: "Open file after creation",
		},
		editCodeBlock: {
			header: "Edit code block",
		},
		snippetsFile: {
			header: "Snippet files",
			deleteFile: "Delete file",
			deleteFileMessage: "Are you sure you want to delete file {{fileName}}?",
			new_snippet_name: "New snippet name",
			search_snippets: "Search snippets",
			refresh: "Reload snippets",
			new_snippet: "New snippet",
			open_snippets_folder: "Open snippets folder",
			no_matching_snippets: "No matching snippets",
			no_snippets: "No snippets",
		},
	},
	setting: {
		tabs: {
			renderer: "Renderer",
			session: "Session",
			editor: "Editor",
			extend: "Extend",
			about: "About",
		},
		desc: "View <a href='https://docs.ravenhogwarts.top/en/obsidian-ace-code-editor/' target='_blank'>wiki documentation</a> to learn more features",
		supportExtensions: {
			name: "Register file extension",
			desc: "After registration, clicking files will open directly in the code editor. Reload plugin after changes",
			placeholder: "Enter file extension, press enter to add",
		},
		snippetsManager: {
			name: "CSS snippet management",
			desc: "Whether to display CSS snippet management button in status bar. Reload plugin after changes",
		},
		lightTheme: {
			name: "Light theme",
			desc: "Light theme for code editor",
		},
		darkTheme: {
			name: "Dark theme",
			desc: "Dark theme for code editor",
		},
		keyboard: {
			name: "Keyboard",
			desc: "Keyboard style for code editor",
		},
		showLineNumbers: {
			name: "Line numbers",
			desc: "Show line numbers",
		},
		fontSize: {
			name: "Font size",
			desc: "Font size for code editor",
		},
		fontFamily: {
			name: "Font",
			desc: "Font used by code editor",
			placeholder: "Select or enter font name",
		},
		tabSize: {
			name: "Indentation width",
			desc: "Width of tab key",
		},
		showPrintMargin: {
			name: "Show print margin",
			desc: "Vertical line in code editor",
		},
		showInvisibles: {
			name: "Show invisibles",
			desc: "Display invisible characters in code editor",
		},
		displayIndentGuides: {
			name: "Display indent guides",
			desc: "Show indent guides in code editor",
		},
		showFoldWidgets: {
			name: "Show fold widgets",
			desc: "Display fold widgets in code editor",
		},
		embedMaxHeight: {
			name: "Embed code block max height",
			desc: "Maximum height of embedded code blocks (in px). A scrollbar will appear if this height is exceeded",
		},
		wrap: {
			name: "Auto wrap",
			desc: "Enable auto wrap in code editor. Code exceeding the editor width will automatically wrap",
		},
		minimap: {
			enabled: {
				name: "Enable minimap",
				desc: "Show minimap on the right side of the editor for quick navigation",
			},
		},
	},
} satisfies BaseTranslation

export default en
