import * as ace from "ace-builds";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface MinimapProps {
	editor: ace.Ace.Editor | null;
	enabled: boolean;
	mode?: "always" | "hover";
}

// 语法高亮颜色映射 (可根据你的编辑器主题调整)
const TOKEN_COLORS: Record<string, string> = {
	comment: "#6a9955", // 绿色
	string: "#ce9178", // 橙红
	constant: "#569cd6", // 蓝色
	keyword: "#c586c0", // 紫色
	default: "rgba(128, 128, 128, 0.5)", // 默认灰
};

export const Minimap: React.FC<MinimapProps> = ({
	editor,
	enabled,
	mode = "always",
}) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const sliderRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [isHovering, setIsHovering] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const isDraggingRef = useRef(false);

	const config = useMemo(
		() => ({
			lineHeight: 3, // Minimap 行高 (px)
			charWidth: 2, // Minimap 字符宽 (px)
			sliderRatio: 0.1, // 长文档模式下滑块占视口高度的比例 (0.1 = 10%)
		}),
		[]
	);

	// ============================================================================
	// 1. 核心渲染逻辑 (Canvas)
	// ============================================================================
	const renderMinimap = useCallback(() => {
		if (!editor || !canvasRef.current || !containerRef.current || !enabled)
			return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const session = editor.getSession();
		const totalLines = session.getLength();

		// 计算 Minimap 所需的真实高度
		const requiredHeight = totalLines * config.lineHeight;
		const parentHeight = editor.container.clientHeight;

		// --- 容器高度自适应 ---
		// 短文档：容器高度 = 代码真实高度
		// 长文档：容器高度 = 父容器视口高度
		const containerHeight = Math.min(requiredHeight, parentHeight);
		containerRef.current.style.height = `${containerHeight}px`;

		// --- 处理高清屏 (DPR) ---
		const dpr = window.devicePixelRatio || 1;
		const displayWidth = containerRef.current.clientWidth;

		// 只有尺寸变动时才重设 Canvas 大小 (避免闪烁)
		if (
			canvas.width !== displayWidth * dpr ||
			canvas.height !== containerHeight * dpr
		) {
			canvas.width = displayWidth * dpr;
			canvas.height = containerHeight * dpr;
			ctx.scale(dpr, dpr);
		}

		ctx.clearRect(0, 0, displayWidth, containerHeight);

		// --- 计算绘制范围 ---
		const isShortDoc = requiredHeight <= parentHeight;
		let startRow = 0;

		if (!isShortDoc) {
			// 长文档：计算偏移量，使 Minimap 尽量跟随主编辑器视野
			const firstRow = editor.getFirstVisibleRow();
			const lastRow = editor.getLastVisibleRow();
			const visibleRows = lastRow - firstRow;
			const canvasCapacity = Math.floor(
				containerHeight / config.lineHeight
			);

			if (totalLines > canvasCapacity) {
				const centerRow = firstRow + visibleRows / 2;
				startRow = centerRow - canvasCapacity / 2;
				// 边界限制
				if (startRow < 0) startRow = 0;
				if (startRow + canvasCapacity > totalLines)
					startRow = totalLines - canvasCapacity;
			}
		}

		const endLine = Math.min(
			totalLines,
			startRow + Math.ceil(containerHeight / config.lineHeight)
		);

		// --- 逐行绘制 ---
		for (let i = Math.floor(startRow); i < endLine; i++) {
			const tokens = session.getTokens(i);
			// 如果是长文档，Y 坐标需要减去 startRow 偏移
			const y = (i - startRow) * config.lineHeight;
			let x = 0;

			tokens.forEach((token) => {
				const { type, value } = token;
				let fillStyle = TOKEN_COLORS.default;

				// 简单映射 Token 类型到颜色
				if (type.includes("comment")) fillStyle = TOKEN_COLORS.comment;
				else if (type.includes("string"))
					fillStyle = TOKEN_COLORS.string;
				else if (type.includes("keyword"))
					fillStyle = TOKEN_COLORS.keyword;
				else if (type.includes("constant"))
					fillStyle = TOKEN_COLORS.constant;

				ctx.fillStyle = fillStyle;

				// 只绘制非空字符
				if (value.trim().length > 0) {
					ctx.fillRect(
						x,
						y + 0.5,
						value.length * config.charWidth,
						config.lineHeight - 1
					);
				}
				x += value.length * config.charWidth;
			});
		}
	}, [editor, enabled, config]);

	// ============================================================================
	// 2. 更新滑块位置 (Editor -> Minimap)
	// ============================================================================
	const updateSlider = useCallback(() => {
		// 拖拽中不更新，防止抖动
		if (isDraggingRef.current) return;
		if (!editor || !sliderRef.current || !containerRef.current || !enabled)
			return;

		const session = editor.getSession();
		const totalLines = session.getLength();
		const lineHeight = editor.renderer.lineHeight;

		const scrollTop = session.getScrollTop();
		const editorHeight = editor.renderer.getContainerElement().clientHeight;

		const minimapTotalHeight = totalLines * config.lineHeight;
		const containerHeight = containerRef.current.clientHeight;

		// 判断模式
		const isShortDoc = minimapTotalHeight <= editorHeight;

		if (isShortDoc) {
			// --- 短文档模式：线性映射 ---
			const ratio = config.lineHeight / lineHeight;
			const sliderTop = scrollTop * ratio;

			// 滑块高度按比例
			let sliderHeight = editorHeight * ratio;
			sliderHeight = Math.min(sliderHeight, containerHeight);
			if (sliderHeight < 5) sliderHeight = 5; // 最小可见性

			sliderRef.current.style.height = `${sliderHeight}px`;
			sliderRef.current.style.transform = `translateY(${sliderTop}px)`;
		} else {
			// --- 长文档模式：滚动条映射 ---
			// 固定滑块高度 (10% of Editor Height)
			const fixedHeight = editorHeight * config.sliderRatio;
			sliderRef.current.style.height = `${fixedHeight}px`;

			const totalEditorHeight = totalLines * lineHeight;
			const maxScrollTop = Math.max(0, totalEditorHeight - editorHeight);
			const maxSliderTop = Math.max(0, containerHeight - fixedHeight);

			if (maxScrollTop === 0) {
				sliderRef.current.style.transform = `translateY(0px)`;
				return;
			}

			const scrollRatio = scrollTop / maxScrollTop;
			const sliderTop = scrollRatio * maxSliderTop;

			sliderRef.current.style.transform = `translateY(${sliderTop}px)`;
		}
	}, [editor, enabled, config]);

	// ============================================================================
	// 3. 处理滑块拖拽 (Minimap -> Editor)
	// ============================================================================
	const handleSliderMouseDown = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!editor || !sliderRef.current || !containerRef.current) return;

			e.preventDefault();
			e.stopPropagation();

			setIsDragging(true);
			isDraggingRef.current = true;

			const startY = e.clientY;
			const slider = sliderRef.current;
			const container = containerRef.current;

			// 获取初始状态
			const rect = slider.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();
			const startSliderTop = rect.top - containerRect.top;

			const containerHeight = container.clientHeight;
			const sliderHeight = slider.clientHeight;
			const maxSliderTop = Math.max(0, containerHeight - sliderHeight);

			const session = editor.getSession();
			const totalLines = session.getLength();
			const editorHeight =
				editor.renderer.getContainerElement().clientHeight;
			const minimapTotalHeight = totalLines * config.lineHeight;
			const isShortDoc = minimapTotalHeight <= editorHeight;

			const handleMouseMove = (moveEvent: MouseEvent) => {
				const deltaY = moveEvent.clientY - startY;
				let newSliderTop = startSliderTop + deltaY;

				// 限制在容器内
				newSliderTop = Math.max(
					0,
					Math.min(newSliderTop, maxSliderTop)
				);

				// 视觉更新
				slider.style.transform = `translateY(${newSliderTop}px)`;

				// 反向计算 ScrollTop
				if (isShortDoc) {
					const ratio =
						config.lineHeight / editor.renderer.lineHeight;
					session.setScrollTop(newSliderTop / ratio);
				} else {
					const totalEditorHeight =
						session.getScreenLength() * editor.renderer.lineHeight;
					const maxScrollTop = Math.max(
						0,
						totalEditorHeight - editorHeight
					);
					const ratio =
						maxSliderTop > 0 ? newSliderTop / maxSliderTop : 0;
					session.setScrollTop(ratio * maxScrollTop);
				}
			};

			const handleMouseUp = () => {
				setIsDragging(false);
				isDraggingRef.current = false;
				updateSlider(); // 最后校准一次
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		},
		[editor, updateSlider, config]
	);

	// ============================================================================
	// 4. 处理点击跳转
	// ============================================================================
	const handleCanvasClick = useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			if (
				!editor ||
				!canvasRef.current ||
				!containerRef.current ||
				!sliderRef.current
			)
				return;

			const canvas = canvasRef.current;
			const rect = canvas.getBoundingClientRect();
			const clickY = e.clientY - rect.top;

			const session = editor.getSession();
			const totalLines = session.getLength();
			const editorHeight =
				editor.renderer.getContainerElement().clientHeight;
			const minimapTotalHeight = totalLines * config.lineHeight;
			const isShortDoc = minimapTotalHeight <= editorHeight;

			if (isShortDoc) {
				// 短文档：直接跳转到对应行
				const targetLine = Math.floor(clickY / config.lineHeight);
				editor.scrollToLine(targetLine, true, true, () => {});
			} else {
				// 长文档：将滑块中心移动到点击位置
				const containerHeight = containerRef.current.clientHeight;
				const sliderHeight = sliderRef.current.clientHeight;

				let targetSliderTop = clickY - sliderHeight / 2;
				const maxSliderTop = Math.max(
					0,
					containerHeight - sliderHeight
				);
				targetSliderTop = Math.max(
					0,
					Math.min(targetSliderTop, maxSliderTop)
				);

				const totalEditorHeight =
					totalLines * editor.renderer.lineHeight;
				const maxScrollTop = Math.max(
					0,
					totalEditorHeight - editorHeight
				);
				const ratio =
					maxSliderTop > 0 ? targetSliderTop / maxSliderTop : 0;

				session.setScrollTop(ratio * maxScrollTop);
			}
		},
		[editor, config]
	);

	// ============================================================================
	// 5. 生命周期管理
	// ============================================================================
	useEffect(() => {
		if (!editor || !enabled) return;

		let rAF: number;
		const tick = () => {
			renderMinimap();
			updateSlider();
		};

		// 绑定 Ace 事件
		editor.on("change", tick);
		editor.renderer.on("afterRender", tick);
		editor.session.on("changeScrollTop", updateSlider);
		window.addEventListener("resize", tick);

		// 初始渲染
		rAF = requestAnimationFrame(tick);

		return () => {
			editor.off("change", tick);
			editor.renderer.off("afterRender", tick);
			editor.session.off("changeScrollTop", updateSlider);
			window.removeEventListener("resize", tick);
			cancelAnimationFrame(rAF);
		};
	}, [editor, enabled, renderMinimap, updateSlider]);

	if (!enabled) return null;

	return (
		<div
			ref={containerRef}
			className={`ace-minimap-container ${
				mode === "hover" ? "ace-minimap-hover-mode" : ""
			}`}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => {
				if (!isDragging) setIsHovering(false);
			}}
		>
			<canvas
				ref={canvasRef}
				className="ace-minimap-canvas"
				onClick={handleCanvasClick}
			/>
			<div
				ref={sliderRef}
				className={`ace-minimap-slider ${
					mode === "always" || isHovering || isDragging
						? "visible"
						: ""
				} ${isDragging ? "dragging" : ""}`}
				onMouseDown={handleSliderMouseDown}
			/>
		</div>
	);
};
