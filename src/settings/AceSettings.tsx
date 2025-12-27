import { IconPicker } from "@src/component/icon-picker/IconPicker";
import { Input } from "@src/component/input/Input";
import { Select } from "@src/component/select/Select";
import { TabNav, TabNavItem } from "@src/component/tab-nav/TabNav";
import { TagInput } from "@src/component/tag-input/TagInput";
import { Toggle } from "@src/component/toggle/Toggle";
import usePluginSettings from "@src/hooks/usePluginSettings";
import useSettingsStore from "@src/hooks/useSettingsStore";
import { LL } from "@src/i18n/i18n";
import { languageModeMap } from "@src/service/AceLanguages";
import {
	AceDarkThemesList,
	AceKeyboardList,
	AceLightThemesList,
} from "@src/service/AceThemes";
import parse from "html-react-parser";
import { Notice, Platform } from "obsidian";
import { useEffect, useMemo, useState } from "react";
import { SettingsItem } from "./item/SettingItem";

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

interface AceSettingsProps {}

export const AceSettings: React.FC<AceSettingsProps> = ({}) => {
	const settingsStore = useSettingsStore();
	const settings = usePluginSettings(settingsStore);
	const app = settingsStore.app;

	const [systemFonts, setSystemFonts] = useState<string[]>([]);

	// 加载系统字体
	useEffect(() => {
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

	const lightThemeOptions = useMemo(
		() =>
			AceLightThemesList.map((theme) => ({
				value: theme,
				label: theme,
			})),
		[]
	);

	const darkThemeOptions = useMemo(
		() =>
			AceDarkThemesList.map((theme) => ({
				value: theme,
				label: theme,
			})),
		[]
	);

	const keyboardOptions = useMemo(
		() =>
			AceKeyboardList.map((keyboard) => ({
				value: keyboard,
				label: keyboard,
			})),
		[]
	);

	const EditorSettings = useMemo(() => {
		return <></>;
	}, []);

	const RendererSettings = useMemo(() => {
		return (
			<>
				<SettingsItem
					name={LL.setting.lightTheme.name()}
					desc={LL.setting.lightTheme.desc()}
				>
					<Select
						options={lightThemeOptions}
						value={settings.lightTheme}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"lightTheme",
								value as string
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.darkTheme.name()}
					desc={LL.setting.darkTheme.desc()}
				>
					<Select
						options={darkThemeOptions}
						value={settings.darkTheme}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"darkTheme",
								value as string
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.fontFamily.name()}
					desc={LL.setting.fontFamily.desc()}
					collapsible={true}
					defaultCollapsed={false}
				>
					<TagInput
						values={settings.fontFamily}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"fontFamily",
								value
							)
						}
						suggestions={systemFonts}
						placeholder={LL.setting.fontFamily.placeholder()}
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
					name={LL.setting.fontSize.name()}
					desc={LL.setting.fontSize.desc()}
				>
					<Input
						type="number"
						value={settings.fontSize}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"fontSize",
								Number(value)
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.showLineNumbers.name()}
					desc={LL.setting.showLineNumbers.desc()}
				>
					<Toggle
						checked={settings.showLineNumbers}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"showLineNumbers",
								value
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.showPrintMargin.name()}
					desc={LL.setting.showPrintMargin.desc()}
				>
					<Toggle
						checked={settings.showPrintMargin}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"showPrintMargin",
								value
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.showInvisibles.name()}
					desc={LL.setting.showInvisibles.desc()}
				>
					<Toggle
						checked={settings.showInvisibles}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"showInvisibles",
								value
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.displayIndentGuides.name()}
					desc={LL.setting.displayIndentGuides.desc()}
				>
					<Toggle
						checked={settings.displayIndentGuides}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"displayIndentGuides",
								value
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.showFoldWidgets.name()}
					desc={LL.setting.showFoldWidgets.desc()}
				>
					<Toggle
						checked={settings.showFoldWidgets}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"showFoldWidgets",
								value
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.minimap.enabled.name()}
					desc={LL.setting.minimap.enabled.desc()}
				>
					<Toggle
						checked={settings.minimap.enabled}
						onChange={(value) =>
							settingsStore.updateSettingByPath("minimap", {
								enabled: value,
							})
						}
					/>
				</SettingsItem>
			</>
		);
	}, [settings, systemFonts]);

	const SessionSettings = useMemo(() => {
		return (
			<>
				<SettingsItem
					name={LL.setting.supportExtensions.name()}
					desc={LL.setting.supportExtensions.desc()}
					collapsible={true}
					defaultCollapsed={false}
				>
					<TagInput
						values={settings.supportExtensions}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"supportExtensions",
								value
							)
						}
						placeholder={LL.setting.supportExtensions.placeholder()}
						suggestions={Object.values(languageModeMap).flat()}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.keyboard.name()}
					desc={LL.setting.keyboard.desc()}
				>
					<Select
						options={keyboardOptions}
						value={settings.keyboard}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"keyboard",
								value as string
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.tabSize.name()}
					desc={LL.setting.tabSize.desc()}
				>
					<Input
						type="number"
						value={settings.tabSize}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"tabSize",
								Number(value)
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.wrap.name()}
					desc={LL.setting.wrap.desc()}
				>
					<Toggle
						checked={settings.wrap}
						onChange={(value) =>
							settingsStore.updateSettingByPath("wrap", value)
						}
					/>
				</SettingsItem>
			</>
		);
	}, [settings]);

	const ExtendSettings = useMemo(() => {
		return (
			<>
				<SettingsItem
					name={LL.setting.snippetsManager.name()}
					desc={LL.setting.snippetsManager.desc()}
				>
					<Toggle
						checked={settings.snippetsManager.location}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"snippetsManager",
								{
									...settings.snippetsManager,
									location: value,
								}
							)
						}
					/>
					<IconPicker
						app={app}
						value={settings.snippetsManager.icon}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"snippetsManager",
								{
									...settings.snippetsManager,
									icon: value,
								}
							)
						}
					/>
				</SettingsItem>

				<SettingsItem
					name={LL.setting.embedMaxHeight.name()}
					desc={LL.setting.embedMaxHeight.desc()}
				>
					<Input
						type="number"
						value={settings.embedMaxHeight}
						onChange={(value) =>
							settingsStore.updateSettingByPath(
								"embedMaxHeight",
								Number(value)
							)
						}
					/>
				</SettingsItem>
			</>
		);
	}, [settings, app]);

	const AboutSettings = useMemo(() => {
		return (
			<>
				<SettingsItem
					name={"wiki"}
					desc={parse(LL.setting.desc())}
				></SettingsItem>
			</>
		);
	}, []);

	const settingsTabNavItems: TabNavItem[] = useMemo(
		() => [
			{
				id: "renderer",
				title: LL.setting.tabs.renderer(),
				content: RendererSettings,
			},
			{
				id: "session",
				title: LL.setting.tabs.session(),
				content: SessionSettings,
			},
			{
				id: "editor",
				title: LL.setting.tabs.editor(),
				content: EditorSettings,
				disabled: true,
			},
			{
				id: "extend",
				title: LL.setting.tabs.extend(),
				content: ExtendSettings,
			},
			{
				id: "about",
				title: LL.setting.tabs.about(),
				content: AboutSettings,
			},
		],
		[
			RendererSettings,
			SessionSettings,
			EditorSettings,
			ExtendSettings,
			AboutSettings,
		]
	);

	return (
		<TabNav
			tabs={settingsTabNavItems}
			defaultValue="renderer"
			className="ace-settings-container"
		/>
	);
};
