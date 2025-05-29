import { BaseMessage } from "../types";

const translations: BaseMessage = {
	common: {
		confirm: "確定",
		cancel: "取消",
		create: "創建",
		save: "保存",
	},
	command: {
		reload: "重載外掛",
		create_code_file: "創建程式碼檔案",
		open_in_code_editor: "在程式碼編輯器中開啟",
		edit_code_block: "編輯程式碼區塊",
		open_css_snippet_manager: "開啟CSS程式碼片段管理器",
	},
	notice: {
		file_name_validate: "檔案名稱不能為空",
		file_name_with_extension_validate: "自定義檔案名必須包含副檔名",
		file_already_exists: "檔案已存在",
		create_file_success: "檔案創建成功，{{path}}",
		create_file_failed: "檔案創建失敗，{{error}}",
		file_deleted: "檔案 {{fileName}} 已刪除",
	},
	modal: {
		createCodeFile: {
			header: "創建程式碼檔案",
			file_type: "檔案類型",
			file_type_placeholder: "選擇檔案類型",
			file_name: "檔案名稱",
			file_name_placeholder: "請輸入檔案名稱",
			file_name_with_extension: "檔案名稱（包含副檔名）",
			file_name_with_extension_placeholder: "輸入檔案名稱（包含副檔名）",
			preview: "預覽",
			open_file_after_create: "創建後開啟檔案",
		},
		editCodeBlock: {
			header: "編輯程式碼區塊",
		},
		snippetsFile: {
			header: "程式碼片段檔案",
			deleteFile: "刪除檔案",
			deleteFileMessage: "確定要刪除檔案 {{fileName}} 嗎？",
			new_snippet_name: "新程式碼片段名稱",
			search_snippets: "搜尋程式碼片段",
			refresh: "重新整理",
			new_snippet: "新程式碼片段",
			open_snippets_folder: "開啟程式碼片段資料夾",
			no_matching_snippets: "沒有匹配的程式碼片段",
			no_snippets: "沒有程式碼片段",
		},
	},
	setting: {
		supportExtensions: {
			name: "註冊檔案副檔名",
			desc: "註冊後，點擊檔案將直接在程式碼編輯器中開啟，修改後需重載外掛",
			placeholder: "輸入檔案副檔名，按下Enter鍵新增",
		},
		snippetsManager: {
			name: "css片段管理",
			desc: "CSS片段管理按鈕是否在底部狀態列顯示，修改後需重載外掛",
		},
		lightTheme: {
			name: "亮色主題",
			desc: "程式碼編輯器的亮色主題",
		},
		darkTheme: {
			name: "暗色主題",
			desc: "程式碼編輯器的暗色主題",
		},
		keyboard: {
			name: "鍵盤",
			desc: "程式碼編輯器的鍵盤樣式",
		},
		lineNumbers: {
			name: "行號",
			desc: "顯示行號",
		},
		fontSize: {
			name: "字體大小",
			desc: "程式碼編輯器的字體大小",
		},
		fontFamily: {
			name: "字體",
			desc: "程式碼編輯器使用的字體",
			placeholder: "選擇或輸入字體名稱",
		},
		tabSize: {
			name: "縮排寬度",
			desc: "tab鍵的寬度",
		},
	},
};

export default translations;
