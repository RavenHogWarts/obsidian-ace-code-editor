import { App } from "obsidian";

export class SnippetUtils {
	constructor() {}

	static getSnippetsFolder(app: App): string {
		return `${app.vault.configDir}/snippets`;
	}

	static requestLoadSnippets(app: App) {
		app.customCss.requestLoadSnippets();
	}

	static openSnippetFolder(app: App) {
		app.openWithDefaultApp(SnippetUtils.getSnippetsFolder(app));
	}

	static toggleSnippetState(app: App, file: string, checked: boolean) {
		const snippetId = file.endsWith(".css") ? file.slice(0, -4) : file;
		app.customCss.setCssEnabledStatus(snippetId, checked);
		SnippetUtils.requestLoadSnippets(app);
	}

	static isSnippetEnabled(app: App, file: string): boolean {
		const snippetId = file.endsWith(".css") ? file.slice(0, -4) : file;
		return app.customCss.enabledSnippets.has(snippetId);
	}

	static async getSnippetsFiles(app: App): Promise<string[]> {
		const snippetsFolder = SnippetUtils.getSnippetsFolder(app);
		const adapter = app.vault.adapter;
		const exists = await adapter.exists(snippetsFolder);

		if (!exists) {
			await adapter.mkdir(snippetsFolder);
		}

		const snippetFiles = (await adapter.list(snippetsFolder)).files.filter(
			(file) => file.endsWith(".css")
		);

		return snippetFiles;
	}
}
