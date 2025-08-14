import { App, Notice } from "obsidian";

export class ObsidianUtils {
	constructor() {}

	static async reloadPlugin(app: App) {
		try {
			await app.plugins.disablePluginAndSave("ace-code-editor");
			await app.plugins.enablePluginAndSave("ace-code-editor");
			new Notice("[ace-code-editor] 插件已重载");
		} catch (error) {
			throw new Error("[ace-code-editor] 插件重载失败" + error);
		}
	}

	static async runCommandById(app: App, commandId: string) {
		app.commands.executeCommandById(commandId);
	}
}
