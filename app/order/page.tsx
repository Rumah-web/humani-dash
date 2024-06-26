"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Sort from "@/components/Table/Sort";
import Loading from "@/components/Table/Loading";
import { useRouter } from "next/navigation";
import { PageContext } from "../context";
import { ISession } from "../type";
import Page403 from "@/components/Auth/403";
import Link from "next/link";
import { IconHistory, IconLoading } from "@/components/Icons";
import { formatShorttDate, formatTime } from "../lib/helper";

interface ITabCount {
	status: string;
	_count: {
		status: number;
	};
}

const Order = (props: any) => {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("all");
	const [datas, setDatas] = useState([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setLoading] = useState(true);
	const [isLoadingAdd, setLoadingAdd] = useState(false);
	const [page, setPage] = useState(0);
	const [take, setTake] = useState(10);
	const [tabs, setTabs] = useState(
		[] as { label: string; value: string; count: number }[]
	);
	const [condition, setCondition] = useState({} as any);
	const [order, setOrder] = useState({ id: "desc" } as any);

	const params = React.useContext(PageContext) as any;

	let session: ISession | null = null;

	if (params.session) {
		session = params.session;
	}

	let tabsDefault = [
		{ label: "All", value: "all", count: 0 },
		{ label: "Draft", value: "draft", count: 0 },
		{ label: "New", value: "new", count: 0 },
		{ label: "Process", value: "process", count: 0 },
		{ label: "Delivery", value: "delivery", count: 0 },
		{ label: "Finish", value: "finished", count: 0 },
		{ label: "Cancel", value: "cancel", count: 0 },
	];

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
			name: "Order No",
			selector: (row: any) => row.order_no,
			key: "order_no",
			type: "text",
			sortable: true,
			sortField: "order_no",
		},
		{
			name: "Customer",
			selector: (row: any) =>
				`${
					row.customer ? `${row.customer.name} (${row.customer.phone})` : `-`
				}`,
			key: "customer.id",
			type: "text",
			sortable: true,
			sortField: "customer.id",
		},
		{
			name: "Delivery",
			selector: (row: any) => row.delivery_date,
			key: "delivery_date",
			type: "text",
			format: (row: any) =>
				row.delivery_date ? formatShorttDate(row.delivery_date) : undefined,
			sortable: true,
			sortField: "delivery_date",
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
		{
			name: "Payment",
			selector: (row: any) =>
				`${row.invoice[0] ? row.invoice[0].payment[0].status : "-"}`,
			key: "payment.status",
			type: "text",
			sortable: true,
			sortField: "payment.status",
			format: (row: any) => (
				<>
					{row.invoice[0] ? (
						<div
							className={`text-xs text-white px-2 py-0.5 rounded-lg capitalize ${
								row.invoice[0].payment[0].status === "paid"
									? "bg-success"
									: "bg-danger"
							}`}>
							{row.invoice[0].payment[0].status}
						</div>
					) : (
						`-`
					)}
				</>
			),
		},
		{
			name: "Invoice",
			selector: (row: any) => row.invoice,
			type: "text",
			format: (row: any) => (
				<>
					{row.invoice && row.invoice.length > 0 ? (
						<>
							<Link
								href={`/invoice/form/${row.invoice[0].uuid}`}
								className='underline text-sm'>
								Lihat Invoice
							</Link>
						</>
					) : (
						<>-</>
					)}
				</>
			),
			sortable: false,
		},
	];

	const renderRowsComponent = ({ data }: any) => {
		console.log("render : ", data);
		return (
			<div className='border-b border-[#e0e0e0] bg-[#fafafa]'>
				<div className='flex flex-col py-4 px-16 space-y-4'>
					<div className='flex items-center space-x-8'>
						<div className='w-1/6'>
							<div className='text-center'>Proses Order</div>
							<Link
								href={`/process-order/form/${data.uuid}`}
								className='justify-center underline cursor-pointer hover:opacity-60 flex'>
								[update]
							</Link>
						</div>

						{data.order_status_history &&
						data.order_status_history.length > 0 ? (
							<>
								<ol className='relative border-s border-gray-200 dark:border-gray-700'>
									{data.order_status_history.map((history: any, i: number) => {
										return (
											<li
												className='mb-10 ms-6'
												key={i}>
												<span className='absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900'>
													<IconHistory />
												</span>
												<div className='flex space-x-4 items-center'>
													<h3 className='flex items-center capitalize mb-1 text-base font-semibold text-gray-900 dark:text-white'>
														{history.status}
													</h3>
													{i === 0 && (
														<div className='h-fit text-xs text-white px-2 py-0.5 rounded-lg capitalize bg-warning'>
															New
														</div>
													)}
												</div>

												<time className='block mb-2 text-sm font-normal flex space-x-2 leading-none text-darkgray dark:text-darkgray'>
													<span>{`${formatShorttDate(
														history.created_at
													)}`}</span>
													<span>{`${formatTime(history.created_at)}`}</span>
												</time>
											</li>
										);
									})}
								</ol>
							</>
						) : (
							<>
								<div>Sedang dalam proses</div>
							</>
						)}
					</div>
				</div>
			</div>
		);
	};

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

	const runTabTotal = async () => {
		const req = await fetch("/order/api/total-per-status", {
			method: "POST",
			body: JSON.stringify({}),
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
		const req = await fetch("/order/api/total", {
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
		const req = await fetch("/order/api/list", {
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
			const tabTotal = await runTabTotal();

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
		if (
			tabsDefault
				.filter((tab, i) => tab.value !== "all")
				.map((item, i) => item.value)
				.includes(value)
		) {
			where = {
				status: value,
			};

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
		setLoadingAdd(true);
		const req = await fetch("/order/api/add", {
			method: "POST",
			body: JSON.stringify({ user_created: session?.user.uuid }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { data } = await req.json();
			router.push(`/order/form/${data.uuid}`);
		}
		setLoadingAdd(false);
	};

	const onRowClicked = (row: any, event: any) => {
		router.push(`/order/form/${row.uuid}`);
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
			<Breadcrumb pageName='Order' />
			<div className='pb-36'>
				<>
					<div id='header'>
						<div className='flex justify-between'>
							<div className='w-full flex justify-end'>
								<div
									className='px-8 py-2 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
									onClick={onAdd}>
									{isLoadingAdd ? <IconLoading /> : `Add`}
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
								expandableRows={true}
								expandableRowsComponent={renderRowsComponent}
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

export default Order;
