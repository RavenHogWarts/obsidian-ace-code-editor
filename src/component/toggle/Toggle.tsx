import { useCallback } from "react";
import "./Toggle.css";

interface ToggleProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	className?: string;
	"aria-label"?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
	checked,
	onChange,
	className = "",
	"aria-label": ariaLabel,
}) => {
	const handleChange = useCallback(() => {
		onChange(!checked);
	}, [checked, onChange]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				onChange(!checked);
			}
		},
		[checked, onChange]
	);
	return (
		<div
			className={`ace-toggle ${checked ? "is-enabled" : ""} ${className}`}
			onClick={handleChange}
			role="switch"
			aria-checked={checked}
			aria-label={ariaLabel}
			onKeyDown={handleKeyDown}
			tabIndex={0}
		>
			<div className="ace-toggle-slider" />
		</div>
	);
};
