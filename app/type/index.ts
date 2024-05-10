export interface PropsColumn {
	name: string;
	key: string;
	selector?: (row: any) => void | any;
	format?: (row: any) => void | any;
	sortable?: boolean;
	type: string;
}

export interface Propstabs {
	label: string;
	value: string;
}

export interface PropsTable {
	columns: PropsColumn[];
	data: any;
	tabs: Propstabs[];
	totalRow: number;
}

export interface IOptionsSelect {
	value: any;
	label: any;
}

export interface IUpload {
	name: string;
	size: number;
	type: string;
	path: string;
}

export interface ISession {
	user: Partial<{
		name: string;
		email: string;
		image: string;
		uuid: string;
		roles: string[];
	}>;
	expires: Date;
}
