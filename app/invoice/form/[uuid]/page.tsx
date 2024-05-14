"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import {
	EditorState,
	ContentState,
	convertFromHTML,
	convertToRaw,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Badge from "@/components/Badges";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Loading from "@/components/Table/Loading";
import {
	customer,
	invoice,
	m_menu_category,
	m_user,
	order,
	order_detail,
	order_detail_menu_item,
} from "@prisma/client";
import Image from "next/image";
import draftToHtml from "draftjs-to-html";
import { useRouter } from "next/navigation";
import { convertBase64, formatShorttDate } from "@/app/lib/helper";
import { Decimal } from "@prisma/client/runtime/library";
import NoImage from "@/components/Placeholder/NoImage";
import DataTable from "react-data-table-component";
import Sort from "@/components/Table/Sort";
import { PageContext } from "@/app/context";
import { ISession } from "@/app/type";
import Page403 from "@/components/Auth/403";

const Form = () => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [file, setFile] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isLoadingPayment, setLoadingPayment] = useState(true);
	const [istBase64, setBase64] = useState(false);
	const [isLoadingUpload, setLoadingUpload] = useState(false);
	const [published, setPublished] = useState(false);
	const [datas, setDatas] = useState([]);
	const [data, setData] = useState(
		{} as Partial<
			invoice & {
				order: order & {
					order_detail: Partial<
						order_detail & {
							order_detail_menu_item: order_detail_menu_item[];
						}
					>[];
					customer: customer;
					m_user: m_user;
				};
				payment: {
					total: Decimal | undefined;
					uuid: string | undefined;
					status: string | undefined;
				};
			}
		>
	);
	const [dataField, setDataField] = useState({});
	const router = useRouter();
	const [activeTab, setActiveTab] = useState("invoice");
	const [tabs, setTabs] = useState(
		[] as { label: string; value: string; count: number }[]
	);
	const [order, setOrder] = useState({ id: "desc" } as any);

	const params = useParams<{ uuid: string }>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const paramsPage = React.useContext(PageContext) as any;

	let session: ISession | null = null;

	if (paramsPage.session) {
		session = paramsPage.session;
	}

	let tabsDefault = [
		{ label: "Invoice", value: "invoice", count: 0 },
		{ label: "Payment", value: "payment", count: 0 },
	];

	useEffect(() => {
		setTabs(tabsDefault);
		(async () => {
			const req = await fetch("/invoice/api/by-uuid", {
				method: "POST",
				body: JSON.stringify({ uuid: params.uuid }),
				headers: {
					"content-type": "application/json",
				},
			});

			if (req) {
				const { data } = await req.json();
				setData(data);

				setLoading(false);

				const datas = await runQuery();
				console.log("asas : ", datas);

				setDatas(datas);
			}
		})();
	}, []);

	const onClickTab = async (value: string) => {
		setLoading(true);
		setActiveTab(value);

		let where = {};
		if (["draft", "published"].includes(value)) {
			where = {
				status: value,
			};
		}

		setLoading(false);
	};

	//payment
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
			name: "Bukti Bayar",
			selector: (row: any) => (row.m_files ? row.m_files.path : null),
			key: "path",
			type: "text",
			format: (row: any) => {
				if (row.m_files.path) {
					return (
						<div className='p-2'>
							<Image
								src={`${row.m_files.path}?width=200`}
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
			name: "Payment Method",
			selector: (row: any) => row.payment_method,
			key: "payment_method",
			type: "text",
			sortable: true,
			sortField: "payment_method",
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
			name: "Nominal",
			selector: (row: any) => row.nominal,
			key: "nominal",
			type: "number",
			format: (row: any) =>
				`Rp. ${row.nominal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
			sortable: true,
			sortField: "nominal",
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

	const onAddPayment = async () => {
		const add = await fetch("/payment-detail/api/add", {
			method: "POST",
			body: JSON.stringify({ uuid: data.payment?.uuid }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (add) {
			const addData = await add.json();
			router.push(
				`/invoice/form/payment/${data.payment?.uuid}/${addData.data.uuid}`
			);
		}
	};

	const runQuery = async () => {
		setLoadingPayment(true);
		const req = await fetch("/payment-detail/api/list", {
			method: "POST",
			body: JSON.stringify({
				uuid: data.uuid,
			}),
			headers: {
				"content-type": "application/json",
			},
		});

		if (req) {
			const { data } = await req.json();
			setLoadingPayment(false);
			return data;
		}
	};

	const handleSort = async (column: any, sortDirection: string) => {
		if (typeof column.sortField !== "undefined") {
			const order = { [column.sortField]: sortDirection };

			setLoading(true);
			setOrder(order);

			const datas = await runQuery();

			console.log("hallo : ", datas);
			setDatas(datas);
			setLoadingPayment(false);

			console.log(Object.values(order)[0]);
		}
	};

	if (!session?.user.roles?.includes("admin")) {
		return (
			<>
				<Page403 />
			</>
		);
	}

	if (isLoading) {
		return (
			<>
				<Breadcrumb pageName='Invoice' />
				<div className='h-screen flex justify-center items-center'>
					<Loading />
				</div>
			</>
		);
	}

	return (
		<>
			<Breadcrumb pageName='Invoice' />
			<div className='flex'>
				{tabs.map(({ value, label, count }, i) => {
					return (
						<div
							key={i}
							className={`pr-4 cursor-pointer text-center border-danger  ${
								activeTab === value ? `border-b-2 text-danger font-bold` : ``
							}`}>
							<div
								className='flex items-center space-x-2 py-1 transition-all hover:opacity-60'
								onClick={() => onClickTab(value)}>
								<div
									className={`text-base capitalize ${
										activeTab === value ? `font-bold` : ``
									}`}>
									{label}
								</div>
							</div>
						</div>
					);
				})}
			</div>
			<div className='pb-36 space-y-4'>
				{activeTab === "invoice" && (
					<>
						<div className='flex space-x-4 relative'>
							<div className='flex w-full flex-col space-y-6'>
								<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
									<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
										<h3 className='font-medium text-black dark:text-white'>
											Invoice Information
										</h3>
									</div>
									<div className='flex flex-col gap-5.5 p-6.5'>
										<div className='flex space-x-12'>
											<div className='flex flex-1 justify-between'>
												<label htmlFor='name'>Invoice Status</label>
												<div className=''>
													<div
														className={`text-xs text-white px-2 py-0.5 rounded-lg capitalize ${
															data.status === "paid"
																? "bg-success"
																: "bg-danger"
														}`}>
														{data.status}
													</div>
												</div>
											</div>
											<div className='flex flex-1 justify-between'>
												<label htmlFor='name'>Invoice No</label>
												<div className=''>{data.invoice_no}</div>
											</div>
										</div>

										<div className='flex space-x-12'>
											<div className='flex flex-1 justify-between'>
												<label htmlFor='name'>Date</label>
												<div className=''>
													{data.invoice_date
														? formatShorttDate(data.invoice_date)
														: null}
												</div>
											</div>
											<div className='flex flex-1 justify-between'>
												<label htmlFor='name'>Due Date</label>
												<div className=''>
													{data.invoice_due_date
														? formatShorttDate(data.invoice_due_date)
														: null}
												</div>
											</div>
										</div>

										<div className='flex space-x-12'>
											<div className='flex flex-1 justify-between'>
												<label htmlFor='name'>Customer</label>
												<div className=''>{`${data.order?.customer.name} (${data.order?.customer.phone})`}</div>
											</div>
											<div className='flex flex-1 justify-between'>
												<label htmlFor='name'>Affiliate</label>
												<div>{data.order?.m_user.name}</div>
											</div>
										</div>
									</div>
								</div>
								{data.status === "paid" && <div className='badge-corner'></div>}
							</div>
						</div>
						<div className='flex space-x-4 relative'>
							<div className='flex-1 flex-col space-y-6'>
								<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
									<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
										<h3 className='font-medium text-black dark:text-white'>
											Invoice Detail
										</h3>
									</div>
									<div className='flex flex-col gap-5.5 p-6.5 w-full'>
										<div className='flex flex-col w-full'>
											{data.order?.order_detail.map((order, i) => {
												return (
													<div
														key={i}
														className='flex flex-col w-full'>
														<div className='flex space-x-2 w-full'>
															<div>{`${i + 1}.`}</div>
															<div className='flex flex-row w-full justify-between'>
																<div className='flex w-2/5'>
																	{order.menu_name}
																</div>
																<div className='flex w-1/5'>{`Qty ${order.qty}`}</div>
																<div className='flex-1'>{`Notes ${order.notes}`}</div>
															</div>
														</div>
														<div
															className={`flex px-4 py-2 py-4 px-6.5 ${
																i + 1 !== data.order?.order_detail.length
																	? ``
																	: ``
															}`}>
															<div className='flex flex-col w-full'>
																{order.order_detail_menu_item?.map(
																	(item, i) => {
																		return (
																			<div
																				key={i}
																				className={`flex w-full space-x-2 py-2 mx-0 ${
																					i + 1 !==
																					order.order_detail_menu_item?.length
																						? `border-b border-stroke dark:border-strokedark`
																						: ``
																				}`}>
																				<div>{`${i + 1}.`}</div>
																				<div>{item.name}</div>
																			</div>
																		);
																	}
																)}
															</div>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)}

				{activeTab === "payment" && (
					<>
						<div className='flex space-x-4 relative'>
							<div className='flex w-full flex-col space-y-6'>
								<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
									<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
										<h3 className='font-medium text-black dark:text-white'>
											Detail Payment
										</h3>
									</div>
									<div className='flex flex-col gap-3 p-6.5 w-full'>
										<div className='flex flex-1 justify-between'>
											<label htmlFor='name'>Total</label>
											<div>{`Rp. ${data.total
												?.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</div>
										</div>
										<div className='flex flex-1 justify-between'>
											<label htmlFor='name'>Discount</label>
											<div>{`Rp. ${data.discount
												?.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</div>
										</div>
										<div className='flex flex-1 justify-between'>
											<label htmlFor='name'>Delivery</label>
											<div>{`Rp. ${data.delivery_charge
												?.toString()
												.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}</div>
										</div>
										<div className='flex flex-1 justify-between pt-2 border-t border-stroke dark:border-strokedark'>
											<label
												htmlFor='name'
												className='font-bold'>
												Total Bayar
											</label>
											<div className='font-bold'>
												{data.payment?.total
													? `Rp. ${data.payment.total
															?.toString()
															.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
													: 0}
											</div>
										</div>
									</div>
									{/* <div className='flex flex-col gap-3 p-6.5 w-full'></div> */}
								</div>
							</div>
						</div>
						<div className='flex space-x-4 relative'>
							<div className='flex w-full flex-col space-y-6'>
								<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
									<div className='flex justify-between border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
										<h3 className='font-medium text-black dark:text-white'>
											Payment History
										</h3>
										<div className='flex justify-between'>
											<div className='w-full flex justify-end'>
												<div
													className='px-8 py-2 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
													onClick={onAddPayment}>
													Add
												</div>
											</div>
										</div>
									</div>
									<div className='flex flex-col gap-3 p-6.5 w-full'>
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
													pagination={false}
													progressPending={isLoadingPayment}
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
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default Form;
