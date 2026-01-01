import { ConfirmDialog } from "@src/component/confirm-dialog/ConfirmDialog";
import { useResize } from "@src/hooks/useResize";
import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { SnippetUtils } from "@src/utils/SnippetUtils";
import formatDate from "@src/utils/formatDate";
import {
	CaseSensitive,
	CircleEllipsis,
	Edit,
	RefreshCw,
	Search,
	SortAsc,
} from "lucide-react";
import { Menu, Notice } from "obsidian";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CreateFileDialog } from "../confirm-dialog/CreateFileDialog";
import { RenameFileDialog } from "../confirm-dialog/RenameFileDialog";

interface SnippetsNavigationProps {
	plugin: AceCodeEditorPlugin;
	onFileSelect: (fileName: string) => void;
	selectedFile: string | null;
	onResize?: () => void;
}

interface SnippetFile {
	name: string;
	nameWithoutExtension: string;
	modified: number;
	created: number;
	enabled: boolean;
}

type sortType =
	| "name_asc"
	| "name_desc"
	| "mtime_new"
	| "mtime_old"
	| "ctime_new"
	| "ctime_old";

export const SnippetsNavigation: React.FC<SnippetsNavigationProps> = ({
	plugin,
	onFileSelect,
	selectedFile,
	onResize,
}) => {
	const [files, setFiles] = useState<SnippetFile[]>([]);
	const [loading, setLoading] = useState(false);
	const [sortType, setSortType] = useState<sortType>("name_asc");
	const [showSearch, setShowSearch] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [isCaseSensitive, setIsCaseSensitive] = useState(false);
	const searchInputRef = useRef<HTMLInputElement>(null);
	const navRef = useRef<HTMLDivElement>(null);

	const { handleMouseDown, isResizing } = useResize({
		resizeRef: navRef,
		minWidth: 200, // Minimal width
		onResize,
	});

	const loadFiles = useCallback(async () => {
		setLoading(true);
		try {
			const snippetFiles = await SnippetUtils.getSnippetsFiles(
				plugin.app
			);
			const fileNames = await Promise.all(
				snippetFiles.map(async (file) => {
					const fileName = file.split("/").pop() || file;
					const fileNameWithoutExtension = fileName.slice(0, -4);
					const stat = await plugin.app.vault.adapter.stat(file);
					const isEnabled = SnippetUtils.isSnippetEnabled(
						plugin.app,
						fileName
					);
					return {
						name: fileName,
						nameWithoutExtension: fileNameWithoutExtension,
						modified: stat?.mtime || 0,
						created: stat?.ctime || 0,
						enabled: isEnabled,
					};
				})
			);

			setFiles(fileNames);
		} catch (error) {
			console.error("Failed to load snippets", error);
		} finally {
			setLoading(false);
		}
	}, [plugin.app]);

	useEffect(() => {
		loadFiles();
	}, [loadFiles]);

	const sortedFiles = useMemo(() => {
		return [...files].sort((a, b) => {
			switch (sortType) {
				case "name_asc":
					return a.name.localeCompare(b.name);
				case "name_desc":
					return b.name.localeCompare(a.name);
				case "mtime_new":
					return b.modified - a.modified;
				case "mtime_old":
					return a.modified - b.modified;
				case "ctime_new":
					return b.created - a.created;
				case "ctime_old":
					return a.created - b.created;
				default:
					return 0;
			}
		});
	}, [files, sortType]);

	const filteredFiles = useMemo(() => {
		const query = isCaseSensitive
			? searchQuery.trim()
			: searchQuery.trim().toLowerCase();
		if (!query) return sortedFiles;
		return sortedFiles.filter((file) => {
			const fileName = isCaseSensitive
				? file.nameWithoutExtension
				: file.nameWithoutExtension.toLowerCase();
			return fileName.includes(query);
		});
	}, [sortedFiles, searchQuery, isCaseSensitive]);

	const toggleSearch = () => {
		setShowSearch((prev) => {
			if (prev) {
				setSearchQuery("");
			} else {
				setTimeout(() => searchInputRef.current?.focus(), 0);
			}
			return !prev;
		});
	};

	const showSortMenu = (event: React.MouseEvent) => {
		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle(LL.view.snippets.sort_by_name_asc())
				.setIcon("arrow-up-a-z")
				.setChecked(sortType === "name_asc")
				.onClick(() => setSortType("name_asc"))
		);

		menu.addItem((item) =>
			item
				.setTitle(LL.view.snippets.sort_by_name_desc())
				.setIcon("arrow-up-z-a")
				.setChecked(sortType === "name_desc")
				.onClick(() => setSortType("name_desc"))
		);

		menu.addSeparator();

		menu.addItem((item) =>
			item
				.setTitle(LL.view.snippets.sort_by_mtime_desc())
				.setIcon("arrow-up-1-0")
				.setChecked(sortType === "mtime_new")
				.onClick(() => setSortType("mtime_new"))
		);

		menu.addItem((item) =>
			item
				.setTitle(LL.view.snippets.sort_by_mtime_asc())
				.setIcon("arrow-up-0-1")
				.setChecked(sortType === "mtime_old")
				.onClick(() => setSortType("mtime_old"))
		);

		menu.addSeparator();

		menu.addItem((item) =>
			item
				.setTitle(LL.view.snippets.sort_by_ctime_desc())
				.setIcon("arrow-up-1-0")
				.setChecked(sortType === "ctime_new")
				.onClick(() => setSortType("ctime_new"))
		);

		menu.addItem((item) =>
			item
				.setTitle(LL.view.snippets.sort_by_ctime_asc())
				.setIcon("arrow-up-0-1")
				.setChecked(sortType === "ctime_old")
				.onClick(() => setSortType("ctime_old"))
		);

		menu.showAtPosition({ x: event.clientX, y: event.clientY });
	};

	const showBatchMenu = (event: React.MouseEvent) => {
		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle(LL.view.snippets.enable_all_snippets())
				.setIcon("circle-check")
				.onClick(async () => {
					const fileNames = filteredFiles.map((f) => f.name);
					SnippetUtils.toggleBatchSnippetsState(
						plugin.app,
						fileNames,
						true
					);
					loadFiles();
				})
		);

		menu.addItem((item) =>
			item
				.setTitle(LL.view.snippets.disable_all_snippets())
				.setIcon("circle-minus")
				.onClick(async () => {
					const fileNames = filteredFiles.map((f) => f.name);
					SnippetUtils.toggleBatchSnippetsState(
						plugin.app,
						fileNames,
						false
					);
					loadFiles();
				})
		);

		menu.showAtPosition({ x: event.clientX, y: event.clientY });
	};

	const handleCreate = () => {
		new CreateFileDialog(plugin, {
			title: LL.view.snippets.create_new_snippet(),
			message: LL.view.snippets.file_modal_message(),
			onCreate: async (fileName) => {
				try {
					const filePath =
						SnippetUtils.getSnippetsFolder(plugin.app) +
						"/" +
						fileName;
					if (await plugin.app.vault.adapter.exists(filePath)) {
						new Notice(LL.notice.file_already_exists());
						return;
					}
					await plugin.app.vault.adapter.write(
						filePath,
						"/* CSS Snippet */\n"
					);
					new Notice(
						LL.notice.create_file_success({ path: fileName })
					);
					loadFiles();
					onFileSelect(fileName);
				} catch (e) {
					throw new Error(e);
				}
			},
		}).open();
	};

	const handleDelete = (file: SnippetFile) => {
		new ConfirmDialog(plugin, {
			title: LL.view.snippets.delete_snippet(),
			message: LL.view.snippets.delete_snippet_message({
				fileName: file.name,
			}),
			onConfirm: async () => {
				try {
					const path =
						SnippetUtils.getSnippetsFolder(plugin.app) +
						"/" +
						file.name;
					await plugin.app.vault.adapter.remove(path);
					new Notice(
						LL.notice.file_deleted({
							fileName: file.name,
						})
					);
					loadFiles();
				} catch (e) {
					throw new Error(e);
				}
			},
		}).open();
	};

	const handleRename = (file: SnippetFile) => {
		new RenameFileDialog(plugin, {
			title: LL.view.snippets.rename_snippet(),
			message: LL.view.snippets.file_modal_message(),
			oldName: file.name,
			onRename: async (newName) => {
				try {
					const oldPath =
						SnippetUtils.getSnippetsFolder(plugin.app) +
						"/" +
						file.name;
					const newPath =
						SnippetUtils.getSnippetsFolder(plugin.app) +
						"/" +
						newName;
					if (await plugin.app.vault.adapter.exists(newPath)) {
						new Notice(LL.notice.file_already_exists());
						return;
					}
					await plugin.app.vault.adapter.rename(oldPath, newPath);
					new Notice(
						LL.notice.rename_file_success({
							path: newName,
						})
					);
					loadFiles();
					if (file.name === selectedFile) {
						onFileSelect(newName);
					}
				} catch (e) {
					throw new Error(e);
				}
			},
		}).open();
	};

	const handleContextMenu = (event: React.MouseEvent, file: SnippetFile) => {
		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle(
					file.enabled ? LL.common.disable() : LL.common.enable()
				)
				.setIcon(file.enabled ? "circle-minus" : "circle-check")
				.onClick(async () => {
					SnippetUtils.toggleSnippetState(
						plugin.app,
						file.name,
						!file.enabled
					);
					loadFiles();
				})
		);

		menu.addSeparator();

		menu.addItem((item) =>
			item
				.setTitle(LL.common.rename())
				.setIcon("pencil")
				.onClick(() => handleRename(file))
		);

		menu.addItem((item) =>
			item
				.setTitle(LL.common.delete())
				.setIcon("trash")
				.onClick(() => handleDelete(file))
		);

		menu.showAtPosition({ x: event.clientX, y: event.clientY });
	};

	return (
		<div
			className="ace-snippets-navigation"
			ref={navRef}
			style={{ width: "20dvw" }}
		>
			<div className="nav-header">
				<div className="nav-buttons-container">
					<div
						className="clickable-icon nav-action-button"
						aria-label={LL.view.snippets.create_new_snippet()}
						onClick={handleCreate}
					>
						<Edit className={"svg-icon"} size={24} />
					</div>
					<div
						className="clickable-icon nav-action-button"
						aria-label={LL.view.snippets.sort_by()}
						onClick={showSortMenu}
					>
						<SortAsc size={24} className={"svg-icon"} />
					</div>
					<div
						className={`clickable-icon nav-action-button ${
							showSearch ? "is-active" : ""
						}`}
						aria-label={"Search"}
						onClick={toggleSearch}
					>
						<Search size={24} className={"svg-icon"} />
					</div>
					<div
						className="clickable-icon nav-action-button"
						aria-label={LL.view.snippets.batch_operation()}
						onClick={showBatchMenu}
					>
						<CircleEllipsis size={24} className={"svg-icon"} />
					</div>
					<div
						className="clickable-icon nav-action-button"
						onClick={loadFiles}
						aria-label={LL.view.snippets.reload_snippets()}
					>
						<RefreshCw
							size={24}
							className={`svg-icon ${
								loading ? "animate-spin" : ""
							}`}
						/>
					</div>
				</div>

				{showSearch && (
					<div className="search-input-container">
						<input
							ref={searchInputRef}
							type="search"
							spellCheck={false}
							placeholder={LL.view.snippets.search_placeholder()}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Escape") {
									if (searchQuery) {
										setSearchQuery("");
									} else {
										toggleSearch();
									}
								}
							}}
						/>
						{searchQuery && (
							<div
								className="search-input-clear-button"
								aria-label={LL.view.snippets.clear_search()}
								onClick={() => setSearchQuery("")}
							/>
						)}
						<div
							className={`input-right-decorator clickable-icon ${
								isCaseSensitive ? "is-active" : ""
							}`}
							aria-label={LL.view.snippets.case_sensitive()}
							onClick={() => setIsCaseSensitive((prev) => !prev)}
						>
							<CaseSensitive size={18} />
						</div>
					</div>
				)}
			</div>

			<div className="nav-files-container">
				{filteredFiles.map((file) => (
					<div
						key={file.name}
						className={`nav-file-title tappable is-clickable ${
							file.name === selectedFile ? "is-active" : ""
						}`}
						onClick={() => onFileSelect(file.name)}
						onContextMenu={(e) => handleContextMenu(e, file)}
					>
						<div
							className="nav-file-title-content"
							aria-label={
								file.name +
								"\n\n" +
								LL.view.snippets.modified({
									date: formatDate(file.modified),
								}) +
								"\n" +
								LL.view.snippets.created({
									date: formatDate(file.created),
								})
							}
						>
							{file.nameWithoutExtension}
						</div>
					</div>
				))}
				{filteredFiles.length === 0 && !loading && (
					<div className="nav-file-title tappable is-clickable">
						{LL.view.snippets.no_snippets()}
					</div>
				)}
			</div>

			<div
				className={`ace-snippets-resize-handle ${
					isResizing ? "is-resizing" : ""
				}`}
				onMouseDown={handleMouseDown}
			/>
		</div>
	);
};
