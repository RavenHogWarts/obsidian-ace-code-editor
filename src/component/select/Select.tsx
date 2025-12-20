import { ChevronDown, ChevronUp } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Select.css";

export interface SelectOption {
	value: unknown;
	label: string;
}

interface SelectProps {
	value: unknown;
	onChange: (value: unknown) => void;
	options: SelectOption[];
	placeholder?: string;
	className?: string;
}

export const Select: React.FC<SelectProps> = ({
	value,
	onChange,
	options,
	placeholder = "Select an option",
	className = "",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const selectRef = useRef<HTMLDivElement>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const selectedOptionRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((opt) => opt.value === value);
	const selectedIndex = options.findIndex((opt) => opt.value === value);

	// 虚拟滚动相关状态
	const [visibleStartIndex, setVisibleStartIndex] = useState(0);
	const itemHeight = 36; // 选项高度，需根据实际CSS调整
	const visibleItems = 10; // 一次渲染的可见项数量
	const bufferItems = 5; // 缓冲项数量，提高滚动体验

	// 计算虚拟列表显示内容
	const totalHeight = options.length * itemHeight;
	const visibleOptionsEndIndex = Math.min(
		visibleStartIndex + visibleItems + bufferItems,
		options.length
	);
	const visibleOptions = options.slice(
		Math.max(0, visibleStartIndex - bufferItems),
		visibleOptionsEndIndex
	);

	// 处理滚动事件
	const handleScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const scrollTop = e.currentTarget.scrollTop;
			const newStartIndex = Math.floor(scrollTop / itemHeight);
			setVisibleStartIndex(newStartIndex);
		},
		[itemHeight]
	);

	// 打开下拉框时滚动到选中项
	useEffect(() => {
		if (isOpen && dropdownRef.current && selectedIndex >= 0) {
			const scrollPosition = selectedIndex * itemHeight;
			dropdownRef.current.scrollTop = scrollPosition;
			setVisibleStartIndex(
				Math.max(0, selectedIndex - Math.floor(visibleItems / 2))
			);
		}
	}, [isOpen, selectedIndex, itemHeight, visibleItems]);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				selectRef.current &&
				!selectRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="ace-select-wrapper" ref={selectRef}>
			<div
				className={`ace-select ${
					isOpen ? "ace-select-open" : ""
				} ${className}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<span className="ace-select-value">
					{selectedOption ? selectedOption.label : placeholder}
				</span>
				<span className="ace-select-arrow">
					{isOpen ? <ChevronUp /> : <ChevronDown />}
				</span>
			</div>
			{isOpen && (
				<div
					ref={dropdownRef}
					className="ace-select-dropdown"
					onScroll={handleScroll}
				>
					<div
						className="ace-select-options-container"
						style={{
							height: `${totalHeight}px`,
							position: "relative",
						}}
					>
						{visibleOptions.map((option, index) => {
							const actualIndex =
								Math.max(0, visibleStartIndex - bufferItems) +
								index;
							const isSelected = option.value === value;

							return (
								<div
									key={String(option.value)}
									ref={
										isSelected
											? selectedOptionRef
											: undefined
									}
									className={`ace-select-option ${
										isSelected ? "selected" : ""
									}`}
									style={{
										position: "absolute",
										top: `${actualIndex * itemHeight}px`,
										width: "100%",
										height: `${itemHeight}px`,
									}}
									onClick={() => {
										onChange(option.value);
										setIsOpen(false);
									}}
								>
									{option.label}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};
