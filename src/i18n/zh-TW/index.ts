import type { BaseTranslation } from "../i18n-types";

const zh_TW = {
	common: {
		confirm: "確定",
		cancel: "取消",
		create: "創建",
		save: "儲存",
		enable: "啟用",
		disable: "禁用",
		rename: "重新命名",
		delete: "刪除",
	},
	command: {
		reload: "重新載入外掛程式",
		create_code_file: "創建程式碼檔案",
		open_in_code_editor: "在程式碼編輯器中開啟",
		edit_code_block: "編輯程式碼區塊",
		open_css_snippet_manager: "開啟CSS程式碼片段管理器",
		open_settings_view: "開啟設定視圖",
		quick_config: "快速配置",
	},
	notice: {
		file_name_validate: "檔案名稱不能為空",
		file_name_with_extension_validate: "自定義檔案名必須包含副檔名",
		file_already_exists: "檔案已存在",
		rename_file_success: "檔案重新命名成功，{path:string}",
		create_file_success: "檔案創建成功，{path:string}",
		file_deleted: "檔案 {fileName:string} 已刪除",
	},
	view: {
		snippets: {
			created: "建檔時間: {date:string}",
			modified: "最後修改時間: {date:string}",
			no_snippets: "沒有發現 CSS 片段",
			create_new_snippet: "新增 CSS 片段",
			sort_by: "排序",
			sort_by_name_asc: "按檔案名升冪排列 (A-Z)",
			sort_by_name_desc: "按檔案名降冪排列 (Z-A)",
			sort_by_mtime_asc: "按編輯時間排序 (從舊到新)",
			sort_by_mtime_desc: "按編輯時間排序 (從新到舊)",
			sort_by_ctime_asc: "按建檔時間排序 (從舊到新)",
			sort_by_ctime_desc: "按建檔時間排序 (從新到舊)",
			batch_operation: "批次操作",
			enable_all_snippets: "啟用所有 CSS 片段",
			disable_all_snippets: "停用所有 CSS 片段",
			reload_snippets: "重新載入 CSS 片段",
			enable_snippet: "啟用 CSS 片段",
			disable_snippet: "停用 CSS 片段",
			rename_snippet: "重新命名 CSS 片段",
			delete_snippet: "刪除 CSS 片段",
			delete_snippet_message:
				"確定要刪除 CSS 片段 {fileName:string} 嗎？",
			file_modal_message: "無需輸入副檔名 .css",
			search_placeholder: "輸入並開始搜尋...",
			case_sensitive: "區分大小寫",
			clear_search: "清除搜尋",
		},
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
	},
	setting: {
		tabs: {
			renderer: "渲染",
			session: "會話",
			editor: "編輯",
			extend: "擴展",
			about: "關於",
		},
		desc: "查看<a href='https://docs.ravenhogwarts.top/obsidian-ace-code-editor/' target='_blank'>wiki文件</a>了解更多功能",
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
			desc: "程式碼編輯器的鍵盤風格",
		},
		showLineNumbers: {
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
		showPrintMargin: {
			name: "顯示列印邊界",
			desc: "程式碼編輯器中的直線",
		},
		showInvisibles: {
			name: "顯示不可見字符",
			desc: "在程式碼編輯器中顯示不可見字符",
		},
		displayIndentGuides: {
			name: "顯示縮排指導線",
			desc: "在程式碼編輯器中顯示縮排指導線",
		},
		showFoldWidgets: {
			name: "顯示折疊小工具",
			desc: "在程式碼編輯器中顯示折疊小工具",
		},
		embedMaxHeight: {
			name: "嵌入程式碼區塊最大高度",
			desc: "嵌入程式碼區塊的最大高度(單位px)，超過該高度將出現滾動條",
		},
		wrap: {
			name: "自動換行",
			desc: "在程式碼編輯器中啟用自動換行，超過編輯器寬度的程式碼將自動換行顯示",
		},
		minimap: {
			enabled: {
				name: "啟用縮略圖",
				desc: "在編輯器右側顯示縮略圖，方便快速導航程式碼",
			},
		},
	},
} satisfies BaseTranslation;

export default zh_TW;
