"use client";
import { PropsColumn } from "@/app/type";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { data } from "autoprefixer";
import { m_menu } from "@prisma/client";

interface ITabCount {
	status: string,
	_count: {
		status: number
	}
}

const Menu = () => {
	const [activeTab, setActiveTab] = useState("all");
	const [datas, setDatas] = useState([]);
    const [total, setTotal] = useState(0);
	const [isLoading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [take, setTake] = useState(10);
	const [tabs, setTabs] = useState([] as {label: string, value: string, count: number}[]);
	const [condition, setCondition] = useState({} as any)
	const [order, setOrder] = useState({id: 'desc'} as any)



	const columns = [
		{
			name: "Name",
			selector: (row: any) => row.name,
			key: "name",
			type: "text",
			sortable: true,
			sortField: 'name',
		},
		{
			name: "Description",
			selector: (row: any) => row.description,
			key: "description",
			type: "text",
			sortable: true,
			sortField: 'description',
		},
		{
			name: "Price",
			selector: (row: any) => row.price,
			key: "price",
			type: "number",
			format: (row: any) =>
				`Rp. ${row.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
			sortable: true,
			sortField: 'price',	
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
			sortField: 'price_promo',	
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
		const req = await fetch("/menu/api/total-per-status", {
			method: "POST",
			body: JSON.stringify({}),
			headers: {
				"content-type": "application/json",
			},
		})

        if(req) {
            const {data} = await req.json()
            return data
        }
	}

    const runTotal = async(where: {}) => {
        const req = await fetch("/menu/api/total", {
			method: "POST",
			body: JSON.stringify({
				where
			}),
			headers: {
				"content-type": "application/json",
			},
		})

        if(req) {
            const {total} = await req.json()
            return total
        }
    }

    const runQuery = async (where: {}, take: number, skip: number, orderBy: {}) => {
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
		})

        if(req) {
            const {data} = await req.json() 
            return data
        }
    }

	useEffect(() => {
        (async() => {
            
            const data = await runQuery(condition,take,page,order)
            const total = await runTotal(condition)
			const tabTotal = await runTabTotal()

            setDatas(data)
            setLoading(false)
            setTotal(total)

			let tabsDefault = [
				{ label: "All", value: "all", count: 0 },
				{ label: "Draft", value: "draft", count: 0 },
				{ label: "Published", value: "published", count: 0 },
			];
	
			
	
			tabsDefault = tabsDefault.map((tab, i) => {
				const find: ITabCount = tabTotal.find((res: ITabCount, i: number) => res.status === tab.value)

				if(find) {
					return {...tab, count: find._count.status}
				}

				if(tab.value === 'all') {
					return {...tab, count: total}
				}

				return tab
			})

			setTabs(tabsDefault)
			

        })()

		
	}, []);

	const onClickTab = async (value: string) => {
		setLoading(true)
		setActiveTab(value);

		let where = {}
		if(['draft', 'published'].includes(value)) {
			where = {
				status: value
			}

			setCondition(where) 
		}

		const data = await runQuery(where,take,page,order)

		const total = await runTotal(where)

		setDatas(data)
		setTotal(total)
		setLoading(false)
	};

	const handlePageChange = async (page: number) => {
        if(datas.length > 0) {
            const _page = page - 1
            setLoading(true)
            const data = await runQuery(condition, take, _page, order) 
            setPage(_page)
            setDatas(data)
            setLoading(false)
        } 
	};

	const handlePerRowsChange = async (newPerPage: number, page: number) => {
        if(datas.length > 0) {
            const _page = page - 1
            setLoading(true)
            const data = await runQuery(condition, newPerPage, _page, order)
            setTake(newPerPage) 
            setDatas(data)
            setLoading(false)
        }
		
	};

	const handleSort = async (column: any, sortDirection: string) => {

		if(typeof column.sortField !== 'undefined') {
			const order = {[column.sortField]: sortDirection}
			
			setLoading(true)
			setOrder(order)
			
			const data = await runQuery(condition, take, page, order)

			setDatas(data)
			setLoading(false)

			console.log(Object.values(order)[0])
		}
	}

	return (
		<>
			<Breadcrumb pageName='Menu' />
			<div>
				<>
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
								fixedHeader={true}
								customStyles={customStyles}
								persistTableHead={true}
								striped={true}
								pagination
								paginationTotalRows={total}
								progressPending={isLoading}
								paginationServer
								onChangeRowsPerPage={(newPerPage, page) => handlePerRowsChange(newPerPage, page)}
								onChangePage={(page) => handlePageChange(page)}
								sortServer
								onSort={(column, sortDirection) => handleSort(column, sortDirection)}
								sortIcon={<>{Object.values(order).includes('desc') ? <div className="rotate-180"><svg width="10" height="10" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
								<path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192"/>
							</svg></div> : <div><svg width="10" height="10" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
								<path fill="currentColor" d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142"/>
							</svg></div>}</>}
								progressComponent={
									<div className="pt-5">
										<svg
											width='50'
											height='50'
											viewBox='0 0 24 24'
											xmlns='http://www.w3.org/2000/svg'>
											<g
												fill='none'
												stroke='currentColor'
												strokeLinecap='round'
												strokeWidth='2'>
												<path
													strokeDasharray='60'
													strokeDashoffset='60'
													strokeOpacity='.3'
													d='M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z'>
													<animate
														fill='freeze'
														attributeName='stroke-dashoffset'
														dur='1.3s'
														values='60;0'
													/>
												</path>
												<path
													strokeDasharray='15'
													strokeDashoffset='15'
													d='M12 3C16.9706 3 21 7.02944 21 12'>
													<animate
														fill='freeze'
														attributeName='stroke-dashoffset'
														dur='0.3s'
														values='15;0'
													/>
													<animateTransform
														attributeName='transform'
														dur='1.5s'
														repeatCount='indefinite'
														type='rotate'
														values='0 12 12;360 12 12'
													/>
												</path>
											</g>
										</svg>
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
