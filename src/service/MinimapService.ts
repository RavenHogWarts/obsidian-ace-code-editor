import * as ace from "ace-builds";

export interface MinimapConfig {
	enabled: boolean;
	width: number;
	maxWidth: number;
	showSlider: boolean;
	scale: number;
}

export class MinimapService {
	private editor: ace.Ace.Editor | null = null;
	private minimapContainer: HTMLElement | null = null;
	private minimapCanvas: HTMLCanvasElement | null = null;
	private sliderElement: HTMLElement | null = null;
	private config: MinimapConfig;
	private isDestroyed = false;

	// 缓存变量
	private lineHeight = 0;
	private charWidth = 0;
	private editorHeight = 0;
	private totalLines = 0;

	constructor(config: MinimapConfig) {
		this.config = config;
	}

	public init(editor: ace.Ace.Editor, container: HTMLElement) {
		if (!this.config.enabled) return;

		this.editor = editor;
		this.isDestroyed = false;

		// 创建 minimap 容器
		this.createMinimapElements(container);

		// 绑定事件
		this.bindEvents();

		// 延迟初始渲染，确保编辑器已经完全初始化
		requestAnimationFrame(() => {
			this.render();
		});
	}

	private createMinimapElements(container: HTMLElement) {
		// 创建 minimap 容器
		this.minimapContainer = document.createElement("div");
		this.minimapContainer.className = "ace-minimap-container";
		this.minimapContainer.style.width = `${this.config.width}px`;

		// 创建 canvas
		this.minimapCanvas = document.createElement("canvas");
		this.minimapCanvas.className = "ace-minimap-canvas";
		this.minimapContainer.appendChild(this.minimapCanvas);

		// 创建滑块（视口指示器）
		if (this.config.showSlider) {
			this.sliderElement = document.createElement("div");
			this.sliderElement.className = "ace-minimap-slider";
			this.minimapContainer.appendChild(this.sliderElement);
		}

		// 将 minimap 添加到容器
		container.appendChild(this.minimapContainer);
	}

	private bindEvents() {
		if (!this.editor || !this.minimapCanvas || !this.minimapContainer)
			return;

		// 监听编辑器变化
		this.editor.on("change", () => this.render());
		this.editor
			.getSession()
			.on("changeScrollTop", () => this.updateSlider());
		this.editor.renderer.on("afterRender", () => this.render());

		// 监听 minimap 点击事件
		this.minimapCanvas.addEventListener("click", (e) =>
			this.handleMinimapClick(e)
		);
		this.minimapCanvas.addEventListener("mousedown", (e) =>
			this.handleMinimapMouseDown(e)
		);

		// 监听 slider 拖动
		if (this.sliderElement) {
			this.sliderElement.addEventListener("mousedown", (e) =>
				this.handleSliderMouseDown(e)
			);
		}

		// 监听窗口大小变化
		window.addEventListener("resize", () => this.render());
	}

	private handleMinimapClick(e: MouseEvent) {
		if (!this.editor || !this.minimapCanvas) return;

		const rect = this.minimapCanvas.getBoundingClientRect();
		const y = e.clientY - rect.top;
		const totalHeight = this.minimapCanvas.height;
		const session = this.editor.getSession();
		const totalLines = session.getLength();

		// 计算点击位置对应的行号
		const targetLine = Math.floor((y / totalHeight) * totalLines);

		// 滚动到目标行
		this.editor.scrollToLine(targetLine, true, true, () => {});
	}

