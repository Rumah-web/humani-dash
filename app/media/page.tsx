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

const Media = () => {
	const router = useRouter();
	const [datas, setDatas] = useState([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setLoading] = useState(true);
	const [page, setPage] = useState(0);
	const [take, setTake] = useState(10);
	const [condition, setCondition] = useState({} as any);
	const [order, setOrder] = useState({ id: "desc" } as any);


	const columns = [
		{
			name: "Foto",
			selector: (row: any) =>
				row.path ? row.path : null,
			key: "path",
			type: "text",
			format: (row: any) => {
				if (row.path) {
					return (
						<div className='p-2'>
							<Image
								src={`${row.path}?width=200`}
								width={100}
								height={100}
								alt={row.name}
								priority={false}
								unoptimized
								className='w-24'
							/>
						</div>
					);
				}

				return (
					<div className="py-1">
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
			omit: true
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
			name: "Size",
			selector: (row: any) => row.size,
			key: "size",
			type: "number",
			sortable: true,
			sortField: "size",
		},
		{
			name: "Type",
			selector: (row: any) => row.type,
			key: "type",
			type: "text",
			sortable: true,
			sortField: "type",
		},
		{
			name: "Created At",
			selector: (row: any) => row.created_at,
			key: "created_at",
			type: "text",
			sortable: true,
            format: (row: any) => formatShorttDate(row.created_at),
			sortField: "created_at",
		}
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
				cursor: 'pointer'
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

	const runTotal = async (where: {}) => {
		const req = await fetch("/media/api/total", {
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
		const req = await fetch("/media/api/list", {
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
		
		(async () => {
			const data = await runQuery(condition, take, page, order);
			const total = await runTotal(condition);

			setDatas(data);
			setLoading(false);
			setTotal(total);

			
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

	const onRowClicked = (row: any, event: any) => {
		return window.open(`https://media.humanicode.com/view/${row.uuid}?width=500`, '_blank')
	};

	return (
		<>
			<Breadcrumb pageName='Media' />
			<div className='pb-36'>
				<>
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
								onRowClicked={onRowClicked}
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

export default Media;
