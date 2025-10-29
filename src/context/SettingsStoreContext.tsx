import { createContext } from "react";
import SettingsStore from "../settings/SettingsStore";

export const SettingsStoreContext = createContext<SettingsStore | undefined>(
	undefined
);
