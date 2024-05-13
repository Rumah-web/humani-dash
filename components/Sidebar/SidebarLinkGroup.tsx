import { ReactNode, useState } from "react";

interface SidebarLinkGroupProps {
	children: (handleClick: () => void, open: boolean) => ReactNode;
	activeCondition: boolean;
	index?: number | string;
}

const SidebarLinkGroup = ({
	children,
	activeCondition,
	index,
}: SidebarLinkGroupProps) => {
	const [open, setOpen] = useState<boolean>(activeCondition);

	const handleClick = () => {
		setOpen(!open);
	};

	return <li key={typeof index !== 'undefined' ? index : 0}>{children(handleClick, open)}</li>;
};

export default SidebarLinkGroup;
