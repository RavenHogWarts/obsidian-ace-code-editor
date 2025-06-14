import { App, Notice, PluginSettingTab } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import AceCodeEditorPlugin from "@/src/main";
import { AceSettings } from "./AceSettings";

export default class AceCodeEditorSettingTab extends PluginSettingTab {
	plugin: AceCodeEditorPlugin;
	root: Root | null = null;

	constructor(app: App, plugin: AceCodeEditorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.reloadPlugin = this.reloadPlugin.bind(this);
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
			<React.StrictMode>
				<div className="ace-settings-container">
					<div className="ace-settings-header"></div>
					<div className="ace-settings-content">
						<AceSettings plugin={this.plugin} />
					</div>
				</div>
			</React.StrictMode>
		);
	}

	private async reloadPlugin() {
		try {
			await this.app.plugins.disablePluginAndSave("ace-code-editor");
			await this.app.plugins.enablePluginAndSave("ace-code-editor");
			new Notice("[ace-code-editor] 插件已重载");
		} catch (error) {
			throw new Error("[ace-code-editor] 插件重载失败" + error);
		}
	}
}
