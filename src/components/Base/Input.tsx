import * as React from "react";

interface InputProps
	extends Omit<
		React.InputHTMLAttributes<HTMLInputElement>,
		"onChange" | "prefix"
	> {
	value: string | number;
	prefix?: React.ReactNode;
	placeholder?: string;
	onChange: (value: string) => void;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	(
		{
			className = "",
			value,
			onChange,
			type = "text",
			prefix,
			placeholder,
			...props
		},
		ref
	) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const newValue = e.target.value;
			onChange(newValue);
		};

		return (
			<div className="ace-input-wrapper">
				{prefix && <div className="ace-input-prefix">{prefix}</div>}
				<input
					ref={ref}
					className={`ace-input ${className}`}
					value={value}
					onChange={handleChange}
					type={type}
					placeholder={placeholder}
					{...props}
				/>
			</div>
		);
	}
);

Input.displayName = "Input";
