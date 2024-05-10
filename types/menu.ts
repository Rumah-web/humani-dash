export type IMenu = {
	label: string;
	icon: React.ReactNode;
	url: string;
	items?: { label: string; url: string }[];
};
