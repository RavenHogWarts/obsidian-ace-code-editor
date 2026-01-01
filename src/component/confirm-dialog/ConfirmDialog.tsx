import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { useEffect, useRef } from "react";
import { BaseModal } from "../modal/BaseModal";
import "./ConfirmDialog.css";

interface ConfirmDialogProps {
	title: string;
	message: string;
	onConfirm: () => void;
}

interface ConfirmDialogViewProps extends ConfirmDialogProps {
	children?: React.ReactNode;
	onClose: () => void;
}

export const ConfirmDialogView: React.FC<ConfirmDialogViewProps> = ({
	title,
	message,
	onConfirm,
	children,
	onClose,
}) => {
	const confirmBtnRef = useRef<HTMLButtonElement>(null);

	// Ensure focus on mount for simple dialogs without inputs
	useEffect(() => {
		if (!children) {
			confirmBtnRef.current?.focus();
		}
	}, [children]);

	const handleSubmit = () => {
		onConfirm();
	};

	return (
		<div
			className="ace-confirm-dialog-overlay"
			onKeyDown={(e) => {
				if (e.key === "Enter") {
					// Check if default prevented (e.g. by an input element handling enter itself)
					// to avoid double submission if necessary, though simpler is to just let inputs handle their own enter
					// or rely on bubbling.
					// However, if we have an input, pressing enter there bubbles up.
					// We want to prevent default browser behavior but ensure trigger.

					// Ideally, we only trigger if it's not handled by a child.
					// But for now, let's keep it simple.
					if (!e.defaultPrevented) {
						e.preventDefault();
						handleSubmit();
					}
				}
				if (e.key === "Escape") {
					e.preventDefault();
					onClose();
				}
			}}
		>
			<div className="ace-confirm-dialog">
				<div className="ace-confirm-dialog-header">
					<h3>{title}</h3>
				</div>
				<div className="ace-confirm-dialog-content">
					{children}
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

export class ConfirmDialog extends BaseModal<ConfirmDialogViewProps> {
	constructor(plugin: AceCodeEditorPlugin, props: ConfirmDialogProps) {
		const viewProps = {
			...props,
			onConfirm: () => {
				props.onConfirm();
				this.close();
			},
		};
		super(plugin, ConfirmDialogView, viewProps, "");
	}
}
