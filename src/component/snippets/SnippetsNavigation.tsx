import { SnippetUtils } from "@src/utils/SnippetUtils";
import { FileCode2, RefreshCw } from "lucide-react";
import { App } from "obsidian";
import { useCallback, useEffect, useState } from "react";

interface SnippetsNavigationProps {
	app: App;
	onFileSelect: (fileName: string) => void;
	selectedFile: string | null;
}

export const SnippetsNavigation = ({
	app,
	onFileSelect,
	selectedFile,
}: SnippetsNavigationProps) => {
	const [files, setFiles] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const loadFiles = useCallback(async () => {
		setLoading(true);
		try {
			const paths = await SnippetUtils.getSnippetsFiles(app);
			// paths are relative to vault root, e.g., ".obsidian/snippets/my-snippet.css"
			// We want to display just the filename.
			const fileNames = paths
				.map((path) => path.split("/").pop() || "")
				.filter((name) => name.length > 0)
				.sort((a, b) => a.localeCompare(b));

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
		<div className="nav-folder ace-snippets-navigation">
			<div
				className="nav-header"
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "10px 10px 5px 10px",
				}}
			>
				<div
					className="nav-folder-title-content"
					style={{ fontWeight: "bold" }}
				>
					Snippets
				</div>
				<div
					className="clickable-icon"
					onClick={loadFiles}
					title="Refresh Snippets"
					style={{ display: "flex", alignItems: "center" }}
				>
					<RefreshCw
						size={14}
						className={loading ? "animate-spin" : ""}
					/>
				</div>
			</div>

			<div className="nav-files-container" style={{ padding: "0 5px" }}>
				{files.map((file) => (
					<div
						key={file}
						className={`nav-file-title ${
							file === selectedFile ? "is-active" : ""
						}`}
						onClick={() => onFileSelect(file)}
						style={{
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							gap: "8px",
							padding: "4px 8px",
							borderRadius: "4px",
						}}
					>
						<FileCode2
							size={14}
							className="nav-file-icon"
							style={{ opacity: 0.7 }}
						/>
						<div className="nav-file-title-content">{file}</div>
					</div>
				))}
				{files.length === 0 && !loading && (
					<div
						className="nav-file-title"
						style={{
							padding: "4px 8px",
							color: "var(--text-muted)",
						}}
					>
						No snippets found
					</div>
				)}
			</div>
			<style>{`
				.animate-spin {
					animation: spin 1s linear infinite;
				}
				@keyframes spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
			`}</style>
		</div>
	);
};
