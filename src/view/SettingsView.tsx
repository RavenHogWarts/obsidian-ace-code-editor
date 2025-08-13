import AceCodeEditorPlugin from "@/src/main";
import { AceSettings } from "@/src/settings/AceSettings";
import { IconName, ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";

export const SETTINGS_VIEW_TYPE = "ace-code-editor-settings";

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
			<React.StrictMode>
				<AceSettings plugin={this.plugin} />
			</React.StrictMode>
		);
	}

	async onClose() {
		await super.onClose();
	}
}
