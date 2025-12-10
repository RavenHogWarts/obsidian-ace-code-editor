import * as ace from "ace-builds";
import * as React from "react";

export interface MinimapProps {
	editor: ace.Ace.Editor | null;
	enabled: boolean;
}

export const Minimap: React.FC<MinimapProps> = ({ editor, enabled }) => {
	const canvasRef = React.useRef<HTMLCanvasElement>(null);
	const sliderRef = React.useRef<HTMLDivElement>(null);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = React.useState(false);

	// 渲染 minimap 内容
	const renderMinimap = React.useCallback(() => {
		if (!editor || !canvasRef.current || !enabled) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const session = editor.getSession();
		const totalLines = session.getLength();
		const editorHeight = editor.container.clientHeight;

		// 设置 canvas 尺寸
		const dpr = window.devicePixelRatio || 1;
		const canvasWidth = canvas.offsetWidth * dpr;
		const canvasHeight = canvas.offsetHeight * dpr;

		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// 缩放 canvas 以适应高分辨率屏幕
		ctx.scale(dpr, dpr);

		// 获取编辑器主题颜色
		const computedStyle = window.getComputedStyle(editor.container);
		const backgroundColor =
			computedStyle.backgroundColor || "rgb(255, 255, 255)";
		const textColor = computedStyle.color || "rgb(0, 0, 0)";

		// 绘制背景
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

		// 设置文字颜色（降低透明度）
		const rgbMatch = textColor.match(/\d+/g);
		if (rgbMatch && rgbMatch.length >= 3) {
			ctx.fillStyle = `rgba(${rgbMatch[0]}, ${rgbMatch[1]}, ${rgbMatch[2]}, 0.4)`;
		} else {
			ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
		}

		const lineHeight = 2; // minimap 中每行的高度（像素）
		const charWidth = 1.2; // minimap 中每个字符的宽度（像素）

		// 计算可见区域
		const maxVisibleLines = Math.floor(canvas.offsetHeight / lineHeight);
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
	}, [editor, enabled]);

	// 更新滑块位置
	const updateSlider = React.useCallback(() => {
		if (!editor || !sliderRef.current || !canvasRef.current || !enabled)
			return;

		const session = editor.getSession();
		const renderer = editor.renderer;
		const scrollTop = session.getScrollTop();
		const totalLines = session.getLength();
		const lineHeight = renderer.lineHeight;
		const editorHeight = editor.container.clientHeight;
		const canvasHeight = canvasRef.current.offsetHeight;

		// 边界检查：防止除零和无效值
		if (
			totalLines === 0 ||
			lineHeight === 0 ||
			editorHeight === 0 ||
			canvasHeight === 0
		) {
			sliderRef.current.style.setProperty("--minimap-slider-top", `0px`);
			sliderRef.current.style.setProperty(
				"--minimap-slider-height",
				`0px`
			);
			return;
		}

		// 计算滑块位置和高度
		const visibleLines = Math.floor(editorHeight / lineHeight);
		const totalHeight = totalLines * lineHeight;
		const scrollRatio = totalHeight > 0 ? scrollTop / totalHeight : 0;
		const sliderHeight =
			totalLines > 0 ? (visibleLines / totalLines) * canvasHeight : 0;
		const sliderTop = scrollRatio * canvasHeight;

		// 使用 CSS 变量更新滑块位置和高度
		sliderRef.current.style.setProperty(
			"--minimap-slider-top",
			`${Math.max(0, sliderTop)}px`
		);
		sliderRef.current.style.setProperty(
			"--minimap-slider-height",
			`${Math.max(0, Math.min(sliderHeight, canvasHeight))}px`
		);
	}, [editor, enabled]);

	// 处理点击事件
	const handleCanvasClick = React.useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			if (!editor || !canvasRef.current) return;

			const rect = canvasRef.current.getBoundingClientRect();
			const y = e.clientY - rect.top;
			const totalHeight = canvasRef.current.offsetHeight;
			const session = editor.getSession();
			const totalLines = session.getLength();

			// 计算点击位置对应的行号
			const targetLine = Math.floor((y / totalHeight) * totalLines);

			// 滚动到目标行
			editor.scrollToLine(targetLine, true, true, () => {});
		},
		[editor]
	);

	// 处理拖动开始
	const handleMouseDown = React.useCallback(
		(e: React.MouseEvent<HTMLCanvasElement>) => {
			e.preventDefault();
			setIsDragging(true);
		},
		[]
	);

	// 处理滑块拖动
	const handleSliderMouseDown = React.useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!editor || !canvasRef.current) return;

			e.preventDefault();
			e.stopPropagation();
			setIsDragging(true);

			const startY = e.clientY;
			const startScrollTop = editor.getSession().getScrollTop();

			const handleMouseMove = (moveEvent: MouseEvent) => {
				if (!editor || !canvasRef.current) return;

				const deltaY = moveEvent.clientY - startY;
				const totalHeight = canvasRef.current.offsetHeight;
				const session = editor.getSession();
				const totalLines = session.getLength();
				const lineHeight = editor.renderer.lineHeight;

				// 计算滚动比例
				const scrollRatio = deltaY / totalHeight;
				const scrollDelta = scrollRatio * totalLines * lineHeight;

				session.setScrollTop(startScrollTop + scrollDelta);
			};

			const handleMouseUp = () => {
				setIsDragging(false);
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		},
		[editor]
	);

	// 监听编辑器事件
	React.useEffect(() => {
		if (!editor || !enabled) return;

		const handleChange = () => renderMinimap();
		const handleScroll = () => updateSlider();
		const handleRender = () => {
			renderMinimap();
			updateSlider(); // 在渲染后更新滑块
		};
		const handleResize = () => {
			renderMinimap();
			updateSlider();
		};

		// 绑定事件
		editor.on("change", handleChange);
		editor.getSession().on("changeScrollTop", handleScroll);
		editor.renderer.on("afterRender", handleRender);
		window.addEventListener("resize", handleResize);

		// 初始渲染 - 使用 requestAnimationFrame 确保 DOM 已经更新
		requestAnimationFrame(() => {
			renderMinimap();
			updateSlider();
		});

		// 清理
		return () => {
			editor.off("change", handleChange);
			editor.getSession().off("changeScrollTop", handleScroll);
			editor.renderer.off("afterRender", handleRender);
			window.removeEventListener("resize", handleResize);
		};
	}, [editor, enabled, renderMinimap, updateSlider]);

	// 处理拖动时的鼠标移动
	React.useEffect(() => {
		if (!isDragging || !editor || !canvasRef.current) return;

		const handleMouseMove = (moveEvent: MouseEvent) => {
			if (!editor || !canvasRef.current) return;

			const rect = canvasRef.current.getBoundingClientRect();
			const y = moveEvent.clientY - rect.top;
			const totalHeight = canvasRef.current.offsetHeight;
			const session = editor.getSession();
			const totalLines = session.getLength();

			const targetLine = Math.floor((y / totalHeight) * totalLines);
			editor.scrollToLine(targetLine, true, true, () => {});
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, editor]);

	if (!enabled) {
		return null;
	}

	return (
		<div ref={containerRef} className="ace-minimap-container">
			<canvas
				ref={canvasRef}
				className="ace-minimap-canvas"
				onClick={handleCanvasClick}
				onMouseDown={handleMouseDown}
			/>
			<div
				ref={sliderRef}
				className="ace-minimap-slider"
				onMouseDown={handleSliderMouseDown}
			/>
		</div>
	);
};
