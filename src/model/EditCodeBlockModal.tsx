import { ICodeEditorConfig } from "@/src/core/interfaces/types";
import { AceService } from "@/src/core/services/AceService";
import { t } from "@/src/i18n/i18n";
import { Ace } from "ace-builds";
import * as React from "react";
import { useModal } from "./BaseModal";

interface EditCodeBlockModalProps {
	onClose: () => void;
}

const EditCodeBlockModal: React.FC<EditCodeBlockModalProps> = ({ onClose }) => {
	const { additionalProps } = useModal();
	const editorRef = React.useRef<HTMLDivElement>(null);
	const aceEditorRef = React.useRef<Ace.Editor | null>(null);
	const aceServiceRef = React.useRef<AceService | null>(null);

	const codeBlock = additionalProps?.codeBlock as {
		language: string;
		code: string;
		range: { start: number; end: number };
	};
	const onSave = additionalProps?.onSave as (code: string) => Promise<void>;
	const config = additionalProps?.config as ICodeEditorConfig;

	React.useEffect(() => {
		if (editorRef.current && !aceEditorRef.current) {
			aceServiceRef.current = new AceService();
			aceEditorRef.current = aceServiceRef.current.createEditor(
				editorRef.current
			);
			aceServiceRef.current.configureEditor(config, codeBlock.language);
			aceServiceRef.current.setValue(codeBlock.code);
		}

		return () => {
			if (aceServiceRef.current) {
				aceServiceRef.current.destroy();
				aceServiceRef.current = null;
				aceEditorRef.current = null;
			}
		};
	}, []);

	const handleSave = async () => {
		if (!aceServiceRef.current) return;

		const newCode = aceServiceRef.current.getValue();
		await onSave(newCode);
		onClose();
	};

	return (
		<div className="ace-edit-code-block-modal">
			<div className="code-editor-modal-header">
				<h2>{t("modal.editCodeBlock.header")}</h2>
				<div className="language-indicator">
					{codeBlock.language || "plain text"}
				</div>
			</div>

			<div className="code-editor-modal-content">
				<div ref={editorRef} className="ace-editor-container" />
			</div>

			<div className="code-editor-modal-footer">
				<button onClick={onClose}>{t("common.cancel")}</button>
				<button onClick={handleSave}>{t("common.save")}</button>
			</div>
		</div>
	);
};

export default EditCodeBlockModal;
