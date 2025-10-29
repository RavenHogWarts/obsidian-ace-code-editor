import AceCodeEditorPlugin from "@src/main";
import { X } from "lucide-react";
import { App, Modal } from "obsidian";
import * as React from "react";
import { createRoot, Root } from "react-dom/client";

interface IBaseModalProps {
	app: App;
	plugin: AceCodeEditorPlugin;
	onClose: () => void;
	additionalProps?: Record<string, any>;
	sizeClass?: string;
}

export interface ModalContextType {
	app: App;
	plugin: AceCodeEditorPlugin;
	additionalProps?: Record<string, any>;
}

export const ModalContext = React.createContext<ModalContextType | null>(null);

const ModalLoading: React.FC = () => (
	<div className="ace-modal-loading">
		<span>Loading...</span>
	</div>
);

export class BaseModal extends Modal {
	private root: Root | null = null;
	private props: IBaseModalProps;
	private LazyComponent: React.LazyExoticComponent<React.ComponentType<any>>;

	constructor(
		app: App,
		plugin: AceCodeEditorPlugin,
		componentImport: () => Promise<{ default: React.ComponentType<any> }>,
		additionalProps: Record<string, any> = {},
		sizeClass = "modal-size-large"
	) {
		super(app);
		this.props = {
			app,
			plugin,
			onClose: () => this.close(),
			additionalProps,
			sizeClass,
		};
		this.LazyComponent = React.lazy(componentImport);
	}

	async onOpen(): Promise<void> {
		const el = this.containerEl;
		this.root = createRoot(el);
		this.root.render(
			<React.StrictMode>
				<div className={`ace-modal ${this.props.sizeClass}`}>
					<ModalContext.Provider
						value={{
							app: this.props.app,
							plugin: this.props.plugin,
							additionalProps: this.props.additionalProps,
						}}
					>
						<React.Suspense fallback={<ModalLoading />}>
							<this.LazyComponent {...this.props} />
						</React.Suspense>
					</ModalContext.Provider>
					<div
						className="ace-modal-close"
						onClick={() => this.close()}
					>
						<X size={18} />
					</div>
				</div>
			</React.StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
		this.root = null;
		this.containerEl.empty();
	}
}
