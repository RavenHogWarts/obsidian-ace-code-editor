import { ConfirmDialog } from "@src/component/confirm-dialog/ConfirmDialog";
import { RenameFileModal } from "@src/component/modal/RenameFileModal";
import { useResize } from "@src/hooks/useResize";
import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { SnippetUtils } from "@src/utils/SnippetUtils";
import formatDate from "@src/utils/formatDate";
import { Edit, ListChecks, RefreshCw, SortAsc } from "lucide-react";
import { Menu, Notice } from "obsidian";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

	const showSortMenu = (event: React.MouseEvent) => {
		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle("文件名(A-Z)")
				.setIcon("arrow-up-a-z")
				.setChecked(sortType === "name_asc")
				.onClick(() => setSortType("name_asc"))
		);

		menu.addItem((item) =>
			item
				.setTitle("文件名(Z-A)")
				.setIcon("arrow-up-z-a")
				.setChecked(sortType === "name_desc")
				.onClick(() => setSortType("name_desc"))
		);

		menu.addSeparator();

		menu.addItem((item) =>
			item
				.setTitle("编辑时间 (从新到旧)")
				.setIcon("arrow-up-1-0")
				.setChecked(sortType === "mtime_new")
				.onClick(() => setSortType("mtime_new"))
		);

		menu.addItem((item) =>
			item
				.setTitle("编辑时间 (从旧到新)")
				.setIcon("arrow-up-0-1")
				.setChecked(sortType === "mtime_old")
				.onClick(() => setSortType("mtime_old"))
		);

		menu.addSeparator();

		menu.addItem((item) =>
			item
				.setTitle("创建时间 (从新到旧)")
				.setIcon("arrow-up-1-0")
				.setChecked(sortType === "ctime_new")
				.onClick(() => setSortType("ctime_new"))
		);

		menu.addItem((item) =>
			item
				.setTitle("创建时间 (从旧到新)")
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
				.setTitle("启用所有")
				.setIcon("circle-check")
				.onClick(async () => {
					await SnippetUtils.toggleAllSnippetsState(plugin.app, true);
					loadFiles();
				})
		);

		menu.addItem((item) =>
			item
				.setTitle("禁用所有")
				.setIcon("circle-minus")
				.onClick(async () => {
					await SnippetUtils.toggleAllSnippetsState(
						plugin.app,
						false
					);
					loadFiles();
				})
		);

		menu.showAtPosition({ x: event.clientX, y: event.clientY });
	};

	const handleContextMenu = (event: React.MouseEvent, file: SnippetFile) => {
		const menu = new Menu();

		menu.addItem((item) =>
			item
				.setTitle(file.enabled ? "禁用" : "启用")
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
				.setTitle("重命名")
				.setIcon("pencil")
				.onClick(() => {
					new RenameFileModal(
						plugin.app,
						file.name,
						async (newName) => {
							try {
								const oldPath =
									SnippetUtils.getSnippetsFolder(plugin.app) +
									"/" +
									file.name;
								const newPath =
									SnippetUtils.getSnippetsFolder(plugin.app) +
									"/" +
									newName;
								if (
									await plugin.app.vault.adapter.exists(
										newPath
									)
								) {
									new Notice("文件名已存在");
									return;
								}
								await plugin.app.vault.adapter.rename(
									oldPath,
									newPath
								);
								new Notice("重命名成功");
								loadFiles();
								if (file.name === selectedFile) {
									onFileSelect(newName);
								}
							} catch (e) {
								new Notice("重命名失败: " + e.message);
							}
						}
					).open();
				})
		);

		menu.addItem((item) =>
			item
				.setTitle("删除")
				.setIcon("trash")
				.onClick(() => {
					new ConfirmDialog(plugin, {
						title: "删除片段",
						message: `确定要删除 ${file.name} 吗？`,
						onConfirm: async () => {
							try {
								const path =
									SnippetUtils.getSnippetsFolder(plugin.app) +
									"/" +
									file.name;
								await plugin.app.vault.adapter.remove(path);
								new Notice("删除成功");
								loadFiles();
								// Consider handling selection clear if needed
							} catch (e) {
								new Notice("删除失败: " + e.message);
							}
						},
					}).open();
				})
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
					<div className="clickable-icon nav-action-button">
						<Edit
							className={"svg-icon"}
							size={24}
							aria-label="新建"
						/>
					</div>
					<div className="clickable-icon nav-action-button">
						<SortAsc
							size={24}
							className={"svg-icon"}
							onClick={showSortMenu}
							aria-label="排序"
						/>
					</div>
					<div className="clickable-icon nav-action-button">
						<ListChecks
							size={24}
							className={"svg-icon"}
							onClick={showBatchMenu}
							aria-label="批量操作"
						/>
					</div>
					<div className="clickable-icon nav-action-button">
						<RefreshCw
							size={24}
							className={`svg-icon ${
								loading ? "animate-spin" : ""
							}`}
							onClick={loadFiles}
							aria-label="重载"
						/>
					</div>
				</div>
			</div>

			<div className="nav-files-container">
				{sortedFiles.map((file) => (
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
				{sortedFiles.length === 0 && !loading && (
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
