import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from "react";
import "./Input.css";

interface InputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"onChange" | "prefix"
	> {
	value: string | number;
	prefix?: React.ReactNode;
	placeholder?: string;
	suggestions?: string[];
	renderCustomSuggestion?: (suggestion: string) => React.ReactNode;
	onChange: (value: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className = "",
			value,
			onChange,
			type = "text",
			prefix,
			placeholder,
			suggestions = [],
			renderCustomSuggestion,
			...props
		},
		ref
	) => {
		const inputRef = useRef<HTMLInputElement>(null);
		const containerRef = useRef<HTMLDivElement>(null);
		const isComposingRef = useRef(false);
		const [showSuggestions, setShowSuggestions] = useState(false);
		const [selectedIndex, setSelectedIndex] = useState(-1);

		// 合并外部ref和内部ref
		useImperativeHandle(ref, () => inputRef.current!);

		const filteredSuggestions = useMemo(() => {
			if (!suggestions.length) return [];
			const stringValue = String(value).toLowerCase();
			return suggestions.filter(
				(s) =>
					s.toLowerCase().includes(stringValue) &&
					s.toLowerCase() !== stringValue
			);
		}, [suggestions, value]);

		// 强制设置value的函数
		const forceSetValue = useCallback(() => {
			if (inputRef.current && value !== undefined) {
				const stringValue = String(value);
				if (inputRef.current.value !== stringValue) {
					inputRef.current.value = stringValue;
					inputRef.current.setAttribute("value", stringValue);
				}
			}
		}, [value]);

		// 在value变化时强制更新DOM
		useEffect(() => {
			if (!isComposingRef.current) {
				forceSetValue();
			}
		}, [forceSetValue]);

		useEffect(() => {
			if (showSuggestions && filteredSuggestions.length > 0) {
				if (selectedIndex >= filteredSuggestions.length) {
					setSelectedIndex(0);
				}
			} else {
				setSelectedIndex(-1);
			}
		}, [filteredSuggestions, showSuggestions]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			// 只有在非中文输入状态下才触发onChange
			if (!isComposingRef.current) {
				const { value } = e.target;
				onChange(value);
				setShowSuggestions(true);
			}
		};

		const handleCompositionStart = () => {
			isComposingRef.current = true;
		};

		const handleCompositionEnd = (
			e: React.CompositionEvent<HTMLInputElement>
		) => {
			isComposingRef.current = false;
			// 中文输入结束后触发onChange
			const target = e.target as HTMLInputElement;
			onChange(target.value);
			setShowSuggestions(true);
		};

		const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
			// focus时延迟设置value，避免光标位置问题
			setTimeout(forceSetValue, 10);
			props.onFocus?.(e);
			if (suggestions.length > 0) {
				setShowSuggestions(true);
			}
		};

		const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
			// blur时延迟设置value
			setTimeout(forceSetValue, 150);
			props.onBlur?.(e);

			// 延迟隐藏建议，以便点击建议项
			requestAnimationFrame(() => {
				if (!containerRef.current?.contains(e.relatedTarget as Node)) {
					setShowSuggestions(false);
				}
			});
		};

		const handleSuggestionClick = (suggestion: string) => {
			onChange(suggestion);
			setShowSuggestions(false);
			setSelectedIndex(-1);
			inputRef.current?.focus();
		};

		const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
			if (!suggestions.length) return;

			switch (e.key) {
				case "ArrowDown":
					if (filteredSuggestions.length > 0) {
						e.preventDefault();
						setShowSuggestions(true);
						setSelectedIndex((prev) =>
							prev < filteredSuggestions.length - 1
								? prev + 1
								: prev
						);
					}
					break;
				case "ArrowUp":
					if (filteredSuggestions.length > 0) {
						e.preventDefault();
						setShowSuggestions(true);
						setSelectedIndex((prev) =>
							prev > 0 ? prev - 1 : prev
						);
					}
					break;
				case "Enter":
					if (
						showSuggestions &&
						selectedIndex >= 0 &&
						filteredSuggestions.length > 0
					) {
						e.preventDefault();
						e.stopPropagation(); // 阻止表单提交等其他Enter事件
						handleSuggestionClick(
							filteredSuggestions[selectedIndex]
						);
					}
					break;
				case "Escape":
					if (showSuggestions) {
						e.preventDefault();
						setShowSuggestions(false);
						setSelectedIndex(-1);
					}
					break;
			}

			props.onKeyDown?.(e);
		};

		return (
			<div className="ace-input-wrapper" ref={containerRef}>
				{prefix && <div className="ace-input-prefix">{prefix}</div>}
				<input
					ref={inputRef}
					className={`ace-input ${className}`}
					defaultValue={String(value)}
					onChange={handleChange}
					onCompositionStart={handleCompositionStart}
					onCompositionEnd={handleCompositionEnd}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					type={type}
					placeholder={placeholder}
					{...props}
				/>
				{showSuggestions && filteredSuggestions.length > 0 && (
					<div
						className="ace-input-suggestions"
						onMouseDown={(e) => e.preventDefault()} // 防止失去焦点
					>
						{filteredSuggestions.map((suggestion, index) => (
							<div
								key={index}
								className={`ace-input-suggestion-item ${
									index === selectedIndex ? "selected" : ""
								}`}
								onClick={() =>
									handleSuggestionClick(suggestion)
								} // 使用 onClick 而不是 onMouseDown
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
		);
	}
);

Input.displayName = "Input";
