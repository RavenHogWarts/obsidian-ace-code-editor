import { BaseMessage } from "../types";

const translations: BaseMessage = {
	common: {
		confirm: "Confirm",
		cancel: "Cancel",
		create: "Create",
		save: "Save",
	},
	command: {
		reload: "Reload Plugin",
		create_code_file: "Create Code File",
		open_in_code_editor: "Open in Code Editor",
		edit_code_block: "Edit Code Block",
		open_css_snippet_manager: "Open CSS Snippet Manager",
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
			header: "Create Code File",
			file_type: "File Type",
			file_type_placeholder: "Select file type",
			file_name: "File Name",
			file_name_placeholder: "Please enter file name",
			file_name_with_extension: "File Name (with extension)",
			file_name_with_extension_placeholder:
				"Enter file name (with extension)",
			preview: "Preview",
			open_file_after_create: "Open file after creation",
		},
		editCodeBlock: {
			header: "Edit Code Block",
		},
		snippetsFile: {
			header: "Snippet Files",
			deleteFile: "Delete File",
			deleteFileMessage:
				"Are you sure you want to delete file {{fileName}}?",
			new_snippet_name: "New Snippet Name",
			search_snippets: "Search Snippets",
			refresh: "Refresh",
			new_snippet: "New Snippet",
			open_snippets_folder: "Open Snippets Folder",
			no_matching_snippets: "No matching snippets",
			no_snippets: "No snippets",
		},
	},
	setting: {
		title: "Code Editor",
		desc: "Based on Ace-Editor",
		supportExtensions: {
			name: "Register File Extensions",
			desc: "After registration, clicking files will open directly in the code editor. Reload plugin after changes",
		},
		snippetsManager: {
			name: "CSS Snippet Management",
			desc: "Display of CSS snippet management button. Reload plugin after changes",
			location: {
				Null: "Don't show",
				Ribbon: "Show in sidebar toolbar",
				StatusBar: "Show in bottom status bar",
			},
		},
		lightTheme: {
			name: "Light Theme",
			desc: "Light theme for code editor",
		},
		darkTheme: {
			name: "Dark Theme",
			desc: "Dark theme for code editor",
		},
		keyboard: {
			name: "Keyboard",
			desc: "Keyboard style for code editor",
		},
		lineNumbers: {
			name: "Line Numbers",
			desc: "Show line numbers",
		},
		fontSize: {
			name: "Font Size",
			desc: "Font size for code editor",
		},
		fontFamily: {
			name: "Font",
			desc: "Font used by code editor",
		},
		tabSize: {
			name: "Indentation Width",
			desc: "Width of tab key",
		},
	},
};

export default translations;
