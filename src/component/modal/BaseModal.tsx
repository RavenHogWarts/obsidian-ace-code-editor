import AceCodeEditorPlugin from "@src/main";
import { X } from "lucide-react";
import { App, Modal } from "obsidian";
import { StrictMode, Suspense, lazy } from "react";
import { Root, createRoot } from "react-dom/client";

const ModalLoading: React.FC = () => (
	<div className="ace-modal-loading">
		<span>Loading...</span>
	</div>
);

export class BaseModal<T extends { onClose: () => void }> extends Modal {
	private root: Root | null = null;
	private LazyComponent: React.LazyExoticComponent<React.ComponentType<T>>;
	private componentProps: T;
	private sizeClass: string;

	constructor(
		app: App,
		plugin: AceCodeEditorPlugin,
		componentImport: () => Promise<{ default: React.ComponentType<T> }>,
		props: T,
		sizeClass = "modal-size-large"
	) {
		super(app);
		this.LazyComponent = lazy(componentImport);
		this.componentProps = {
			...props,
			onClose: () => {
				props.onClose();
				this.close();
			},
		};
		this.sizeClass = sizeClass;
	}

	async onOpen(): Promise<void> {
		const el = this.containerEl;
		el.classList.add("ace-modal-container");

		el.addEventListener("click", (e) => {
			if (e.target === el) {
				this.close();
			}
		});

		this.root = createRoot(el);
		this.root.render(
			<StrictMode>
				<div className={`ace-modal ${this.sizeClass}`}>
					<Suspense fallback={<ModalLoading />}>
						<this.LazyComponent {...this.componentProps} />
					</Suspense>
					<div
						className="ace-modal-close"
						onClick={() => this.close()}
					>
						<X size={18} />
					</div>
				</div>
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
		this.root = null;
		this.containerEl.empty();
	}
}
