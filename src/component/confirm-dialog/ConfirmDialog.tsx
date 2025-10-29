import { t } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { Modal } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
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
	const handleConfirm = () => {
		onConfirm();
		onClose?.();
	};

	return (
		<div className="ace-confirm-dialog-overlay">
			<div className="ace-confirm-dialog">
				<div className="ace-confirm-dialog-header">
					<h3>{title}</h3>
				</div>
				<div className="ace-confirm-dialog-content">
					<p>{message}</p>
				</div>
				<div className="ace-confirm-dialog-actions">
					<button onClick={onClose}>{t("common.cancel")}</button>
					<button onClick={handleConfirm} className="mod-cta">
						{t("common.confirm")}
					</button>
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
			<React.StrictMode>
				<ConfirmDialogView
					title={this.props.title}
					message={this.props.message}
					onConfirm={this.props.onConfirm}
					onClose={() => this.close()}
				/>
			</React.StrictMode>
		);
	}

	onClose() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
	}
}
