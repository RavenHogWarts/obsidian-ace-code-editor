import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { Modal, Notice } from "obsidian";
import { StrictMode, useEffect, useRef, useState } from "react";
import { Root, createRoot } from "react-dom/client";

interface CreateFileDialogProps {
	title: string;
	message: string;
	onCreate: (fileName: string) => void;
	onClose?: () => void;
}

const CreateFileDialogView: React.FC<CreateFileDialogProps> = ({
	title,
	message,
	onCreate,
	onClose,
}) => {
	const [fileName, setFileName] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const handleSubmit = () => {
		if (!fileName.trim()) {
			new Notice(LL.notice.file_name_validate());
			return;
		}
		const finalName = fileName.trim() + ".css";
		onCreate(finalName);
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
						value={fileName}
						onChange={(e) => setFileName(e.target.value)}
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

export class CreateFileDialog extends Modal {
	private root: Root | null = null;
	private plugin: AceCodeEditorPlugin;
	private props: CreateFileDialogProps;

	constructor(plugin: AceCodeEditorPlugin, props: CreateFileDialogProps) {
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
				<CreateFileDialogView
					title={this.props.title}
					message={this.props.message}
					onCreate={this.props.onCreate}
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
