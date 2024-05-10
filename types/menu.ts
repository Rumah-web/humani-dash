export type IMenu = {
	label: string;
	icon: React.ReactNode;
	url: string;
	permission?: boolean,
	items?: { label: string; url: string, permission?: boolean }[];
};
