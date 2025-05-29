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
import { Notice } from "obsidian";

interface FontData {
	family: string;
	fullName: string;
	postscriptName: string;
	style: string;
	blob(): Promise<Blob>;
}

declare global {
	interface Window {
		queryLocalFonts: () => Promise<FontData[]>;
	}
}

interface AceSettingsProps {
	plugin: AceCodeEditorPlugin;
}

export const AceSettings: React.FC<AceSettingsProps> = ({ plugin }) => {
	const { settings, updateSettings } = useSettings(plugin);
	const [systemFonts, setSystemFonts] = React.useState<string[]>([]);

	// 加载系统字体
	React.useEffect(() => {
		async function loadSystemFonts() {
			try {
				const fonts = await window.queryLocalFonts();
				// 创建字体族的Map以检查是否已添加
				const fontFamilies = new Set<string>();

				// 遍历所有字体，将每个唯一的family添加到Set中
				fonts.forEach((font) => {
					if (font.family) {
						fontFamilies.add(font.family);
					}
				});
				// 转换Set为数组
				setSystemFonts(Array.from(fontFamilies).sort());
			} catch (error) {
				new Notice(
					"无法访问系统字体，可能需要授权或使用更现代的浏览器"
				);
				throw new Error("获取系统字体失败:" + error);
			}
		}

		loadSystemFonts();
	}, []);

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
					placeholder={t("setting.supportExtensions.placeholder")}
					suggestions={Object.values(languageModeMap).flat()}
				/>
			</SettingsItem>

			<SettingsItem
				name={t("setting.snippetsManager.name")}
				desc={t("setting.snippetsManager.desc")}
			>
				<Toggle
					checked={settings.snippetsManager.location}
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
					suggestions={systemFonts}
					placeholder={t("setting.fontFamily.placeholder")}
					renderCustomSuggestion={(font) => (
						<div
							className="ace-font-family"
							style={{
								fontFamily: font,
							}}
						>
							<span>{font}</span>
						</div>
					)}
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
