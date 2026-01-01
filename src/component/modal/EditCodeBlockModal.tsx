import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { AceService } from "@src/service/AceService";
import { ICodeBlock, ICodeEditorConfig } from "@src/type/types";
import { Ace } from "ace-builds";
import { useEffect, useRef } from "react";
import { BaseModal } from "./BaseModal";

interface EditCodeBlockProps {
	codeBlock: ICodeBlock;
	onSave: (code: string) => Promise<void>;
}

interface EditCodeBlockViewProps extends EditCodeBlockProps {
	config: ICodeEditorConfig;
	onClose: () => void;
}

const EditCodeBlockView: React.FC<EditCodeBlockViewProps> = ({
	codeBlock,
	onSave,
	config,
	onClose,
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
				<h2>{LL.modal.editCodeBlock.header()}</h2>
				<div className="language-indicator">
					{codeBlock.language || "plain text"}
				</div>
			</div>

			<div className="code-editor-modal-content">
				<div ref={editorRef} className="ace-editor-container" />
			</div>

			<div className="code-editor-modal-footer">
				<button onClick={onClose}>{LL.common.cancel()}</button>
				<button onClick={handleSave}>{LL.common.save()}</button>
			</div>
		</div>
	);
};

export class EditCodeBlock extends BaseModal<EditCodeBlockViewProps> {
	constructor(plugin: AceCodeEditorPlugin, props: EditCodeBlockProps) {
		const viewProps = {
			...props,
			config: plugin.settings,
		};
		super(plugin, EditCodeBlockView, viewProps, "modal-size-large");
	}
}
