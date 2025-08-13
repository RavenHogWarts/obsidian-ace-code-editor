import { BaseMessage } from "../types";

const translations: BaseMessage = {
	common: {
		confirm: "Confirm",
		cancel: "Cancel",
		create: "Create",
		save: "Save",
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
		create_file_success: "File created successfully, {{path}}",
		create_file_failed: "File creation failed, {{error}}",
		file_deleted: "File {{fileName}} has been deleted",
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
				"Are you sure you want to delete file {{fileName}}?",
			new_snippet_name: "New snippet name",
			search_snippets: "Search snippets",
			refresh: "Refresh",
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
	},
};

export default translations;
