import { useSettings } from "@/src/core/hook/useSettings";
import { ICodeEditorConfig } from "@/src/core/interfaces/types";
import { languageModeMap } from "@/src/core/services/AceLanguages";
import {
	AceDarkThemesList,
	AceKeyboardList,
	AceLightThemesList,
} from "@/src/core/services/AceThemes";
import { t } from "@/src/i18n/i18n";
import AceCodeEditorPlugin from "@/src/main";
import parse from "html-react-parser";
import { Notice, Platform } from "obsidian";
import * as React from "react";
import { IconPicker } from "../Base/IconPicker";
import { Input } from "../Base/Input";
import { Select } from "../Base/Select";
import { TabNav, TabNavItem } from "../Base/TabNav";
import { TagInput } from "../Base/TagInput";
import { Toggle } from "../Base/Toggle";
import { SettingsItem } from "./SettingItem";

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
				let fonts: string[] = [];

				// 根据平台选择不同的字体获取策略
				if (Platform.isDesktopApp) {
					// 桌面端：尝试使用 Local Font Access API
					if ("queryLocalFonts" in window) {
						try {
							const localFonts = await window.queryLocalFonts();
							const fontFamilies = new Set<string>();

							localFonts.forEach((font) => {
								if (font.family) {
									fontFamilies.add(font.family);
								}
							});

							fonts = Array.from(fontFamilies).sort();
						} catch (error) {
							console.warn(
								"Local Font Access API failed:",
								error
							);
							// 降级到预定义字体列表，但只包含可用的
							fonts = await getAvailableFonts(
								getDesktopFallbackFonts()
							);
						}
					} else {
						// 桌面端但不支持 Local Font Access API，检测可用字体
						fonts = await getAvailableFonts(
							getDesktopFallbackFonts()
						);
					}
				} else if (Platform.isMobileApp) {
					// 移动端：检测可用的移动端字体
					fonts = await getAvailableFonts(getMobileFallbackFonts());
				} else {
					// Web端或其他平台：检测可用的通用字体
					fonts = await getAvailableFonts(getWebFallbackFonts());
				}

				// 确保至少有基础字体可用
				if (fonts.length === 0) {
					fonts = await getAvailableFonts(getBasicFallbackFonts());
				}

				setSystemFonts(fonts);
			} catch (error) {
				new Notice("无法获取系统字体，已加载基础字体列表");
				console.error("获取系统字体失败:", error);
				// 使用最基础的字体列表作为最后的降级方案
				const basicFonts = await getAvailableFonts(
					getBasicFallbackFonts()
				);
				setSystemFonts(
					basicFonts.length > 0
						? basicFonts
						: ["monospace", "sans-serif"]
				);
			}
		}

		loadSystemFonts();
	}, []);

	// 异步检测字体可用性并返回可用字体列表
	async function getAvailableFonts(fontList: string[]): Promise<string[]> {
		const availableFonts: string[] = [];

		// 批量检测字体可用性
		for (const font of fontList) {
			if (await isFontAvailable(font)) {
				availableFonts.push(font);
			}
		}

		return availableFonts.sort();
	}

	// 获取桌面端常见字体（Windows/macOS/Linux）
	function getDesktopFallbackFonts(): string[] {
		return [
			// 编程字体
			"Fira Code",
			"Source Code Pro",
			"JetBrains Mono",
			"Cascadia Code",
			"Monaco",
			"Menlo",
			"Consolas",
			"Courier New",
			// Windows 字体
			"Microsoft YaHei",
			"SimSun",
			"SimHei",
			"Arial",
			"Times New Roman",
			"Calibri",
			"Segoe UI",
			// macOS 字体
			"PingFang SC",
			"Helvetica Neue",
			"San Francisco",
			"Hiragino Sans GB",
			// Linux 字体
			"Noto Sans CJK SC",
			"WenQuanYi Micro Hei",
			"Ubuntu",
			"DejaVu Sans",
		];
	}

	// 获取移动端常见字体
	function getMobileFallbackFonts(): string[] {
		return [
			"system-ui",
			"-apple-system",
			"BlinkMacSystemFont",
			"Roboto",
			"Helvetica Neue",
			"Arial",
			"Noto Sans",
			"sans-serif",
			"monospace",
		];
	}

	// 获取Web端通用字体
	function getWebFallbackFonts(): string[] {
		return [
			"system-ui",
			"-apple-system",
			"BlinkMacSystemFont",
			"Segoe UI",
			"Roboto",
			"Helvetica Neue",
			"Arial",
			"Noto Sans",
			"sans-serif",
			"Consolas",
			"Monaco",
			"monospace",
		];
	}

	// 获取基础降级字体
	function getBasicFallbackFonts(): string[] {
		return ["monospace", "sans-serif", "serif", "Arial", "Courier New"];
	}

	// 异步检测字体是否可用（优化版本）
	async function isFontAvailable(fontName: string): Promise<boolean> {
		return new Promise((resolve) => {
			try {
				// 创建测试元素
				const testElement = document.createElement("div");
				testElement.style.position = "absolute";
				testElement.style.visibility = "hidden";
				testElement.style.fontSize = "12px";
				testElement.style.fontFamily = "monospace";
				testElement.textContent = "mmmmmmmmmmlli";

				document.body.appendChild(testElement);
				const defaultWidth = testElement.offsetWidth;

				// 测试目标字体
				testElement.style.fontFamily = `"${fontName}", monospace`;
				const testWidth = testElement.offsetWidth;

				// 清理测试元素
				document.body.removeChild(testElement);

				// 如果宽度不同，说明字体可用
				resolve(defaultWidth !== testWidth);
			} catch (error) {
				console.warn(`Font detection failed for ${fontName}:`, error);
				resolve(false);
			}
		});
	}

	const handleUpdateConfig = async (
		newSettings: Partial<ICodeEditorConfig>
	) => {
		await updateSettings({ ...settings, ...newSettings });
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

	const EditorSettings = () => {
		return (
			<>
				<SettingsItem
					name={t("setting.highlightActiveLine.name")}
					desc={t("setting.highlightActiveLine.desc")}
				>
					<Toggle
						checked={settings.highlightActiveLine}
						onChange={(value) =>
							handleUpdateConfig({ highlightActiveLine: value })
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={t("setting.highlightSelectedWord.name")}
					desc={t("setting.highlightSelectedWord.desc")}
				>
					<Toggle
						checked={settings.highlightSelectedWord}
						onChange={(value) =>
							handleUpdateConfig({ highlightSelectedWord: value })
						}
					/>
				</SettingsItem>
			</>
		);
	};

	const RendererSettings = () => {
		return (
			<>
				<SettingsItem
					name={t("setting.lightTheme.name")}
					desc={t("setting.lightTheme.desc")}
				>
					<Select
						options={lightThemeOptions}
						value={settings.lightTheme}
						onChange={(value) =>
							handleUpdateConfig({ lightTheme: value as string })
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
							handleUpdateConfig({ darkTheme: value as string })
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
					name={t("setting.showLineNumbers.name")}
					desc={t("setting.showLineNumbers.desc")}
				>
					<Toggle
						checked={settings.showLineNumbers}
						onChange={(value) =>
							handleUpdateConfig({ showLineNumbers: value })
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={t("setting.showPrintMargin.name")}
					desc={t("setting.showPrintMargin.desc")}
				>
					<Toggle
						checked={settings.showPrintMargin}
						onChange={(value) =>
							handleUpdateConfig({ showPrintMargin: value })
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={t("setting.showInvisibles.name")}
					desc={t("setting.showInvisibles.desc")}
				>
					<Toggle
						checked={settings.showInvisibles}
						onChange={(value) =>
							handleUpdateConfig({ showInvisibles: value })
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={t("setting.displayIndentGuides.name")}
					desc={t("setting.displayIndentGuides.desc")}
				>
					<Toggle
						checked={settings.displayIndentGuides}
						onChange={(value) =>
							handleUpdateConfig({ displayIndentGuides: value })
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={t("setting.showFoldWidgets.name")}
					desc={t("setting.showFoldWidgets.desc")}
				>
					<Toggle
						checked={settings.showFoldWidgets}
						onChange={(value) =>
							handleUpdateConfig({ showFoldWidgets: value })
						}
					/>
				</SettingsItem>
			</>
		);
	};

	const SessionSettings = () => {
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
					name={t("setting.keyboard.name")}
					desc={t("setting.keyboard.desc")}
				>
					<Select
						options={keyboardOptions}
						value={settings.keyboard}
						onChange={(value) =>
							handleUpdateConfig({ keyboard: value as string })
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
			</>
		);
	};

	const ExtendSettings = () => {
		return (
			<>
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
			</>
		);
	};

	const AboutSettings = () => {
		return (
			<>
				<SettingsItem
					name={"wiki"}
					desc={parse(t("setting.desc"))}
				></SettingsItem>
			</>
		);
	};

	const settingsTabNavItems: TabNavItem[] = [
		{
			id: "renderer",
			title: t("setting.tabs.renderer"),
			content: <RendererSettings />,
		},
		{
			id: "session",
			title: t("setting.tabs.session"),
			content: <SessionSettings />,
		},
		{
			id: "editor",
			title: t("setting.tabs.editor"),
			content: <EditorSettings />,
		},
		{
			id: "extend",
			title: t("setting.tabs.extend"),
			content: <ExtendSettings />,
		},
		{
			id: "about",
			title: t("setting.tabs.about"),
			content: <AboutSettings />,
		},
	];

	return (
		<TabNav
			tabs={settingsTabNavItems}
			defaultValue="renderer"
			className="ace-settings-container"
		/>
	);
};
