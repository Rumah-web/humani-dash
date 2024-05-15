"use client";

import React, { useEffect, useState } from "react";
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
import { cx, css } from "@emotion/css";
import { useForm } from "react-hook-form";
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
	const [order, setOrder] = useState({ id: "desc" } as any);
	const [filter, setFilter] = useState({} as any);
	const [options, setOptions] = useState([] as IOptionsSelect[]);

	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
	} = useForm();

	let tabsDefault = [
		{ label: "All", value: "all", count: 0 },
		{ label: "New", value: "new", count: 0 },
		{ label: "Paid", value: "paid", count: 0 },
	];

	const paramsPage = React.useContext(PageContext) as any;

	let session: ISession | null = null;

	if (paramsPage.session) {
		session = paramsPage.session;
	}

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
			name: "Invoice No",
			selector: (row: any) => row.invoice_no,
			key: "invoice_no",
			type: "text",
			sortable: true,
			sortField: "invoice_no",
		},
		{
			name: "Due Date",
			selector: (row: any) => row.invoice_due_date,
			key: "invoice_due_date",
			type: "text",
			sortable: true,
			sortField: "invoice_due_date",
			format: (row: any) => formatShorttDate(row.invoice_due_date),
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
						row.status === "paid" ? "bg-success" : "bg-danger"
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
		const req = await fetch("/invoice/api/total-per-status", {
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
		const req = await fetch("/invoice/api/total", {
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
		const req = await fetch("/invoice/api/list", {
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

	const onRowClicked = (row: any, event: any) => {
		router.push(`/invoice/form/${row.uuid}`);
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
		if (e) {
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
			<Breadcrumb pageName='Invoice' />
			<div className='pb-36'>
				<>
					<div id='header'>
						<div className='flex flex-col'>
							<form
								onSubmit={handleSubmit((data) => onSearch(data))}
								className='flex flex-col space-y-4 w-full relative mb-4 py-2 bg-white border-stroke'>
								<div className='flex w-full items-center relative flex-wrap'>
									<div className='flex w-full px-4'>
										<input
											{...register("invoice_no")}
											placeholder='Search Invoice No'
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
										
									</div>
								</div>
							</form>
							<div className='w-full flex justify-end'></div>
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
								className={cx(
									css`
										z-index: 0;
									`
								)}
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
