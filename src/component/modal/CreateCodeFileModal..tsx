import { Input } from "@src/component/input/Input";
import { Select } from "@src/component/select/Select";
import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { Notice, TFolder, normalizePath } from "obsidian";
import { useMemo, useState } from "react";
import { BaseModal } from "./BaseModal";

interface CreateCodeFileProps {
	folderPath?: string;
	openInCodeEditor: (path: string, newTab: boolean) => Promise<void>;
	allowFolderSelection?: boolean;
}

interface CreateCodeFileViewProps extends CreateCodeFileProps {
	plugin: AceCodeEditorPlugin;
	onClose: () => void;
}

const FILE_EXTENSIONS = [
	{ value: "custom", label: "Custom filename" },
	{ value: "js", label: "JavaScript (.js)" },
	{ value: "ts", label: "TypeScript (.ts)" },
	{ value: "jsx", label: "React JavaScript (.jsx)" },
	{ value: "tsx", label: "React TypeScript (.tsx)" },
	{ value: "py", label: "Python (.py)" },
	{ value: "java", label: "Java (.java)" },
	{ value: "cpp", label: "C++ (.cpp)" },
	{ value: "c", label: "C (.c)" },
	{ value: "h", label: "C Header (.h)" },
	{ value: "cs", label: "C# (.cs)" },
	{ value: "html", label: "HTML (.html)" },
	{ value: "css", label: "CSS (.css)" },
	{ value: "json", label: "JSON (.json)" },
];

const CreateCodeFileView: React.FC<CreateCodeFileViewProps> = ({
	plugin,
	folderPath = "",
	openInCodeEditor,
	allowFolderSelection = false,
	onClose,
}) => {
	const [fileName, setFileName] = useState("");
	const [currentFolderPath, setCurrentFolderPath] = useState(
		folderPath || "/"
	);
	const [fileExtension, setFileExtension] = useState("custom");
	const [openAfterCreate, setOpenAfterCreate] = useState(true);
	const [isCustomFilename, setIsCustomFilename] = useState(true);

	const folderSuggestions = useMemo(() => {
		if (!allowFolderSelection) return [];
		const folders = plugin.app.vault
			.getAllLoadedFiles()
			.filter((file): file is TFolder => file instanceof TFolder)
			.map((folder) => folder.path);
		return folders;
	}, [plugin.app.vault, allowFolderSelection]);

	const handleFileExtensionChange = (value: string) => {
		setFileExtension(value);
		setIsCustomFilename(value === "custom");
	};

	const getFullPath = () => {
		const name = isCustomFilename
			? fileName
			: `${fileName}.${fileExtension}`;
		return normalizePath(`${currentFolderPath}/${name}`);
	};

	const validateFileName = () => {
		if (!fileName.trim()) {
			new Notice(LL.notice.file_name_validate());
		}

		if (isCustomFilename && !fileName.includes(".")) {
			new Notice(LL.notice.file_name_with_extension_validate());
		}

		return true;
	};

	const handleCreate = async () => {
		if (!validateFileName()) {
			return;
		}

		const fullPath = getFullPath();

		try {
			const existingFile = plugin.app.vault.getFileByPath(fullPath);
			if (existingFile) {
				new Notice(LL.notice.file_already_exists());
			}

			await plugin.app.vault.create(fullPath, "");
			new Notice(LL.notice.create_file_success({ path: fullPath }));

			if (openAfterCreate) {
				await openInCodeEditor(fullPath, true);
			}

			onClose();
		} catch (error) {
			throw new Error(error);
		}
	};

	return (
		<div className="ace-create-code-file-modal">
			<div className="code-editor-modal-header">
				<h2>{LL.modal.createCodeFile.header()}</h2>
			</div>

			<div className="code-editor-modal-content">
				{allowFolderSelection && (
					<div className="code-editor-input-group">
						<label htmlFor="folderPath">
							{LL.modal.createCodeFile.folder_path()}
						</label>
						<Input
							value={currentFolderPath}
							onChange={(value) => setCurrentFolderPath(value)}
							suggestions={folderSuggestions}
						/>
					</div>
				)}

				<div className="code-editor-input-group">
					<label htmlFor="fileType">
						{LL.modal.createCodeFile.file_type()}
					</label>
					<Select
						value={fileExtension}
						options={FILE_EXTENSIONS}
						onChange={handleFileExtensionChange}
						placeholder={LL.modal.createCodeFile.file_type_placeholder()}
					/>
				</div>

				<div className="code-editor-input-group">
					<label htmlFor="fileName">
						{isCustomFilename
							? LL.modal.createCodeFile.file_name_with_extension()
							: LL.modal.createCodeFile.file_name()}
					</label>
					<Input
						value={fileName}
						onChange={(value) => setFileName(value)}
						title={
							isCustomFilename
								? LL.modal.createCodeFile.file_name_with_extension_placeholder()
								: LL.modal.createCodeFile.file_name_placeholder()
						}
					/>
				</div>

				<div className="code-editor-modal-preview">
					<span className="preview-label">
						{LL.modal.createCodeFile.preview()}
					</span>
					<span className="preview-value">{getFullPath()}</span>
				</div>

				<div className="code-editor-modal-option">
					<label className="checkbox-label">
						<input
							type="checkbox"
							checked={openAfterCreate}
							onChange={(e) =>
								setOpenAfterCreate(e.target.checked)
							}
						/>
						{LL.modal.createCodeFile.open_file_after_create()}
					</label>
				</div>
			</div>

			<div className="code-editor-modal-footer">
				<button className="mod-cta" onClick={handleCreate}>
					{LL.common.create()}
				</button>
				<button onClick={onClose}>{LL.common.cancel()}</button>
			</div>
		</div>
	);
};

export class CreateCodeFile extends BaseModal<CreateCodeFileViewProps> {
	constructor(plugin: AceCodeEditorPlugin, props: CreateCodeFileProps) {
		const viewProps = {
			...props,
			plugin,
		};

		super(plugin, CreateCodeFileView, viewProps, "");
	}
}
