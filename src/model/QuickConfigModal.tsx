import { t } from "@/src/i18n/i18n";
import {
	AceDarkThemesList,
	AceKeyboardList,
	AceLightThemesList,
} from "@/src/service/AceThemes";
import { ICodeEditorConfig } from "@/src/type/types";
import { App } from "obsidian";
import {
	ConfigOption,
	ConfigSuggestModal,
	ConfigValue,
	ConfigValueSuggestModal,
} from "./ConfigSuggestsModal";

export class QuickConfigModal {
	constructor(
		private app: App,
		private settings: ICodeEditorConfig,
		private updateSettings: (
			newSettings: Partial<ICodeEditorConfig>
		) => Promise<void>
	) {}

	public open(): void {
		const configOptions: ConfigOption[] = [
			{
				key: "lightTheme",
				displayName: t("setting.lightTheme.name"),
				description: t("setting.lightTheme.desc"),
				currentValue: this.settings.lightTheme,
				options: AceLightThemesList,
			},
			{
				key: "darkTheme",
				displayName: t("setting.darkTheme.name"),
				description: t("setting.darkTheme.desc"),
				currentValue: this.settings.darkTheme,
				options: AceDarkThemesList,
			},
			{
				key: "keyboard",
				displayName: t("setting.keyboard.name"),
				description: t("setting.keyboard.desc"),
				currentValue: this.settings.keyboard,
				options: AceKeyboardList,
			},
		];

		const modal = new ConfigSuggestModal(
			this.app,
			configOptions,
			(option) => {
				this.openValueSelector(option);
			}
		);

		modal.modalEl.addClass("ace-quick-config-modal");
		modal.open();
	}

	private openValueSelector(option: ConfigOption): void {
		const configValues: ConfigValue[] = option.options.map((value) => ({
			value,
			displayName: this.getDisplayName(option.key, String(value)),
			isCurrentValue: value === option.currentValue,
		}));

		const modal = new ConfigValueSuggestModal(
			this.app,
			configValues,
			async (selectedValue) => {
				await this.updateSettings({
					[option.key]: selectedValue.value,
				});
			}
		);

		modal.modalEl.addClass("ace-quick-config-modal");
		modal.open();
	}

	private getDisplayName(configKey: string, value: string): string {
		switch (configKey) {
			case "lightTheme":
			case "darkTheme":
				return this.formatThemeName(value);
			case "keyboard":
				return this.formatKeyboardName(value);
			default:
				return value;
		}
	}

	private formatThemeName(theme: string): string {
		// 将主题名转换为更友好的显示名称
		return theme
			.replace(/_/g, " ")
			.replace(/\b\w/g, (l) => l.toUpperCase());
	}

	private formatKeyboardName(keyboard: string): string {
		// 将键盘模式名转换为更友好的显示名称
		switch (keyboard) {
			case "default":
				return "Default";
			case "vscode":
				return "VS Code";
			case "sublime":
				return "Sublime Text";
			case "emacs":
				return "Emacs";
			case "vim":
				return "Vim";
			default:
				return keyboard.charAt(0).toUpperCase() + keyboard.slice(1);
		}
	}
}
