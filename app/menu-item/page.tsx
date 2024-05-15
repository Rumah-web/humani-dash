"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Sort from "@/components/Table/Sort";
import Loading from "@/components/Table/Loading";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NoImage from "@/components/Placeholder/NoImage";
import { PageContext } from "../context";
import { ISession } from "../type";
import Page403 from "@/components/Auth/403";
import { useForm } from "react-hook-form";
import { IconLoading } from "@/components/Icons";

interface ITabCount {
	status: string;
	_count: {
		status: number;
	};
}

const Menu = () => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("all");
	const [datas, setDatas] = useState([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setLoading] = useState(true);
	const [isLoadingSearch, setLoadingSearch] = useState(false);
	const [page, setPage] = useState(0);
	const [take, setTake] = useState(10);
	const [tabs, setTabs] = useState(
		[] as { label: string; value: string; count: number }[]
	);
	const [condition, setCondition] = useState({} as any);
	const [filter, setFilter] = useState({} as any);
	const [order, setOrder] = useState({ id: "desc" } as any);

	const paramsPage = React.useContext(PageContext) as any;

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	let session: ISession | null = null;

	if (paramsPage.session) {
		session = paramsPage.session;
	}

	let tabsDefault = [
		{ label: "All", value: "all", count: 0 },
		{ label: "Draft", value: "draft", count: 0 },
		{ label: "Published", value: "published", count: 0 },
	];

	const searchColumns = ["name"];

	const columns = [
		{
			name: "UUID",
			selector: (row: any) => row.uuid,
			key: "uuid",
			type: "text",
			sortable: true,
			omit: true,
		},
		{
			name: "Name",
			selector: (row: any) => row.name,
			key: "name",
			type: "text",
			sortable: true,
			sortField: "name",
		},
		{
			name: "Description",
			selector: (row: any) => row.description,
			key: "description",
			type: "text",
			sortable: true,
			sortField: "description",
			format: (row: any) => (
				<div dangerouslySetInnerHTML={{ __html: row.description }} />
			),
		},
		{
			name: "Status",
			selector: (row: any) => row.status,
			key: "status",
			type: "text",
			format: (row: any) => (
				<div
					className={`text-xs text-white px-2 py-0.5 rounded-lg capitalize ${
						row.status === "draft" ? "bg-danger" : "bg-success"
					}`}>
					{row.status}
				</div>
			),
			sortable: true,
			sortField: "status",
		},
	];

	const customStyles = {
		head: {
			style: {
				fontSize: "15px",
				fontWeight: "bold",
			},
		},
		rows: {
			style: {
				fontSize: "15px",
				cursor: "pointer",
			},
		},
		headCells: {
			style: {
				paddingLeft: "8px", // override the cell padding for head cells
				paddingRight: "8px",
			},
		},
		cells: {
			style: {
				paddingLeft: "8px", // override the cell padding for data cells
				paddingRight: "8px",
			},
		},
	};

	const runTabTotal = async (filter: any) => {
		const req = await fetch("/menu-item/api/total-per-status", {
			method: "POST",
			body: JSON.stringify(filter),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { data } = await req.json();
			return data;
		}
	};

	const runTotal = async (where: {}) => {
		const req = await fetch("/menu-item/api/total", {
			method: "POST",
			body: JSON.stringify({
				where,
			}),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { total } = await req.json();
			return total;
		}
	};

	const runQuery = async (
		where: {},
		take: number,
		skip: number,
		orderBy: {}
	) => {
		const req = await fetch("/menu-item/api/list", {
			method: "POST",
			body: JSON.stringify({
				where,
				take,
				skip: skip * take,
				orderBy,
			}),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { data } = await req.json();
			return data;
		}
	};

	useEffect(() => {
		setTabs(tabsDefault);
		(async () => {
			const data = await runQuery(condition, take, page, order);
			const total = await runTotal(condition);
			const tabTotal = await runTabTotal(filter);

			setDatas(data);
			setLoading(false);
			setTotal(total);

			tabsDefault = tabsDefault.map((tab, i) => {
				const find: ITabCount = tabTotal.find(
					(res: ITabCount, i: number) => res.status === tab.value
				);

				if (find) {
					return { ...tab, count: find._count.status };
				}

				if (tab.value === "all") {
					return { ...tab, count: total };
				}

				return tab;
			});

			setTabs(tabsDefault);
		})();
	}, []);

	useEffect(() => {
		console.log(condition);
	}, [condition]);

	const onClickTab = async (value: string) => {
		setLoading(true);
		setActiveTab(value);

		let where = {};
		if (["draft", "published"].includes(value)) {
			where = {
				...condition,
				...{
					status: value,
				},
			};

			setCondition(where);
		} else {
			const findCondition = Object.entries(condition).filter(
				(item, i) => item[0] !== "status"
			);
			where = Object.fromEntries(findCondition);

			setCondition(where);
		}

		const data = await runQuery(where, take, page, order);

		const total = await runTotal(where);

		setDatas(data);
		setTotal(total);
		setLoading(false);
	};

	const handlePageChange = async (page: number) => {
		if (datas.length > 0) {
			const _page = page - 1;
			setLoading(true);
			const data = await runQuery(condition, take, _page, order);
			setPage(_page);
			setDatas(data);
			setLoading(false);
		}
	};

	const handlePerRowsChange = async (newPerPage: number, page: number) => {
		if (datas.length > 0) {
			const _page = page - 1;
			setLoading(true);
			const data = await runQuery(condition, newPerPage, _page, order);
			setTake(newPerPage);
			setDatas(data);
			setLoading(false);
		}
	};

	const handleSort = async (column: any, sortDirection: string) => {
		if (typeof column.sortField !== "undefined") {
			const order = { [column.sortField]: sortDirection };

			setLoading(true);
			setOrder(order);

			const data = await runQuery(condition, take, page, order);

			setDatas(data);
			setLoading(false);

			console.log(Object.values(order)[0]);
		}
	};

	const onAdd = async () => {
		const req = await fetch("/menu-item/api/add", {
			method: "POST",
			body: JSON.stringify({}),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { data } = await req.json();
			router.push(`/menu-item/form/${data.uuid}`);
		}
	};

	const onRowClicked = (row: any, event: any) => {
		router.push(`/menu-item/form/${row.uuid}`);
	};

	const onSearch = async (data: any) => {
		setLoadingSearch(true);
		setLoading(true);

		let where = {};

		let filterSearch = {} as any;

		for (let search of Object.entries(data)) {
			const key = search[0];
			const value = search[1];

			if (value && value !== "") {
				where = {
					...condition,
					...where,
					...{
						[key]: {
							contains: value,
							mode: "insensitive",
						},
					},
				};

				filterSearch = {
					...condition,
					...filterSearch,
					...{
						[key]: {
							contains: value,
							mode: "insensitive",
						},
					},
				};
			} else {
				const findCondition = Object.entries(condition).filter(
					(item, i) => item[0] !== key
				);

				where = Object.fromEntries(findCondition);
				filterSearch = Object.fromEntries(findCondition);
			}
		}

		const query = await runQuery(where, take, page, order);
		const total = await runTotal(where);
		const tabTotal = await runTabTotal({ filter: filterSearch });

		setFilter({ ...filter, where });
		setCondition(where);
		setDatas(query);

		setTotal(total);

		tabsDefault = tabsDefault.map((tab, i) => {
			const find: ITabCount = tabTotal.find(
				(res: ITabCount, i: number) => res.status === tab.value
			);

			if (find) {
				return { ...tab, count: find._count.status };
			}

			if (tab.value === "all") {
				return { ...tab, count: total };
			}

			return tab;
		});

		setTabs(tabsDefault);

		setLoadingSearch(false);
		setLoading(false);
	};

	if (!session?.user.roles?.includes("admin")) {
		return (
			<>
				<Page403 />
			</>
		);
	}

	return (
		<>
			<Breadcrumb pageName='Menu Item' />
			<div className='pb-36'>
				<>
					<div id='header'>
						<div className='flex justify-between space-x-8'>
							<form
								onSubmit={handleSubmit((data) => onSearch(data))}
								className='flex flex-col space-y-4 w-full relative pb-4'>
								<div className='flex w-full space-x-4 relative flex-wrap'>
									<div className='flex w-1/2'>
										<input
											{...register("name")}
											className='w-full rounded-lg border-[1.5px] border-stroke bg-white h-fit py-2 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
										/>
									</div>
								</div>
								{/* <div>
									<button
										disabled={isLoadingSearch}
										className={`px-8 py-2.5 bg-success rounded-lg text-white text-xs cursor-pointer hover:opacity-70 ${
											isLoadingSearch ? "opacity-70" : ""
										}`}
										onClick={() => null}>
										{isLoadingSearch ? <IconLoading /> : "Search"}
									</button>
								</div> */}
							</form>
							<div className='w-fit flex justify-end'>
								<div
									className='px-8 py-2 bg-danger h-fit rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
									onClick={onAdd}>
									Add
								</div>
							</div>
						</div>
					</div>
					<div className='flex'>
						{tabs.map(({ value, label, count }, i) => {
							return (
								<div
									key={i}
									className={`pr-4 cursor-pointer text-center border-danger  ${
										activeTab === value
											? `border-b-2 text-danger font-bold`
											: ``
									}`}>
									<div
										className='flex items-center space-x-2 py-1 transition-all hover:opacity-60'
										onClick={() => onClickTab(value)}>
										<div
											className={`text-base ${
												activeTab === value ? `font-bold` : ``
											}`}>
											{label}
										</div>
										<div
											className={`h-6 bg-white p-2 rounded-full text-[0.5rem] flex items-center ${
												activeTab === value ? `text-danger` : ``
											}`}>
											{count}
										</div>
									</div>
								</div>
							);
						})}
					</div>
					{Object.entries(columns).length > 0 && (
						<>
							<DataTable
								columns={columns}
								data={datas}
								keyField={"id"}
								noHeader={true}
								fixedHeader={true}
								customStyles={customStyles}
								persistTableHead={true}
								striped={true}
								pagination
								paginationTotalRows={total}
								progressPending={isLoading}
								paginationServer
								onChangeRowsPerPage={(newPerPage, page) =>
									handlePerRowsChange(newPerPage, page)
								}
								onChangePage={(page) => handlePageChange(page)}
								sortServer
								onSort={(column, sortDirection) =>
									handleSort(column, sortDirection)
								}
								onRowClicked={onRowClicked}
								sortIcon={
									<>
										{Object.values(order).includes("desc") ? (
											<div className='rotate-180'>
												<Sort />
											</div>
										) : (
											<div className='rotate-180'>
												<Sort />
											</div>
										)}
									</>
								}
								progressComponent={
									<div className='pt-5'>
										<Loading />
									</div>
								}
							/>
						</>
					)}
				</>
			</div>
		</>
	);
};

export default Menu;
