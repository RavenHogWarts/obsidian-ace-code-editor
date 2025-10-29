import { ModalContext, ModalContextType } from "@src/component/modal/BaseModal";
import * as React from "react";

// Custom hook to access modal context
export const useModal = (): ModalContextType => {
	const context = React.useContext(ModalContext);
	if (!context) {
		throw new Error("useModal must be used within a ModalContext.Provider");
	}
	return context;
};
