import { X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import "./TagInput.css";

interface TagInputProps {
	values: string[];
	onChange: (values: string[]) => void;
	suggestions?: string[];
	placeholder?: string;
	renderCustomSuggestion?: (suggestion: string) => React.ReactNode;
}

export const TagInput: React.FC<TagInputProps> = ({
	values,
	onChange,
	suggestions = [] as string[],
	placeholder,
	renderCustomSuggestion,
}) => {
	const [inputValue, setInputValue] = useState("");
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(-1);
	const containerRef = useRef<HTMLDivElement>(null);
	const [draggedTag, setDraggedTag] = useState<number | null>(null);
	const [dragOverTag, setDragOverTag] = useState<number | null>(null);

	const filteredSuggestions = useMemo(() => {
		return suggestions.filter(
			(suggestion) =>
				suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
				!values.includes(suggestion)
		);
	}, [suggestions, inputValue, values]);

	const addValue = (value: string) => {
		if (value && !values.includes(value)) {
			onChange([...values, value.trim()]);
			setInputValue("");
			setShowSuggestions(false);
			setSelectedIndex(-1);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		switch (e.key) {
			case "ArrowDown":
				e.preventDefault();
				if (filteredSuggestions.length > 0) {
					setShowSuggestions(true);
					setSelectedIndex((prev) =>
						prev < filteredSuggestions.length - 1 ? prev + 1 : prev
					);
				}
				break;
			case "ArrowUp":
				e.preventDefault();
				if (filteredSuggestions.length > 0) {
					setShowSuggestions(true);
					setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
				}
				break;
			case "Enter":
				e.preventDefault();
				if (selectedIndex >= 0 && filteredSuggestions.length > 0) {
					addValue(filteredSuggestions[selectedIndex]);
				} else if (inputValue.trim()) {
					addValue(inputValue);
				}
				break;
			case "Escape":
				setShowSuggestions(false);
				setSelectedIndex(-1);
				break;
			case ",":
			case ";":
				e.preventDefault();
				if (inputValue.trim()) {
					addValue(inputValue);
				}
				break;
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);

		if (newValue.includes(",") || newValue.includes(";")) {
			const tags = newValue
				.split(/[,;]/)
				.map((tag) => tag.trim())
				.filter(Boolean);
			tags.forEach((tag) => addValue(tag));
			return;
		}

		if (suggestions.length > 0) {
			const hasSuggestions = suggestions.some(
				(s) =>
					s.toLowerCase().includes(newValue.toLowerCase()) &&
					!values.includes(s)
			);
			setShowSuggestions(hasSuggestions);
			if (hasSuggestions) {
				setSelectedIndex(-1);
			}
		}
	};

	const handleFocusCapture = (e: React.FocusEvent) => {
		if (containerRef.current?.contains(e.target)) {
			if (suggestions.filter((s) => !values.includes(s)).length > 0) {
				setShowSuggestions(true);
			}
		}
	};

	const handleSuggestionClick = (suggestion: string) => {
		addValue(suggestion);
		setInputValue("");
		setSelectedIndex(-1);
		setShowSuggestions(false);
	};

	const handleBlurCapture = (e: React.FocusEvent) => {
		requestAnimationFrame(() => {
			if (!containerRef.current?.contains(e.relatedTarget)) {
				setShowSuggestions(false);
				setSelectedIndex(-1);
			}
		});
	};

	const handleDragStart = (index: number) => {
		setDraggedTag(index);
	};

	const handleDragOver = (e: React.DragEvent, index: number) => {
		e.preventDefault();
		setDragOverTag(index);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		if (
			draggedTag !== null &&
			dragOverTag !== null &&
			draggedTag !== dragOverTag
		) {
			const newValues = [...values];
			const draggedItem = newValues[draggedTag];

			// 移除拖拽的项
			newValues.splice(draggedTag, 1);

			// 在新位置插入
			newValues.splice(dragOverTag, 0, draggedItem);

			// 更新状态
			onChange(newValues);
		}

		// 重置拖拽状态
		setDraggedTag(null);
		setDragOverTag(null);
	};

	const handleDragEnd = () => {
		setDraggedTag(null);
		setDragOverTag(null);
	};

	return (
		<div
			className="ace-tag-input"
			ref={containerRef}
			onFocusCapture={handleFocusCapture}
			onBlurCapture={handleBlurCapture}
		>
			<div className="ace-tag-input-container">
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className="ace-tag-input-field"
				/>
				{showSuggestions && filteredSuggestions.length > 0 && (
					<div
						className="ace-tag-suggestions"
						onMouseDown={(e) => {
							e.preventDefault();
						}}
					>
						{filteredSuggestions.map((suggestion, index) => (
							<div
								key={index}
								className={`ace-tag-suggestion-item ${
									index === selectedIndex ? "selected" : ""
								}`}
								onMouseDown={(e) => {
									e.preventDefault();
									handleSuggestionClick(suggestion);
								}}
								onMouseEnter={() => setSelectedIndex(index)}
							>
								{renderCustomSuggestion
									? renderCustomSuggestion(suggestion)
									: suggestion}
							</div>
						))}
					</div>
				)}
			</div>
			<div className="ace-tags-container">
				{values.map((value, index) => (
					<div
						key={index}
						className={`ace-tag-item ${
							draggedTag === index ? "dragging" : ""
						} ${dragOverTag === index ? "drag-over" : ""}`}
						title={value}
						draggable
						onDragStart={() => handleDragStart(index)}
						onDragOver={(e) => handleDragOver(e, index)}
						onDrop={handleDrop}
						onDragEnd={handleDragEnd}
					>
						<span
							className="ace-tag-drag-handle"
							title="Drag to reorder"
						>
							≡
						</span>
						<span className="ace-tag-text">{value}</span>
						<span
							className="ace-tag-remove"
							onClick={() =>
								onChange(values.filter((v) => v !== value))
							}
							title="Remove tag"
						>
							<X size={14} />
						</span>
					</div>
				))}
			</div>
		</div>
	);
};
