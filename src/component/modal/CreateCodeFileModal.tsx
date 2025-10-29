import { Input } from "@src/component/input/Input";
import { Select } from "@src/component/select/Select";
import { useModal } from "@src/hooks/useModal";
import { t } from "@src/i18n/i18n";
import { normalizePath, Notice } from "obsidian";
import * as React from "react";

interface CreateCodeFileModalProps {
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

const CreateCodeFileModal: React.FC<CreateCodeFileModalProps> = ({
	onClose,
}) => {
	const { app, additionalProps } = useModal();
	const [fileName, setFileName] = React.useState("");
	const [fileExtension, setFileExtension] = React.useState("custom");
	const [openAfterCreate, setOpenAfterCreate] = React.useState(true);
	const [isCustomFilename, setIsCustomFilename] = React.useState(true);

	const folderPath = additionalProps?.folderPath as string;
	const openInCodeEditor = additionalProps?.openInCodeEditor as (
		path: string,
		newTab: boolean
	) => Promise<void>;

	const handleFileExtensionChange = (value: string) => {
		setFileExtension(value);
		setIsCustomFilename(value === "custom");
	};

	const getFullPath = () => {
		const normalizedFolderPath = normalizePath(folderPath);

		if (isCustomFilename) {
			return `${normalizedFolderPath}/${fileName}`;
		}
		return `${normalizedFolderPath}/${fileName}.${fileExtension}`;
	};

	const validateFileName = () => {
		if (!fileName.trim()) {
			throw new Error(t("notice.file_name_validate"));
		}

		if (isCustomFilename && !fileName.includes(".")) {
			throw new Error(t("notice.file_name_with_extension_validate"));
		}

		return true;
	};

	const handleCreate = async () => {
		if (!validateFileName()) {
			return;
		}

		const fullPath = getFullPath();

		try {
			const existingFile = app.vault.getFileByPath(fullPath);
			if (existingFile) {
				throw new Error(t("notice.file_already_exists"));
			}

			await app.vault.create(fullPath, "");
			new Notice(t("notice.create_file_success", { path: fullPath }));

			if (openAfterCreate) {
				await openInCodeEditor(fullPath, true);
			}

			onClose();
		} catch (error) {
			throw new Error(t("notice.create_file_failed", { error }));
		}
	};

	return (
		<div className="ace-create-code-file-modal">
			<div className="code-editor-modal-header">
				<h2>{t("modal.createCodeFile.header")}</h2>
			</div>

			<div className="code-editor-modal-content">
				<div className="code-editor-input-group">
					<label htmlFor="fileType">
						{t("modal.createCodeFile.file_type")}
					</label>
					<Select
						value={fileExtension}
						options={FILE_EXTENSIONS}
						onChange={handleFileExtensionChange}
						placeholder={t(
							"modal.createCodeFile.file_type_placeholder"
						)}
					/>
				</div>

				<div className="code-editor-input-group">
					<label htmlFor="fileName">
						{isCustomFilename
							? t("modal.createCodeFile.file_name_with_extension")
							: t("modal.createCodeFile.file_name")}
					</label>
					<Input
						value={fileName}
						onChange={(value) => setFileName(value)}
						title={
							isCustomFilename
								? t(
										"modal.createCodeFile.file_name_with_extension_placeholder"
								  )
								: t(
										"modal.createCodeFile.file_name_placeholder"
								  )
						}
					/>
				</div>

				<div className="code-editor-modal-preview">
					<span className="preview-label">
						{t("modal.createCodeFile.preview")}
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
						{t("modal.createCodeFile.open_file_after_create")}
					</label>
				</div>
			</div>

			<div className="code-editor-modal-footer">
				<button onClick={onClose}>{t("common.cancel")}</button>
				<button className="mod-cta" onClick={handleCreate}>
					{t("common.create")}
				</button>
			</div>
		</div>
	);
};

export default CreateCodeFileModal;
