import { ConfirmDialog } from "@src/component/confirm-dialog/ConfirmDialog";
import { Input } from "@src/component/input/Input";
import { Toggle } from "@src/component/toggle/Toggle";
import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import {
	Code2,
	FilePlus2,
	FileX,
	FolderCode,
	RefreshCcw,
	Search,
	SquarePen,
	Trash2,
} from "lucide-react";
import { App, Notice } from "obsidian";
import { useEffect, useRef, useState } from "react";

interface SnippetsFileModalProps {
	onClose: () => void;
	app: App;
	plugin: AceCodeEditorPlugin;
	snippetsFolder: string;
	openExternalFile: (path: string, newTab: boolean) => Promise<void>;
}

interface SnippetFile {
	name: string;
	lastModified?: number;
	enabled?: boolean;
}

const SnippetsFileModal: React.FC<SnippetsFileModalProps> = ({
	onClose,
	app,
	plugin,
	snippetsFolder,
	openExternalFile,
}) => {
	const [files, setFiles] = useState<SnippetFile[]>([]);
	const [isCreatingNew, setIsCreatingNew] = useState(false);
	const [newFileName, setNewFileName] = useState("");
	const [searchQuery, setSearchQuery] = useState("");
	const newFileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		loadSnippetsFiles();
	}, []);

	useEffect(() => {
		if (isCreatingNew && newFileInputRef.current) {
			newFileInputRef.current.focus();
		}
	}, [isCreatingNew]);

	const loadSnippetsFiles = async () => {
		const adapter = app.vault.adapter;
		const exists = await adapter.exists(snippetsFolder);

		if (!exists) {
			await adapter.mkdir(snippetsFolder);
		}

		const snippetFiles = await adapter.list(snippetsFolder);
		const cssFiles = await Promise.all(
			snippetFiles.files
				.filter((file) => file.endsWith(".css"))
				.map(async (file) => {
					const fileName = file.split("/").pop() || file;
					const fileNameWithoutExtension = fileName.endsWith(".css")
						? fileName.slice(0, -4)
						: fileName;
					const stat = await adapter.stat(file);
					const isEnabled = app.customCss.enabledSnippets.has(
						fileNameWithoutExtension
					);
					return {
						name: fileName,
						lastModified: stat?.mtime || 0,
						enabled: isEnabled,
					};
				})
		);

		// cssFiles.sort((a, b) => b.lastModified - a.lastModified);
		setFiles(cssFiles);
	};

	const handleOpenFile = async (fileName: string) => {
		const filePath = `${snippetsFolder}/${fileName}`;
		await openExternalFile(filePath, true);
		onClose();
	};

	const handleToggleSnippet = async (fileName: string, checked: boolean) => {
		const fileNameWithoutExtension = fileName.endsWith(".css")
			? fileName.slice(0, -4)
			: fileName;
		app.customCss.setCssEnabledStatus(fileNameWithoutExtension, checked);

		requestLoadSnippets();
	};

	const requestLoadSnippets = async () => {
		await app.customCss.requestLoadSnippets();
		await loadSnippetsFiles();
	};

	const handleOpenSnippetsFolder = async () => {
		await app.openWithDefaultApp(snippetsFolder);
	};

	const handleDeleteFile = async (fileName: string) => {
		new ConfirmDialog(plugin, {
			title: LL.modal.snippetsFile.deleteFile(),
			message: LL.modal.snippetsFile.deleteFileMessage({ fileName }),
			onConfirm: async () => {
				const filePath = `${snippetsFolder}/${fileName}`;
				const adapter = app.vault.adapter;
				await adapter.remove(filePath);
				new Notice(LL.notice.file_deleted({ fileName }));
				await loadSnippetsFiles();
			},
		}).open();
	};

	const handleCreateFile = async () => {
		if (!newFileName.trim()) {
			new Notice(LL.notice.file_name_validate());
		}

		let fileName = newFileName;
		if (!fileName.endsWith(".css")) {
			fileName += ".css";
		}

		try {
			const filePath = `${snippetsFolder}/${fileName}`;
			const adapter = app.vault.adapter;
			const exists = await adapter.exists(filePath);

			if (exists) {
				new Notice(LL.notice.file_already_exists());
			}

			await adapter.write(filePath, "/* CSS Snippet */\n");
			new Notice(LL.notice.create_file_success({ path: fileName }));

			await loadSnippetsFiles();
			setIsCreatingNew(false);
			setNewFileName("");

			// 自动打开新创建的文件
			await openExternalFile(filePath, true);
			onClose();
		} catch (error) {
			throw new Error(error);
		}
	};

	const filteredFiles = files.filter((file) =>
		file.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="ace-snippets-file-modal">
			<div className="snippets-modal-header">
				<Code2 size={24} className="snippets-modal-header-icon" />
				<h2>{LL.modal.snippetsFile.header()}</h2>
			</div>
			<div className="snippets-modal-content">
				{isCreatingNew ? (
					<div className="snippets-new-file">
						<Input
							ref={newFileInputRef}
							value={newFileName}
							onChange={setNewFileName}
							placeholder={LL.modal.snippetsFile.new_snippet_name()}
						/>

						<div className="snippets-new-file-actions">
							<button
								onClick={() => {
									setIsCreatingNew(false);
									setNewFileName("");
								}}
							>
								{LL.common.cancel()}
							</button>

							<button
								className="mod-cta"
								onClick={handleCreateFile}
							>
								{LL.common.create()}
							</button>
						</div>
					</div>
				) : (
					<div className="snippets-actions">
						<div className="snippets-search">
							<Input
								value={searchQuery}
								onChange={setSearchQuery}
								placeholder={LL.modal.snippetsFile.search_snippets()}
								prefix={<Search size={16} />}
							/>
						</div>

						<div className="snippets-action-buttons">
							<button
								className="snippets-refresh"
								onClick={requestLoadSnippets}
								title={LL.modal.snippetsFile.refresh()}
							>
								<RefreshCcw size={18} />
							</button>

							<button
								className="snippets-new"
								onClick={() => setIsCreatingNew(true)}
								title={LL.modal.snippetsFile.new_snippet()}
							>
								<FilePlus2 size={18} />
							</button>

							<button
								className="snippets-open-folder"
								onClick={handleOpenSnippetsFolder}
								title={LL.modal.snippetsFile.open_snippets_folder()}
							>
								<FolderCode size={18} />
							</button>
						</div>
					</div>
				)}

				<div className="snippets-file-list">
					{filteredFiles.length > 0 ? (
						filteredFiles.map((file, index) => (
							<div key={index} className="snippets-file-item">
								<span className="snippets-file-name">
									{file.name}
									{file.lastModified && (
										<span className="snippets-file-badge">
											{new Date(
												file.lastModified
											).toLocaleDateString()}
										</span>
									)}
								</span>

								<div className="snippets-file-actions">
									<Toggle
										className="snippets-toggle"
										checked={!!file.enabled}
										onChange={(checked) =>
											handleToggleSnippet(
												file.name,
												checked
											)
										}
									/>

									<button
										className="snippets-edit-btn"
										onClick={(e) => {
											e.stopPropagation();
											handleOpenFile(file.name);
										}}
									>
										<SquarePen size={18} />
									</button>

									<button
										className="snippets-delete-btn"
										onClick={(e) => {
											e.stopPropagation();
											handleDeleteFile(file.name);
										}}
									>
										<Trash2 size={18} />
									</button>
								</div>
							</div>
						))
					) : (
						<div className="snippets-empty-state">
							<FileX size={32} className="snippets-empty-icon" />
							{searchQuery
								? LL.modal.snippetsFile.no_matching_snippets()
								: LL.modal.snippetsFile.no_snippets()}
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default SnippetsFileModal;
