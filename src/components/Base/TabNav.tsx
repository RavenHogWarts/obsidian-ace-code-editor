import { Tabs } from "radix-ui";
import * as React from "react";

export interface TabNavItem {
	id: string;
	title: string;
	content: React.ReactNode;
	disabled?: boolean;
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
	const enabledTabs = tabs.filter((tab) => !tab.disabled);
	const defaultTab = defaultValue || enabledTabs[0]?.id;
	const scrollContainerRef = React.useRef<HTMLDivElement>(null);
	const scrollPositionRef = React.useRef<{ [key: string]: number }>({});
	const [currentTab, setCurrentTab] = React.useState(defaultTab);

	// 监听标签切换，保存当前滚动位置
	const handleTabChange = React.useCallback(
		(value: string) => {
			// 保存当前标签的滚动位置
			if (scrollContainerRef.current && currentTab) {
				scrollPositionRef.current[currentTab] =
					scrollContainerRef.current.scrollTop;
			}

			setCurrentTab(value);
			onChange?.(value);

			// 延迟恢复新标签的滚动位置
			setTimeout(() => {
				if (
					scrollContainerRef.current &&
					scrollPositionRef.current[value]
				) {
					scrollContainerRef.current.scrollTop =
						scrollPositionRef.current[value];
				}
			}, 0);
		},
		[onChange, currentTab]
	);

	// 在组件更新后保持滚动位置
	React.useLayoutEffect(() => {
		if (
			scrollContainerRef.current &&
			currentTab &&
			scrollPositionRef.current[currentTab]
		) {
			scrollContainerRef.current.scrollTop =
				scrollPositionRef.current[currentTab];
		}
	});

	// 监听滚动事件，实时保存滚动位置
	const handleScroll = React.useCallback(() => {
		if (scrollContainerRef.current && currentTab) {
			scrollPositionRef.current[currentTab] =
				scrollContainerRef.current.scrollTop;
		}
	}, [currentTab]);

	return (
		<Tabs.Root
			className={`ace--TabGroup ${className}`}
			defaultValue={defaultTab}
			value={currentTab}
			data-orientation={orientation}
			onValueChange={handleTabChange}
		>
			<Tabs.List className="ace--TabList" data-orientation={orientation}>
				{orientation === "vertical" && (
					<div className="ace--TabResizeBar"></div>
				)}
				{enabledTabs.map((tab) => (
					<Tabs.Trigger
						className="ace--Tab"
						key={tab.id}
						value={tab.id}
					>
						<span className="ace--TabTitle">{tab.title}</span>
					</Tabs.Trigger>
				))}
			</Tabs.List>

			<div
				className="ace--TabPanels"
				ref={scrollContainerRef}
				onScroll={handleScroll}
			>
				{enabledTabs.map((tab) => (
					<Tabs.Content
						className="ace--TabPanel"
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
