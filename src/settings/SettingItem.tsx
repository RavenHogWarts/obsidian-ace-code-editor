import { ChevronDown, ChevronRight } from "lucide-react";
import * as React from "react";

interface SettingsItemProps {
	name: string;
	desc?: string | React.ReactNode;
	icon?: React.ReactNode;
	children?: React.ReactNode;
	collapsible?: boolean;
	defaultCollapsed?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
	name,
	desc,
	icon,
	children,
	collapsible,
	defaultCollapsed,
}) => {
	const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

	return (
		<div
			className={`ace-settings-item ${
				collapsible ? "is-collapsible" : ""
			}`}
		>
			<div className="ace-settings-item-info">
				<div
					className="ace-settings-item-heading"
					onClick={
						collapsible
							? () => setIsCollapsed(!isCollapsed)
							: undefined
					}
				>
					{icon && (
						<span className="ace-settings-item-icon">{icon}</span>
					)}
					<div className="ace-settings-item-name">{name}</div>
					{collapsible && (
						<span className="ace-settings-item-collapse-icon">
							{isCollapsed ? (
								<ChevronRight size={16} />
							) : (
								<ChevronDown size={16} />
							)}
						</span>
					)}
				</div>
				{desc && (
					<div className="ace-settings-item-description">{desc}</div>
				)}
			</div>
			{children && !isCollapsed && (
				<div className="ace-settings-item-control">{children}</div>
			)}
		</div>
	);
};
