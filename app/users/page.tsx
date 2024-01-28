"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Sort from "@/components/Table/Sort";
import Loading from "@/components/Table/Loading";
import { useRouter } from "next/navigation";
import Image from "next/image";
import NoImage from "@/components/Placeholder/NoImage";
import { formatLongtDate, formatShorttDate } from "../lib/helper";
import { m_roles, m_user_roles } from "@prisma/client";
import Badge from "@/components/Badges";

interface ITabCount {
	status: string;
	_count: {
		status: number;
	};
}

const Users = () => {
	const router = useRouter();
	const [datas, setDatas] = useState([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [take, setTake] = useState(10);
	const [condition, setCondition] = useState({} as any);
	const [order, setOrder] = useState({ id: "desc" } as any);
	const [activeTab, setActiveTab] = useState("all");
	const [tabs, setTabs] = useState(
		[] as { label: string; value: string; count: number }[]
	);
	const [userData, setUserData] = useState(null as any);

	let tabsDefault = [
		{ label: "All", value: "all", count: 0 },
		{ label: "Draft", value: "draft", count: 0 },
		{ label: "Active", value: "active", count: 0 },
		{ label: "Not Active", value: "inactive", count: 0 },
	];

	const columns = [
		{
			name: "UUID",
			selector: (row: any) => row.uuid,
			type: "text",
			sortable: true,
			omit: true,
		},
		{
			name: "Name",
			selector: (row: any) => row.name,
			type: "text",
			sortable: true,
			sortField: "name",
		},
		{
			name: "Email",
			selector: (row: any) => row.email,
			type: "text",
			sortable: true,
			sortField: "email",
		},
		{
			name: "Email Verified",
			selector: (row: any) => row.email_verified,
			type: "text",
			sortable: true,
			sortField: "email_verified",
			format: (row: any) =>
				row.email_verified ? (
					<>
						<Badge
							label='true'
							state='success'
						/>
					</>
				) : (
					<>
						<Badge
							label='false'
							state='danger'
						/>
					</>
				),
		},
		{
			name: "Affiliate",
			selector: (row: any) => row.affiliate_code,
			type: "text",
			sortable: true,
			sortField: "affiliate_code",
		},
		{
			name: "Roles",
			selector: (row: any) => row.m_user_roles.m_roles,
			type: "text",
			format: (row: any) => {
				const user_roles: m_user_roles[] = row.m_user_roles;
				const rolesName = user_roles.map((user_role: any, i) => {
					return user_role.m_roles.name;
				});

				return rolesName.join(", ");
			},
		},
		{
			name: "Status",
			selector: (row: any) => row.status,
			key: "status",
			type: "text",
			format: (row: any) => (
				<div
					className={`text-xs text-white px-2 py-0.5 rounded-lg capitalize ${
						row.status === "draft" ? "bg-danger" : (row.status === "active" ? "bg-success" : "bg-warning")
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

	const getSession = async () => {
		const req = await fetch("/users/api/session", {
			method: "POST",
			body: JSON.stringify({}),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { session } = await req.json();
			return session;
		}
	};

	const runTotal = async (where: {}) => {
		const req = await fetch("/users/api/total", {
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
		const req = await fetch("/users/api/list", {
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

	const runTabTotal = async () => {
		const req = await fetch("/users/api/total-per-status", {
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

			const session = await getSession();
			setUserData(session);
		})();
	}, []);

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

	const onClickTab = async (value: string) => {
		setLoading(true);
		setActiveTab(value);

		let where = {};
		if (["draft", "active", "inactive"].includes(value)) {
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

	const onAdd = async () => {
		const req = await fetch("/users/api/add", {
			method: "POST",
			body: JSON.stringify({
				owner: userData.user.uuid
			}),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { data } = await req.json();
			router.push(`/users/form/${data.uuid}`);
		}
	};

	const renderRowsComponent = ({ data }: any) => {
		return (
			<>
				<div className='flex flex-col p-4 space-y-4'>
					<div className='flex'>
						<div className='w-1/6'>Foto</div>
						<div>
							{data.m_files.path ? (
								<div className='p-2'>
									<Image
										src={"/" + data.m_files.path}
										width={100}
										height={100}
										alt={data.name}
										priority={false}
										className='w-24'
									/>
								</div>
							) : (
								<div className='py-1'>
									<div className='bg-gray flex justify-center items-center w-28'>
										<NoImage
											w={50}
											h={50}
										/>
									</div>
								</div>
							)}
						</div>
					</div>
					<div className='flex'>
						<div className='w-1/6'>Created At</div>
						<div>{formatShorttDate(data.created_at)}</div>
					</div>
				</div>
			</>
		);
	};

	return (
		<>
			<Breadcrumb pageName='Users' />
			<div className='pb-36'>
				<>
					<div id='header'>
						<div className='flex justify-between'>
							<div className='w-full flex justify-end'>
								<div
									className='px-8 py-2 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
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

export default Users;