	private handleMinimapMouseDown(e: MouseEvent) {
		if (!this.editor || !this.minimapCanvas) return;

		e.preventDefault();

		const handleMouseMove = (moveEvent: MouseEvent) => {
			if (!this.minimapCanvas || !this.editor) return;

			const rect = this.minimapCanvas.getBoundingClientRect();
			const y = moveEvent.clientY - rect.top;
			const totalHeight = this.minimapCanvas.height;
			const session = this.editor.getSession();
			const totalLines = session.getLength();

			const targetLine = Math.floor((y / totalHeight) * totalLines);
			this.editor.scrollToLine(targetLine, true, true, () => {});
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}

	private handleSliderMouseDown(e: MouseEvent) {
		if (!this.editor || !this.sliderElement) return;

		e.preventDefault();
		e.stopPropagation();

		const startY = e.clientY;
		const startScrollTop = this.editor.getSession().getScrollTop();

		const handleMouseMove = (moveEvent: MouseEvent) => {
			if (!this.editor || !this.minimapCanvas) return;

			const deltaY = moveEvent.clientY - startY;
			const totalHeight = this.minimapCanvas.height;
			const session = this.editor.getSession();
			const totalLines = session.getLength();
			const lineHeight = this.editor.renderer.lineHeight;

			// 计算滚动比例
			const scrollRatio = deltaY / totalHeight;
			const scrollDelta = scrollRatio * totalLines * lineHeight;

			session.setScrollTop(startScrollTop + scrollDelta);
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	}

	private render() {
		if (
			this.isDestroyed ||
			!this.editor ||
			!this.minimapCanvas ||
			!this.config.enabled
		)
			return;

		const session = this.editor.getSession();
		const renderer = this.editor.renderer;

		// 更新缓存变量
		this.totalLines = session.getLength();
		this.lineHeight = renderer.lineHeight;
		this.charWidth = renderer.characterWidth;
		this.editorHeight = this.editor.container.clientHeight;

		// 设置 canvas 尺寸
		const dpr = window.devicePixelRatio || 1;
		const canvasWidth = this.config.width * dpr;
		const canvasHeight = this.editorHeight * dpr;

		this.minimapCanvas.width = canvasWidth;
		this.minimapCanvas.height = canvasHeight;
		this.minimapCanvas.style.width = `${this.config.width}px`;
		this.minimapCanvas.style.height = `${this.editorHeight}px`;

		const ctx = this.minimapCanvas.getContext("2d");
		if (!ctx) return;

		// 缩放 canvas 以适应高分辨率屏幕
		ctx.scale(dpr, dpr);

		// 清空 canvas
		ctx.clearRect(0, 0, this.config.width, this.editorHeight);

		// 渲染代码
		this.renderCode(ctx);

		// 更新滑块位置
		this.updateSlider();
	}

	private renderCode(ctx: CanvasRenderingContext2D) {
		if (!this.editor) return;

		const session = this.editor.getSession();
		const totalLines = session.getLength();
		const scale = this.config.scale;
		const lineHeight = 2; // minimap 中每行的高度（像素）
		const charWidth = 1.2; // minimap 中每个字符的宽度（像素）

		// 获取编辑器主题颜色
		const editorElement = this.editor.container;
		const computedStyle = window.getComputedStyle(editorElement);
		const backgroundColor =
			computedStyle.backgroundColor || "rgb(255, 255, 255)";
		const textColor = computedStyle.color || "rgb(0, 0, 0)";

		// 绘制背景
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, this.config.width, this.editorHeight);

		// 设置文字颜色（降低透明度）
		const rgbMatch = textColor.match(/\d+/g);
		if (rgbMatch && rgbMatch.length >= 3) {
			ctx.fillStyle = `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, 0.4)`;
		} else {
			ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
		}

		// 计算可见区域
		const maxVisibleLines = Math.floor(this.editorHeight / lineHeight);
		const startLine = 0;
		const endLine = Math.min(totalLines, maxVisibleLines);

		// 逐行渲染
		for (let i = startLine; i < endLine; i++) {
			const line = session.getLine(i);
			if (!line) continue;

			const y = i * lineHeight;

			// 简化渲染：只绘制非空白字符的位置
			for (let j = 0; j < line.length; j++) {
				const char = line[j];
				if (char && char.trim() !== "") {
					const x = j * charWidth;
					ctx.fillRect(x, y, charWidth, lineHeight);
				}
			}
		}
	}

	private updateSlider() {
		if (
			!this.editor ||
			!this.sliderElement ||
			!this.minimapCanvas ||
			!this.config.showSlider
		)
			return;

		const session = this.editor.getSession();
		const renderer = this.editor.renderer;
		const scrollTop = session.getScrollTop();
		const totalLines = session.getLength();
		const lineHeight = renderer.lineHeight;
		const editorHeight = this.editor.container.clientHeight;
		const minimapHeight = this.minimapCanvas.height;

		// 边界检查：防止除零和无效值
		if (totalLines === 0 || lineHeight === 0 || editorHeight === 0) {
			this.sliderElement.style.top = `0px`;
			this.sliderElement.style.height = `0px`;
			return;
		}

		// 计算滑块位置和高度
		const visibleLines = Math.floor(editorHeight / lineHeight);
		const totalHeight = totalLines * lineHeight;
		const scrollRatio = totalHeight > 0 ? scrollTop / totalHeight : 0;
		const sliderHeight =
			totalLines > 0 ? (visibleLines / totalLines) * editorHeight : 0;
		const sliderTop = scrollRatio * editorHeight;

		// 更新滑块样式
		this.sliderElement.style.top = `${Math.max(0, sliderTop)}px`;
		this.sliderElement.style.height = `${Math.max(
			0,
			Math.min(sliderHeight, editorHeight)
		)}px`;
	}

	public updateConfig(config: Partial<MinimapConfig>) {
		this.config = { ...this.config, ...config };

		if (this.minimapContainer) {
			this.minimapContainer.style.width = `${this.config.width}px`;
		}

		if (!this.config.enabled) {
			this.hide();
		} else {
			this.show();
			this.render();
		}
	}

	public show() {
		if (this.minimapContainer) {
			this.minimapContainer.style.display = "block";
		}
	}

	public hide() {
		if (this.minimapContainer) {
			this.minimapContainer.style.display = "none";
		}
	}

	public destroy() {
		this.isDestroyed = true;

		// 移除 DOM 元素
		if (this.minimapContainer && this.minimapContainer.parentNode) {
			this.minimapContainer.parentNode.removeChild(this.minimapContainer);
		}

		// 清空引用
		this.editor = null;
		this.minimapContainer = null;
		this.minimapCanvas = null;
		this.sliderElement = null;
	}
}
