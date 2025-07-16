import { ObsidianUtils } from "@/src/core/utils/ObsidianUtils";
import { t } from "@/src/i18n/i18n";
import AceCodeEditorPlugin from "@/src/main";
import parse from "html-react-parser";
import { App, PluginSettingTab } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { AceSettings } from "./AceSettings";

export default class AceCodeEditorSettingTab extends PluginSettingTab {
	plugin: AceCodeEditorPlugin;
	root: Root | null = null;

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
			<React.StrictMode>
				<div className="ace-settings-container">
					<div className="ace-settings-header">
						<div className="ace-settings-header-left">
							<span>{parse(t("setting.desc"))}</span>
						</div>
						<div className="ace-settings-header-right">
							<button
								className="mod-cta"
								onClick={() =>
									ObsidianUtils.reloadPlugin(this.app)
								}
							>
								{t("command.reload")}
							</button>
						</div>
					</div>
					<div className="ace-settings-content">
						<AceSettings plugin={this.plugin} />
					</div>
				</div>
			</React.StrictMode>
		);
	}
}
