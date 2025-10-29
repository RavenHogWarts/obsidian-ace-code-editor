import { useContext } from "react";
import { SettingsStoreContext } from "../context/SettingsStoreContext";
import SettingsStore from "../settings/SettingsStore";

export default function useSettingsStore(): SettingsStore {
	const store = useContext(SettingsStoreContext);
	if (!store) {
		throw new Error(
			"useSettingsStore must be used within a SettingsProvider"
		);
	}
	return store;
}
