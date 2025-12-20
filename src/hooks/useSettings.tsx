import AceCodeEditorPlugin from "@src/main";
import { ICodeEditorConfig } from "@src/type/types";
import { useCallback, useEffect, useState } from "react";

export const SettingsBus = {
	listeners: new Set<() => void>(),

	// 订阅事件更新
	subscribe(callback: () => void) {
		this.listeners.add(callback);
		return () => {
			this.listeners.delete(callback);
		};
	},

	// 发布事件更新通知
	publish() {
		this.listeners.forEach((callback) => callback());
	},
};

export function useSettings(plugin: AceCodeEditorPlugin) {
	const [settings, setSettings] = useState<ICodeEditorConfig>(
		plugin.getSettings()
	);

	const updateSettings = useCallback(
		async (newSettings: ICodeEditorConfig) => {
			await plugin.updateSettings(newSettings);
			setSettings(newSettings);
			SettingsBus.publish();
		},
		[plugin]
	);

	useEffect(() => {
		setSettings(plugin.settings);

		const unsubscribe = SettingsBus.subscribe(() => {
			setSettings(plugin.settings);
		});

		return unsubscribe;
	}, [plugin]);

	return { settings, updateSettings };
}
