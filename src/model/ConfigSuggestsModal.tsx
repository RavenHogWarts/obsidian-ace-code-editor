import { App, FuzzyMatch, FuzzySuggestModal, setIcon } from "obsidian";

export interface ConfigOption<T = string | number | boolean> {
	key: string;
	displayName: string;
	description?: string;
	currentValue: T;
	options: T[];
}

export interface ConfigValue<T = string | number | boolean> {
	value: T;
	displayName: string;
	isCurrentValue: boolean;
}

export class ConfigSuggestModal<
	T = string | number | boolean
> extends FuzzySuggestModal<ConfigOption<T>> {
	constructor(
		app: App,
		private configOptions: ConfigOption<T>[],
		private callback: (option: ConfigOption<T>) => void
	) {
		super(app);
		this.configOptions = configOptions;
		this.callback = callback;

		this.setInstructions([
			{ command: "↑↓", purpose: "Navigate" },
			{ command: "↵", purpose: "Select" },
			{ command: "esc", purpose: "Dismiss" },
		]);
	}

	getItems(): ConfigOption<T>[] {
		return this.configOptions;
	}

	getItemText(item: ConfigOption<T>): string {
		return item.displayName;
	}

	onChooseItem(item: ConfigOption<T>, evt: MouseEvent | KeyboardEvent): void {
		this.callback(item);
	}

	renderSuggestion(item: FuzzyMatch<ConfigOption<T>>, el: HTMLElement): void {
		// super.renderSuggestion(item, el);

		el.addClass("suggestion-content");

		el.createDiv({ cls: "suggestion-title", text: item.item.displayName });

		el.createDiv({
			cls: "suggestion-description",
			text: item.item.description,
		});
	}
}

export class ConfigValueSuggestModal<
	T = string | number | boolean
> extends FuzzySuggestModal<ConfigValue<T>> {
	constructor(
		app: App,
		private configValues: ConfigValue<T>[],
		private callback: (value: ConfigValue<T>) => void
	) {
		super(app);
		this.configValues = configValues;
		this.callback = callback;

		this.setInstructions([
			{ command: "↑↓", purpose: "Navigate" },
			{ command: "↵", purpose: "Select" },
			{ command: "esc", purpose: "Dismiss" },
		]);
	}

	getItems(): ConfigValue<T>[] {
		return this.configValues;
	}

	getItemText(item: ConfigValue<T>): string {
		return `${item.displayName}`;
	}

	onChooseItem(item: ConfigValue<T>, evt: MouseEvent | KeyboardEvent): void {
		this.callback(item);
	}

	renderSuggestion(item: FuzzyMatch<ConfigValue<T>>, el: HTMLElement) {
		if (item.item.isCurrentValue) {
			setIcon(el, "dot");
			el.addClass("suggestion-current-indicator");
		}

		super.renderSuggestion(item, el);
	}
}
