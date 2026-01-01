import AceCodeEditorPlugin from "@src/main";
import { useEffect, useRef, useState } from "react";
import { BaseModal } from "../modal/BaseModal";
import { ConfirmDialogView } from "./ConfirmDialog";

interface RenameFileDialogProps {
	title: string;
	message: string;
	oldName: string;
	onRename: (newName: string) => void;
	onClose?: () => void;
}

interface RenameFileDialogViewProps extends RenameFileDialogProps {
	onClose: () => void;
}

const RenameFileDialogView: React.FC<RenameFileDialogViewProps> = ({
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
			onClose();
			return;
		}
		onRename(finalName);
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
				value={newName}
				onChange={(e) => setNewName(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						e.preventDefault();
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

export class RenameFileDialog extends BaseModal<RenameFileDialogViewProps> {
	constructor(plugin: AceCodeEditorPlugin, props: RenameFileDialogProps) {
		const viewProps = {
			...props,
			onClose: () => {
				if (props.onClose) props.onClose();
			},
		};
		super(plugin, RenameFileDialogView, viewProps, "");
	}
}
