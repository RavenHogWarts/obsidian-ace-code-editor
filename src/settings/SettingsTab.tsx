import { SettingsStoreContext } from "@src/context/SettingsStoreContext";
import AceCodeEditorPlugin from "@src/main";
import { App, PluginSettingTab } from "obsidian";
import { StrictMode } from "react";
import { createRoot, Root } from "react-dom/client";
import { AceSettings } from "./AceSettings";

export default class AceCodeEditorSettingTab extends PluginSettingTab {
	plugin: AceCodeEditorPlugin;
	root: Root | null = null;
	icon: string = "square-dashed-bottom-code";

	constructor(app: App, plugin: AceCodeEditorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display() {
		const { containerEl } = this;
		containerEl.empty();

		if (!this.root) {
			this.root = createRoot(containerEl);
		}

		this.renderContent();
	}

	hide() {
		if (this.root) {
			this.root.unmount();
			this.root = null;
		}
		this.containerEl.empty();
	}

	private renderContent() {
		this.root?.render(
			<StrictMode>
				<SettingsStoreContext.Provider
					value={this.plugin.settingsStore}
				>
					<AceSettings />
				</SettingsStoreContext.Provider>
			</StrictMode>
		);
	}
}
