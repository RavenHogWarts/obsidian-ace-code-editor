import { LL } from "@src/i18n/i18n";
import AceCodeEditorPlugin from "@src/main";
import { Notice } from "obsidian";
import { useEffect, useRef, useState } from "react";
import { BaseModal } from "../modal/BaseModal";
import { ConfirmDialogView } from "./ConfirmDialog";

interface CreateFileDialogProps {
	title: string;
	message: string;
	onCreate: (fileName: string) => void;
	onClose?: () => void;
}

interface CreateFileDialogViewProps extends CreateFileDialogProps {
	onClose: () => void;
}

const CreateFileDialogView: React.FC<CreateFileDialogViewProps> = ({
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
		onClose();
	};

	return (
		<ConfirmDialogView
			title={title}
			message={message}
			onConfirm={handleSubmit}
			onClose={onClose}
		>
			<input
				type="text"
				ref={inputRef}
				value={fileName}
				onChange={(e) => setFileName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault(); // Prevent bubbling to parent overlay if possible, or just handle here.
						handleSubmit();
					}
					if (e.key === "Escape") {
						e.preventDefault();
						onClose();
					}
				}}
			/>
		</ConfirmDialogView>
	);
};

export class CreateFileDialog extends BaseModal<CreateFileDialogViewProps> {
	constructor(plugin: AceCodeEditorPlugin, props: CreateFileDialogProps) {
		const viewProps = {
			...props,
			onClose: () => {
				if (props.onClose) props.onClose();
			},
		};
		super(plugin, CreateFileDialogView, viewProps, "");
	}
}
