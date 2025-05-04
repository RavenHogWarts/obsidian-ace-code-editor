import * as React from "react";
import AceCodeEditorPlugin from "@/src/main";
import { useSettings } from "@/src/core/hook/useSettings";
import { ICodeEditorConfig } from "@/src/core/interfaces/types";
import { SettingsItem } from "./SettingItem";
import { t } from "@/src/i18n/i18n";
import {
	AceDarkThemesList,
	AceKeyboardList,
} from "@/src/core/services/AceThemes";
import { AceLightThemesList } from "@/src/core/services/AceThemes";
import { TagInput } from "../Base/TagInput";
import { languageModeMap } from "@/src/core/services/AceLanguages";
import { Select } from "../Base/Select";
import { IconPicker } from "../Base/IconPicker";
import { Input } from "../Base/Input";
import { Toggle } from "../Base/Toggle";

interface AceSettingsProps {
	plugin: AceCodeEditorPlugin;
}

export const AceSettings: React.FC<AceSettingsProps> = ({ plugin }) => {
	const { settings, updateSettings } = useSettings(plugin);

	const handleUpdateConfig = async (
		newSettings: Partial<ICodeEditorConfig>
	) => {
		await updateSettings(newSettings);
	};

	const lightThemeOptions = AceLightThemesList.map((theme) => ({
		value: theme,
		label: theme,
	}));

	const darkThemeOptions = AceDarkThemesList.map((theme) => ({
		value: theme,
		label: theme,
	}));

	const keyboardOptions = AceKeyboardList.map((keyboard) => ({
		value: keyboard,
		label: keyboard,
	}));

	const snippetsManagerOptions = [
		{
			value: "Null",
			label: t("setting.snippetsManager.location.Null"),
		},
		{
			value: "Ribbon",
			label: t("setting.snippetsManager.location.Ribbon"),
		},
		{
			value: "StatusBar",
			label: t("setting.snippetsManager.location.StatusBar"),
		},
	];

	return (
		<>
			<SettingsItem
				name={t("setting.supportExtensions.name")}
				desc={t("setting.supportExtensions.desc")}
				collapsible={true}
				defaultCollapsed={false}
			>
				<TagInput
					values={settings.supportExtensions}
					onChange={(value) =>
						handleUpdateConfig({ supportExtensions: value })
					}
					suggestions={Object.values(languageModeMap).flat()}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.snippetsManager.name")}
				desc={t("setting.snippetsManager.desc")}
			>
				<Select
					options={snippetsManagerOptions}
					value={settings.snippetsManager.location}
					onChange={(value) =>
						handleUpdateConfig({
							snippetsManager: {
								...settings.snippetsManager,
								location: value,
							},
						})
					}
				/>
				<IconPicker
					app={plugin.app}
					value={settings.snippetsManager.icon}
					onChange={(value) =>
						handleUpdateConfig({
							snippetsManager: {
								...settings.snippetsManager,
								icon: value,
							},
						})
					}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.lightTheme.name")}
				desc={t("setting.lightTheme.desc")}
			>
				<Select
					options={lightThemeOptions}
					value={settings.lightTheme}
					onChange={(value) =>
						handleUpdateConfig({ lightTheme: value })
					}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.darkTheme.name")}
				desc={t("setting.darkTheme.desc")}
			>
				<Select
					options={darkThemeOptions}
					value={settings.darkTheme}
					onChange={(value) =>
						handleUpdateConfig({ darkTheme: value })
					}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.keyboard.name")}
				desc={t("setting.keyboard.desc")}
			>
				<Select
					options={keyboardOptions}
					value={settings.keyboard}
					onChange={(value) =>
						handleUpdateConfig({ keyboard: value })
					}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.fontFamily.name")}
				desc={t("setting.fontFamily.desc")}
				collapsible={true}
				defaultCollapsed={false}
			>
				<TagInput
					values={settings.fontFamily}
					onChange={(value) =>
						handleUpdateConfig({ fontFamily: value })
					}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.fontSize.name")}
				desc={t("setting.fontSize.desc")}
			>
				<Input
					type="number"
					value={settings.fontSize}
					onChange={(value) =>
						handleUpdateConfig({ fontSize: Number(value) })
					}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.tabSize.name")}
				desc={t("setting.tabSize.desc")}
			>
				<Input
					type="number"
					value={settings.tabSize}
					onChange={(value) =>
						handleUpdateConfig({ tabSize: Number(value) })
					}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.lineNumbers.name")}
				desc={t("setting.lineNumbers.desc")}
			>
				<Toggle
					checked={settings.lineNumbers}
					onChange={(value) =>
						handleUpdateConfig({ lineNumbers: value })
					}
				/>
			</SettingsItem>
		</>
	);
};
