import AceCodeEditorPlugin from "@src/main";
import { AceSettings } from "@src/settings/AceSettings";
import { SETTINGS_VIEW_TYPE } from "@src/type/types";
import { IconName, ItemView, WorkspaceLeaf } from "obsidian";
import { StrictMode } from "react";

import { createRoot, Root } from "react-dom/client";

export class SettingsView extends ItemView {
	plugin: AceCodeEditorPlugin;
	root: Root | null = null;

	constructor(leaf: WorkspaceLeaf, plugin: AceCodeEditorPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	getViewType(): string {
		return SETTINGS_VIEW_TYPE;
	}

	getIcon(): IconName {
		return "bolt";
	}

	getDisplayText(): string {
		return "ACE SettingTab";
	}

	async onOpen() {
		await super.onOpen();

		const { containerEl } = this;
		containerEl.empty();
		containerEl.addClass("ace-settings-view");

		if (!this.root) {
			this.root = createRoot(containerEl);
		}

		this.root.render(
			<StrictMode>
				<AceSettings />
			</StrictMode>
		);
	}

	async onClose() {
		await super.onClose();
	}
}
