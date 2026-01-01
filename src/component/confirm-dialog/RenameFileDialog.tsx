import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { Modal } from "obsidian";
import { StrictMode, useEffect, useRef, useState } from "react";
import { Root, createRoot } from "react-dom/client";

interface RenameFileDialogProps {
	title: string;
	message: string;
	oldName: string;
	onRename: (newName: string) => void;
	onClose?: () => void;
}

const RenameFileDialogView: React.FC<RenameFileDialogProps> = ({
	title,
	message,
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
			return;
		}
		const finalName = newName.trim() + ".css";
		if (finalName === oldName) {
			onClose?.();
			return;
		}
		onRename(finalName);
		onClose?.();
	};

	return (
		<div className="ace-confirm-dialog-overlay">
			<div className="ace-confirm-dialog">
				<div className="ace-confirm-dialog-header">
					<h3>{title}</h3>
				</div>
				<div className="ace-confirm-dialog-content">
					<input
						type="text"
						ref={inputRef}
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSubmit();
							if (e.key === "Escape") onClose?.();
						}}
					/>
					<p>{message}</p>
				</div>
				<div className="ace-confirm-dialog-actions">
					<button onClick={handleSubmit} className="mod-cta">
						{LL.common.confirm()}
					</button>
					<button onClick={onClose}>{LL.common.cancel()}</button>
				</div>
			</div>
		</div>
	);
};

export class RenameFileDialog extends Modal {
	private root: Root | null = null;
	private plugin: AceCodeEditorPlugin;
	private props: RenameFileDialogProps;

	constructor(plugin: AceCodeEditorPlugin, props: RenameFileDialogProps) {
		super(plugin.app);
		this.plugin = plugin;
		this.props = props;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();
		this.root = createRoot(contentEl);
		this.root.render(
			<StrictMode>
				<RenameFileDialogView
					title={this.props.title}
					message={this.props.message}
					oldName={this.props.oldName}
					onRename={this.props.onRename}
					onClose={() => this.close()}
				/>
			</StrictMode>
		);
	}

	onClose() {
		this.root?.unmount();
		this.root = null;
		this.contentEl.empty();
	}
}
