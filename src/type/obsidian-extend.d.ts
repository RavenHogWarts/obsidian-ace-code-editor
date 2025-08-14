import { App, Component, Debouncer, Events, TFile } from "obsidian";

declare module "obsidian" {
	interface App {
		plugins: Plugins;
		openWithDefaultApp(path: string): void;
		embedRegistry: EmbedRegistry;
		customCss: CustomCSS;
		commands: Commands;
	}
	interface Plugins {
		disablePluginAndSave(id: string): Promise<void>;
		enablePluginAndSave(id: string): Promise<void>;
	}
}

interface Embed extends Component {
	loadFile(): Promise<void>;
}

type EmbedCreator = (ctx: EmbedContext, file: TFile, subpath: string) => Embed;

interface EmbedContext {
	app: App;
	linktext: string;
	sourcePath: string;
	containerEl: HTMLElement;
	depth: number;
	displayMode?: boolean;
	showInline?: boolean;
	state?: any;
}

interface EmbedRegistry extends Events {
	embedByExtension: Record<string, EmbedCreator>;

	registerExtension(extension: string, embedCreator: EmbedCreator): void;
	unregisterExtension(extension: string): void;
	registerExtensions(extensions: string[], embedCreator: EmbedCreator): void;
	unregisterExtensions(extensions: string[]): void;
	isExtensionRegistered(extension: string): boolean;
	getEmbedCreator(file: TFile): EmbedCreator | null;
}

interface CustomCSS extends Component {
	enabledSnippets: Set<string>;
	requestLoadSnippets: Debouncer<[], void>;
	setCssEnabledStatus(snippetName: string, enabled: boolean): void;
}

interface Commands {
	executeCommandById(commandId: string): boolean;
}
