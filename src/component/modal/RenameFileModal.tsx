import { LL } from "@src/i18n/i18n";
import { App, Modal, Notice } from "obsidian";
import { StrictMode, useEffect, useRef, useState } from "react";
import { Root, createRoot } from "react-dom/client";
import "../confirm-dialog/ConfirmDialog.css"; // Reuse confirm dialog styles

interface RenameFileModalViewProps {
	oldName: string;
	onRename: (newName: string) => void;
	onClose: () => void;
}

const RenameFileModalView: React.FC<RenameFileModalViewProps> = ({
	oldName,
	onRename,
	onClose,
}) => {
	const [newName, setNewName] = useState(oldName.replace(/\.css$/, ""));
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
		inputRef.current?.select();
	}, []);

	const handleSubmit = () => {
		if (!newName.trim()) {
			new Notice("文件名不能为空");
			return;
		}
		const finalName = newName.trim() + ".css";
		if (finalName === oldName) {
			onClose();
			return;
		}
		onRename(finalName);
		onClose();
	};

	return (
		<div className="ace-confirm-dialog-overlay">
			<div className="ace-confirm-dialog">
				<div className="ace-confirm-dialog-header">
					<h3>重命名片段</h3>
				</div>
				<div className="ace-confirm-dialog-content">
					<input
						type="text"
						ref={inputRef}
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSubmit();
							if (e.key === "Escape") onClose();
						}}
						style={{ width: "100%" }}
					/>
					<p
						style={{
							marginTop: "8px",
							fontSize: "0.8em",
							color: "var(--text-muted)",
						}}
					>
						无需输入后缀 .css
					</p>
				</div>
				<div className="ace-confirm-dialog-actions">
					<button onClick={onClose}>{LL.common.cancel()}</button>
					<button onClick={handleSubmit} className="mod-cta">
						{LL.common.confirm()}
					</button>
				</div>
			</div>
		</div>
	);
};

export class RenameFileModal extends Modal {
	private root: Root | null = null;
	private props: RenameFileModalViewProps;

	constructor(
		app: App,
		oldName: string,
		onRename: (newName: string) => void
	) {
		super(app);
		this.props = { oldName, onRename, onClose: () => this.close() };
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		this.root = createRoot(contentEl);
		this.root.render(
			<StrictMode>
				<RenameFileModalView {...this.props} />
			</StrictMode>
		);
	}

	onClose() {
		this.root?.unmount();
		this.root = null;
		this.contentEl.empty();
	}
}
