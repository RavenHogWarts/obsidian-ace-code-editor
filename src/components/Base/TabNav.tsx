import { Tabs } from "radix-ui";
import * as React from "react";

export interface TabNavItem {
	id: string;
	title: string;
	content: React.ReactNode;
}

interface TabNavProps {
	tabs: TabNavItem[];
	defaultValue?: string;
	orientation?: "horizontal" | "vertical";
	onChange?: (value: string) => void;
	className?: string;
}

export const TabNav: React.FC<TabNavProps> = ({
	tabs,
	defaultValue,
	orientation = "horizontal",
	onChange,
	className,
}) => {
	const defaultTab = defaultValue || tabs[0]?.id;

	return (
		<Tabs.Root
			className={`ace-TabGroup ${className}`}
			defaultValue={defaultTab}
			data-orientation={orientation}
			onValueChange={onChange}
		>
			<Tabs.List className="ace-TabList" data-orientation={orientation}>
				{orientation === "vertical" && (
					<div className="ace-TabResizeBar"></div>
				)}
				{tabs.map((tab) => (
					<Tabs.Trigger
						className="ace-Tab"
						key={tab.id}
						value={tab.id}
					>
						<span className="ace-TabTitle">{tab.title}</span>
					</Tabs.Trigger>
				))}
			</Tabs.List>

			<div className="ace-TabPanels">
				{tabs.map((tab) => (
					<Tabs.Content
						className="ace-TabPanel"
						key={tab.id}
						value={tab.id}
					>
						{tab.content}
					</Tabs.Content>
				))}
			</div>
		</Tabs.Root>
	);
};
