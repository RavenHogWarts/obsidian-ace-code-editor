import { useCallback, useState } from "react";

interface UseResizeProps {
	resizeRef: React.RefObject<HTMLElement | null>;
	minWidth: number;
	maxWidth?: number;
	onResize?: (width: number) => void;
	onResizeEnd?: () => void;
}

export const useResize = ({
	resizeRef,
	minWidth,
	maxWidth,
	onResize,
	onResizeEnd,
}: UseResizeProps) => {
	const [isResizing, setIsResizing] = useState(false);

	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setIsResizing(true);

			const startX = e.clientX;
			const startWidth =
				resizeRef.current?.getBoundingClientRect().width || 0;

			const handleMouseMove = (moveEvent: MouseEvent) => {
				if (!resizeRef.current) return;

				const deltaX = moveEvent.clientX - startX;
				let newWidth = startWidth + deltaX;

				if (newWidth < minWidth) newWidth = minWidth;
				if (maxWidth && newWidth > maxWidth) newWidth = maxWidth;

				resizeRef.current.style.width = `${newWidth}px`;
				onResize?.(newWidth);
			};

			const handleMouseUp = () => {
				setIsResizing(false);
				onResizeEnd?.();
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
				document.body.style.cursor = "";
				document.body.style.userSelect = "";
			};

			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			document.body.style.cursor = "col-resize";
			document.body.style.userSelect = "none";
		},
		[minWidth, maxWidth, resizeRef, onResize, onResizeEnd]
	);

	return {
		isResizing,
		handleMouseDown,
	};
};
