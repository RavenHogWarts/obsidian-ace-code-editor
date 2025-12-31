import { SnippetUtils } from "@src/utils/SnippetUtils";
import { RefreshCw } from "lucide-react";
import { App } from "obsidian";
import { useCallback, useEffect, useState } from "react";

interface SnippetsNavigationProps {
	app: App;
	onFileSelect: (fileName: string) => void;
	selectedFile: string | null;
}

interface SnippetFile {
	name: string;
	nameWithoutExtension: string;
	lastModified?: number;
	enabled?: boolean;
}

export const SnippetsNavigation = ({
	app,
	onFileSelect,
	selectedFile,
}: SnippetsNavigationProps) => {
	const [files, setFiles] = useState<SnippetFile[]>([]);
	const [loading, setLoading] = useState(false);

	const loadFiles = useCallback(async () => {
		setLoading(true);
		try {
			const snippetFiles = await SnippetUtils.getSnippetsFiles(app);
			const fileNames = await Promise.all(
				snippetFiles.map(async (file) => {
					const fileName = file.split("/").pop() || file;
					const fileNameWithoutExtension = fileName.endsWith(".css")
						? fileName.slice(0, -4)
						: fileName;
					const stat = await app.vault.adapter.stat(file);
					const isEnabled = SnippetUtils.isSnippetEnabled(
						app,
						fileName
					);
					return {
						name: fileName,
						nameWithoutExtension: fileNameWithoutExtension,
						lastModified: stat?.mtime || 0,
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
	}, [app]);

	useEffect(() => {
		loadFiles();
	}, [loadFiles]);

	return (
		<div className="ace-snippets-navigation">
			<div className="nav-header">
				<div className="nav-buttons-container">
					<div className="clickable-icon nav-action-button">
						<RefreshCw
							size={14}
							className={loading ? "animate-spin" : ""}
							onClick={loadFiles}
						/>
					</div>
				</div>
			</div>

			<div className="nav-files-container">
				{files.map((file) => (
					<div
						key={file.name}
						className={`nav-file-title tappable is-clickable ${
							file.name === selectedFile ? "is-active" : ""
						}`}
						onClick={() => onFileSelect(file.name)}
					>
						<div className="nav-file-title-content">
							{file.nameWithoutExtension}
						</div>
					</div>
				))}
				{files.length === 0 && !loading && (
					<div className="nav-file-title tappable is-clickable">
						No snippets found
					</div>
				)}
			</div>
		</div>
	);
};
