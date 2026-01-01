import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { Modal } from "obsidian";
import { StrictMode, useEffect, useRef } from "react";
import { Root, createRoot } from "react-dom/client";
import "./ConfirmDialog.css";

interface ConfirmDialogViewProps {
	title: string;
	message: string;
	onConfirm: () => void;
	onClose?: () => void;
}

const ConfirmDialogView: React.FC<ConfirmDialogViewProps> = ({
	title,
	message,
	onConfirm,
	onClose,
}) => {
	const confirmBtnRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		confirmBtnRef.current?.focus();
	}, []);

	const handleSubmit = () => {
		onConfirm();
		onClose?.();
	};

	return (
		<div
			className="ace-confirm-dialog-overlay"
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					e.preventDefault();
					handleSubmit();
				}
				if (e.key === "Escape") onClose?.();
			}}
		>
			<div className="ace-confirm-dialog">
				<div className="ace-confirm-dialog-header">
					<h3>{title}</h3>
				</div>
				<div className="ace-confirm-dialog-content">
					<p>{message}</p>
				</div>
				<div className="ace-confirm-dialog-actions">
					<button
						ref={confirmBtnRef}
						onClick={handleSubmit}
						className="mod-cta"
					>
						{LL.common.confirm()}
					</button>
					<button onClick={onClose}>{LL.common.cancel()}</button>
				</div>
			</div>
		</div>
	);
};

export class ConfirmDialog extends Modal {
	private root: Root | null = null;
	private plugin: AceCodeEditorPlugin;
	private props: ConfirmDialogViewProps;

	constructor(plugin: AceCodeEditorPlugin, props: ConfirmDialogViewProps) {
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
				<ConfirmDialogView
					title={this.props.title}
					message={this.props.message}
					onConfirm={this.props.onConfirm}
					onClose={() => this.close()}
				/>
			</StrictMode>
		);
	}

	onClose() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
