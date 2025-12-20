import { t } from "@src/i18n/i18n";
import { AceService } from "@src/service/AceService";
import { ICodeBlock, ICodeEditorConfig } from "@src/type/types";
import { Ace } from "ace-builds";
import { useEffect, useRef } from "react";

interface EditCodeBlockModalProps {
	onClose: () => void;
	codeBlock: ICodeBlock;
	onSave: (code: string) => Promise<void>;
	config: ICodeEditorConfig;
}

const EditCodeBlockModal: React.FC<EditCodeBlockModalProps> = ({
	onClose,
	codeBlock,
	onSave,
	config,
}) => {
	const editorRef = useRef<HTMLDivElement>(null);
	const aceEditorRef = useRef<Ace.Editor | null>(null);
	const aceServiceRef = useRef<AceService | null>(null);

	useEffect(() => {
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
