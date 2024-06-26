"use client";

import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Sort from "@/components/Table/Sort";
import Loading from "@/components/Table/Loading";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NoImage from "@/components/Placeholder/NoImage";
import { formatShorttDate } from "../lib/helper";
import { PageContext } from "../context";
import { IOptionsSelect, ISession } from "../type";
import Page403 from "@/components/Auth/403";
import { useForm } from "react-hook-form";
import { cx, css } from "@emotion/css";
import Select from "react-select";

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
	const [page, setPage] = useState(0);
	const [take, setTake] = useState(10);
	const [tabs, setTabs] = useState(
		[] as { label: string; value: string; count: number }[]
	);
	const [condition, setCondition] = useState({} as any);
	const [filter, setFilter] = useState({} as any);
	const [order, setOrder] = useState({ id: "desc" } as any);
	const [options, setOptions] = useState([] as IOptionsSelect[]);
	const paramsPage = React.useContext(PageContext) as any;

	const {
		register,
		handleSubmit,
		getValues,
		setValue,
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

	const columns = [
		{
			name: "Foto",
			selector: (row: any) =>
				row.m_menu_files[0] && row.m_menu_files[0].m_files
					? row.m_menu_files[0].m_files.path
					: null,
			key: "path",
			type: "text",
			format: (row: any) => {
				if (row.m_menu_files[0] && row.m_menu_files[0].m_files) {
					return (
						<div className='p-2'>
							<Image
								src={`${row.m_menu_files[0].m_files.path}?width=200`}
								width={100}
								height={100}
								alt={row.name}
								priority={true}
								unoptimized
								className='w-24'
							/>
						</div>
					);
				}

				return (
					<div className='py-1'>
						<div className='bg-gray flex justify-center items-center w-28'>
							<NoImage
								w={50}
								h={50}
							/>
						</div>
					</div>
				);
			},
		},
		{
			name: "UUID",
			selector: (row: any) => row.uuid,
			key: "uuid",
			type: "text",
			sortable: true,
			omit: true,
		},
		{
			name: "Category",
			selector: (row: any) =>
				row.m_menu_category ? row.m_menu_category.name : null,
			key: "m_menu_category",
			type: "text",
			sortable: true,
			sortField: "name",
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
			name: "Price",
			selector: (row: any) => row.price,
			key: "price",
			type: "number",
			format: (row: any) =>
				`Rp. ${row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
			sortable: true,
			sortField: "price",
		},
		{
			name: "Price Promo",
			selector: (row: any) => row.price_promo,
			key: "price_promo",
			type: "number",
			format: (row: any) =>
				`Rp. ${row.price_promo
					.toString()
					.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
			sortable: true,
			sortField: "price_promo",
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

	const renderRowsComponent = ({ data }: any) => {
		console.log("render : ", data);
		return (
			<div className='border-b border-[#e0e0e0] bg-[#fafafa]'>
				<div className='flex flex-col py-4 px-16 space-y-4'>
					<div className='flex'>
						<div className='w-1/6'>Minimal Order</div>
						<div>{data.min_qty}</div>
					</div>
					<div className='flex'>
						<div className='w-1/6'>Maximal Order</div>
						<div>{data.max_qty}</div>
					</div>
					<div className='flex'>
						<div className='w-1/6'>Price Promo</div>
						<div>{`Rp. ${data.price_promo
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</div>
					</div>
					<div className='flex'>
						<div className='w-1/6'>Description</div>
						<div dangerouslySetInnerHTML={{ __html: data.description }} />
					</div>
				</div>
			</div>
		);
	};

	const runTabTotal = async (filter: any) => {
		const req = await fetch("/menu/api/total-per-status", {
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
		const req = await fetch("/menu/api/total", {
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
		const req = await fetch("/menu/api/list", {
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

			const parentCategory = await fetch("/menu/api/menu-category", {
				method: "POST",
				body: JSON.stringify({}),
				headers: {
					"content-type": "application/json",
				},
			});

			if (parentCategory) {
				const dataParentCategory = await parentCategory.json();

				setOptions(dataParentCategory.data);
			}
		})();
	}, []);

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
		const req = await fetch("/menu/api/add", {
			method: "POST",
			body: JSON.stringify({}),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { data } = await req.json();
			router.push(`/menu/form/${data.uuid}`);
		}
	};

	const onRowClicked = (row: any, event: any) => {
		router.push(`/menu/form/${row.uuid}`);
	};

	const onSearch = async (data: any) => {
		
		setLoading(true);

		let where = condition;

		let filterSearch = {} as any;

		for (let search of Object.entries(data)) {
			const key = search[0];
			const value = search[1];

			if (value && value !== "") {
				where = {
					...where,
					...{
						[key]:
							typeof value === "number"
								? value
								: {
										contains: value,
										mode: "insensitive",
								  },
					},
				};

				filterSearch = {
					...filterSearch,
					...{
						[key]:
							typeof value === "number"
								? value
								: {
										contains: value,
										mode: "insensitive",
								  },
					},
				};
			} else {
				const findCondition = Object.entries(where).filter(
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
		setLoading(false);
	};

	const handleKeyDown = async (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (event.key === "Enter") {
			const data = getValues();

			await onSearch(data);
		}
	};

	const handleChangeSelect = async (column: string, e: any) => {
		if(e) {
			setValue(column, e.value);
		} else {
			setValue(column, null);
		}
		

		const data = getValues();
		await onSearch(data);
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
			<Breadcrumb pageName='Menu' />
			<div className='pb-36'>
				<>
					<div id='header'>
						<div className='flex flex-col'>
							<form
								onSubmit={handleSubmit((data) => onSearch(data))}
								className='flex flex-col space-y-4 w-full relative mb-4 py-2 bg-white border-stroke'>
								<div className='flex w-full items-center relative flex-wrap'>
									<div className='flex w-1/2 px-4'>
										<input
											{...register("name")}
											placeholder='Search Name'
											className={cx(
												`w-full rounded-lg border border-[rgb(204,204,204)] bg-white h-fit py-1.5 px-2 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`,
												css`
													::placeholder {
														font-weight: normal;
														color: hsl(0, 0%, 50%);
													}
												`
											)}
											onKeyDown={handleKeyDown}
										/>
									</div>
									<div className='flex w-1/2 px-4'>
										<Select
											{...register("m_menu_category_id")}
											className={cx(`w-full`)}
											options={options}
											placeholder={`Select Category`}
											isClearable={true}
											isSearchable={true}
											onChange={(e) =>
												handleChangeSelect("m_menu_category_id", e)
											}
										/>
									</div>
								</div>
							</form>
							<div className='w-full flex justify-end'>
								<div
									className='px-8 py-2 bg-danger rounded-lg h-fit text-white text-xs cursor-pointer hover:opacity-70'
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
								className={cx(
									css`
										z-index: 0;
									`
								)}
								data={datas}
								keyField={"id"}
								noHeader={true}
								fixedHeader={true}
								customStyles={customStyles}
								persistTableHead={true}
								striped={true}
								expandableRows={true}
								expandableRowsComponent={renderRowsComponent}
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
