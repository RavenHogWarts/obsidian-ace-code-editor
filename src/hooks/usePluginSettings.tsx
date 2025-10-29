import { useSyncExternalStore } from "react";
import SettingsStore from "../settings/SettingsStore";
import { ICodeEditorConfig } from "../type/types";

export default function usePluginSettings(
	settingsStore: SettingsStore
): ICodeEditorConfig {
	const settings = useSyncExternalStore(
		settingsStore.store.subscribe,
		settingsStore.store.getSnapshot
	);
	return settings;
}
