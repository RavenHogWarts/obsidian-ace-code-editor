import SettingsStore from "@src/settings/SettingsStore";
import { ICodeEditorConfig } from "@src/type/types";
import { useSyncExternalStore } from "react";

export default function usePluginSettings(
	settingsStore: SettingsStore
): ICodeEditorConfig {
	const settings = useSyncExternalStore(
		settingsStore.store.subscribe,
		settingsStore.store.getSnapshot
	);
	return settings;
}
