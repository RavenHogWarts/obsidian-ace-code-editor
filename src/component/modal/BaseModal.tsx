import AceCodeEditorPlugin from "@src/main";
import { X } from "lucide-react";
import { Modal } from "obsidian";
import { StrictMode, Suspense, lazy } from "react";
import { Root, createRoot } from "react-dom/client";

const ModalLoading: React.FC = () => (
	<div className="ace-modal-loading">
		<span>Loading...</span>
	</div>
);

export class BaseModal<T extends { onClose: () => void }> extends Modal {
	private root: Root | null = null;
	private componentProps: T;
	private sizeClass: string | undefined;
	private Component:
		| React.ComponentType<T>
		| React.LazyExoticComponent<React.ComponentType<T>>;

	constructor(
		plugin: AceCodeEditorPlugin,
		component:
			| React.ComponentType<T>
			| (() => Promise<{ default: React.ComponentType<T> }>),
		props: Omit<T, "onClose"> & { onClose?: () => void },
		sizeClass?: string
	) {
		super(plugin.app);

		// Determine if component is a lazy factory or a direct component
		if (this.isLazyFactory(component)) {
			this.Component = lazy(component);
		} else {
			this.Component = component;
		}

		this.componentProps = {
			...(props as T),
			onClose: () => {
				if (props.onClose) {
					props.onClose();
				}
				this.close();
			},
		};
		this.sizeClass = sizeClass;
	}

	private isLazyFactory(
		component:
			| React.ComponentType<T>
			| (() => Promise<{ default: React.ComponentType<T> }>)
	): component is () => Promise<{ default: React.ComponentType<T> }> {
		// Heuristic: Components matching T (which has onClose) must accept props, so length > 0.
		// Lazy factories usually take 0 arguments.
		return typeof component === "function" && component.length === 0;
	}

	async onOpen(): Promise<void> {
		if (this.sizeClass) {
			this.openAsCustomModal();
		} else {
			this.openAsObsidianModal();
		}
	}

	private async openAsCustomModal() {
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
						<this.Component {...this.componentProps} />
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

	private async openAsObsidianModal() {
		const { contentEl } = this;
		this.root = createRoot(contentEl);
		this.root.render(
			<StrictMode>
				<Suspense fallback={<ModalLoading />}>
					<this.Component {...this.componentProps} />
				</Suspense>
			</StrictMode>
		);
	}

	async onClose() {
		this.root?.unmount();
		this.root = null;
		this.containerEl.empty();
	}
}
