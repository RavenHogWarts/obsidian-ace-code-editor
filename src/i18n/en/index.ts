import type { BaseTranslation } from "../i18n-types";

const en = {
	common: {
		confirm: "Confirm",
		cancel: "Cancel",
		create: "Create",
		save: "Save",
		enable: "Enable",
		disable: "Disable",
		rename: "Rename",
		delete: "Delete",
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
		file_name_with_extension_validate:
			"Custom file name must include extension",
		file_already_exists: "File already exists",
		rename_file_success: "File renamed successfully, {path:string}",
		create_file_success: "File created successfully, {path:string}",
		file_deleted: "File {fileName:string} has been deleted",
	},
	view: {
		snippets: {
			created: "Created at {date:string}",
			modified: "Last modified at {date:string}",
			no_snippets: "No snippets",
			create_new_snippet: "Create new snippet",
			sort_by: "Sort by",
			sort_by_name_asc: "File name (A-Z)",
			sort_by_name_desc: "File name (Z-A)",
			sort_by_mtime_asc: "Modified time (old to new)",
			sort_by_mtime_desc: "Modified time (new to old)",
			sort_by_ctime_asc: "Created time (old to new)",
			sort_by_ctime_desc: "Created time (new to old)",
			batch_operation: "Batch operations",
			enable_all_snippets: "Enable all snippets",
			disable_all_snippets: "Disable all snippets",
			reload_snippets: "Reload snippets",
			enable_snippet: "Enable snippet",
			disable_snippet: "Disable snippet",
			rename_snippet: "Rename snippet",
			delete_snippet: "Delete snippet",
			delete_snippet_message:
				"Are you sure you want to delete snippet {fileName:string}?",
			file_modal_message: "No need to enter extension .css",
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
			file_name_with_extension_placeholder:
				"Enter file name (with extension)",
			preview: "Preview",
			open_file_after_create: "Open file after creation",
		},
		editCodeBlock: {
			header: "Edit code block",
		},
		snippetsFile: {
			header: "Snippet files",
			deleteFile: "Delete file",
			deleteFileMessage:
				"Are you sure you want to delete file {fileName:string}?",
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
} satisfies BaseTranslation;

export default en;
