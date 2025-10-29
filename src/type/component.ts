import AceCodeEditorPlugin from "@src/main";
import { Component } from "obsidian";

export class AcePluginComponent extends Component {
	constructor(public plugin: AceCodeEditorPlugin) {
		super();
	}

	get app() {
		return this.plugin.app;
	}

	get settings() {
		return this.plugin.settings;
	}
}
