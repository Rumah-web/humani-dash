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
import Badge from "@/components/Badges";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Loading from "@/components/Table/Loading";
import {
	customer,
	m_menu,
	m_menu_category,
	order,
	order_detail,
	order_detail_menu_item,
} from "@prisma/client";
import draftToHtml from "draftjs-to-html";
import { useRouter } from "next/navigation";
import { convertBase64, formatShorttDate, formatTime } from "@/app/lib/helper";
import Select from "react-select";
import { IOptionsSelect, ISession } from "@/app/type";
import { IconBoxOpen, IconDelete, IconLoading } from "@/components/Icons";
import { PageContext } from "@/app/context";
import Page403 from "@/components/Auth/403";

import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";
import { cx, css } from "@emotion/css";

import { Bounce, ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const Editor = dynamic(
	() => import("react-draft-wysiwyg").then((mod) => mod.Editor),
	{ ssr: false }
);

type DeliveryDateTime = Date | null;

type DeliveryDateTimeValue =
	| DeliveryDateTime
	| [DeliveryDateTime, DeliveryDateTime];

const Form = () => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [isLoading, setLoading] = useState(true);
	const [isPublish, setPublish] = useState(false);
	const [published, setPublished] = useState(false);
	const [loadingInvoice, setLoadingInvoice] = useState(false);
	const [itemMenuEdit, setItemMenuEdit] = useState(
		null as null | { id: number; order_detail_id: number }
	);
	const [isEditItemMenu, setEditItemMenu] = useState(false);
	const [data, setData] = useState(
		{} as order & {
			order_detail: Partial<
				order_detail & { order_detail_menu_item: order_detail_menu_item[] }
			>[];
		}
	);
	const [customers, setCustomers] = useState([] as customer[]);
	const [dataField, setDataField] = useState({});
	const router = useRouter();
	const [options, setOptions] = useState([] as IOptionsSelect[]);
	const [affiliate, setAffiliate] = useState([] as IOptionsSelect[]);
	const [isAdditem, setAdditem] = useState(false);
	const [detailOptions, setDetailOptions] = useState([] as IOptionsSelect[]);
	const [catOptions, setCatOptions] = useState([] as IOptionsSelect[]);
	const [menuOptions, setMenuOptions] = useState([] as IOptionsSelect[]);
	const [menuItemOptions, setMenuItemOptions] = useState(
		[] as IOptionsSelect[]
	);
	const [menuSelected, setMenuSelected] = useState(
		null as null | IOptionsSelect
	);
	const [catSelected, setCatSelected] = useState(null as null | IOptionsSelect);
	const [menuItemSelected, setMenuItemSelected] = useState(
		null as null | IOptionsSelect
	);
	const [menu, setMenu] = useState({} as m_menu | null);
	const [qty, setQty] = useState("" as string | number);
	const [deliveryDateTimeValue, onDeliveryDateTimeValue] = useState<Date>(
		new Date()
	);

	const params = useParams<{ uuid: string }>();

	const paramsPage = React.useContext(PageContext) as any;

	let session: ISession | null = null;

	if (paramsPage.session) {
		session = paramsPage.session;
	}

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onEditorStateChange = (editorState: any) => {
		if (editorState) setEditorState(editorState);
	};

	const onUpdateByField = async (data: any) => {
		await fetch("/order/api/update-field", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid, data }),
			headers: {
				"content-type": "application/json",
			},
		});
	};

	const onChange = async (column: string, value: any) => {
		const fieldValue =
			typeof value === "undefined"
				? null
				: column.endsWith("_date")
				? new Date(value)
				: value;
		const params = {
			[column]: ["order"].includes(column) ? parseInt(fieldValue) : fieldValue,
		};
		setData({ ...data, ...params });
		setDataField(params);
	};

	const onChangeState = async (status: string) => {
		setPublished(true);
		await fetch("/order/api/change-state", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid, status }),
			headers: {
				"content-type": "application/json",
			},
		});
		setPublished(false);

		router.push(`/order`);
	};

	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			await onUpdateByField(dataField);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [data, 500]);

	useEffect(() => {
		(async () => {
			const req = await fetch("/order/api/by-uuid", {
				method: "POST",
				body: JSON.stringify({ uuid: params.uuid }),
				headers: {
					"content-type": "application/json",
				},
			});

			const reCustomers = await fetch("/customer/api/list", {
				method: "POST",
				body: JSON.stringify({}),
				headers: {
					"content-type": "application/json",
				},
			});

			const reqAffiliate = await fetch("/users/api/affiliate", {
				method: "POST",
				body: JSON.stringify({}),
				headers: {
					"content-type": "application/json",
				},
			});

			const reqCategory = await fetch("/menu/api/menu-category", {
				method: "POST",
				body: JSON.stringify({}),
				headers: {
					"content-type": "application/json",
				},
			});

			const reqDetail = await fetch("/order/api/list-order-detail", {
				method: "POST",
				body: JSON.stringify({ order_id: data.id }),
				headers: {
					"content-type": "application/json",
				},
			});

			if (req) {
				const { data, file } = await req.json();
				setData(data);

				if (data.status !== "draft") setPublish(true);

				const customerData = await reCustomers.json();
				if (customerData) {
					setOptions(customerData.data);
				}

				const affiliateData = await reqAffiliate.json();
				if (affiliateData) {
					setAffiliate(affiliateData.data);
				}

				if (reqDetail) {
					const listOrderDetail = await reqDetail.json();

					console.log(listOrderDetail);
					setDetailOptions(listOrderDetail.data);
				}

				if (reqCategory) {
					const catData = await reqCategory.json();
					setCatOptions(catData.data);
				}

				setEditorState(
					EditorState.createWithContent(
						ContentState.createFromBlockArray(
							convertFromHTML(data.notes) as any
						)
					)
				);
				setLoading(false);
			}
		})();
	}, []);

	const onAddItem = async () => {
		setAdditem(true);

		const addItem = await fetch("/order/api/add-order-detail", {
			method: "POST",
			body: JSON.stringify({ uuid: data.uuid, menu: menu?.uuid, qty }),
			headers: {
				"content-type": "application/json",
			},
		});

		const menuitem = await addItem.json();
		if (menuitem) {
			console.log('add item : ', menuitem)
			setData({ ...data, order_detail: [...data.order_detail, menuitem.data] });
		}

		setCatSelected(null);
		setAdditem(false);
		setMenuSelected(null);
		setMenu(null);
		setQty("");
	};

	const onDeleteItem = async (id: number) => {
		setData({
			...data,
			order_detail: data.order_detail.filter((item, i) => item.id !== id),
		});
		await fetch("/order/api/delete-order-detail", {
			method: "POST",
			body: JSON.stringify({ id }),
			headers: {
				"content-type": "application/json",
			},
		});
	};

	const onChangeCategory = async (val: IOptionsSelect) => {
		setMenuSelected(null);
		setMenu(null);
		setQty("");
		setCatSelected(val);

		const reqMenu = await fetch("/menu/api/list-menu-by-category", {
			method: "POST",
			body: JSON.stringify({ category_id: val.value }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (reqMenu) {
			const dataMenu = await reqMenu.json();
			setMenuOptions(dataMenu.data);
		}
	};

	const onSelectMenu = async (val: IOptionsSelect) => {
		setMenuSelected(val);
		setQty("");

		const reqMenu = await fetch("/menu/api/by-id", {
			method: "POST",
			body: JSON.stringify({ id: val.value }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (reqMenu) {
			const dataMenu = await reqMenu.json();
			setMenu(dataMenu.data);
		}
	};

	const onChangeQty = (val: number) => {
		setQty(val);
	};

	const onSaveEditor = async () => {
		const raw = convertToRaw(editorState.getCurrentContent());
		await onUpdateByField({ notes: draftToHtml(raw) });
	};

	const onPublishOrder = async () => {
		if (window.confirm(`Pastikan data order Anda sudah sesuai ?`)) {
			setLoadingInvoice(true);
			const publishOrder = await fetch("/order/api/publish-order", {
				method: "POST",
				body: JSON.stringify({ uuid: data.uuid }),
				headers: {
					"content-type": "application/json",
				},
			});

			if (publishOrder) {
				const res = await publishOrder.json();

				if (res.success) {
					toast(res.message, {
						type: "success",
					});
					router.push(`/order`);
				} else {
					alert("Terjadi Kesalahan");
				}
			}

			setLoadingInvoice(false);
		}
	};

	const onEditItemMenu = async (id_detail: number, id_detail_item: number) => {
		if (!isEditItemMenu) {
			const req = await fetch("/order/api/list-menu-item", {
				method: "POST",
				body: JSON.stringify({}),
				headers: {
					"content-type": "application/json",
				},
			});

			if (req) {
				const dataMenu = await req.json();
				setMenuItemOptions(dataMenu.data);
			}
		}

		setItemMenuEdit({ id: id_detail, order_detail_id: id_detail_item });
		setEditItemMenu(true);
	};

	const onCancelEditItemMenu = () => {
		setMenuItemSelected(null);
		setItemMenuEdit(null);
	};
	const onSelectMenuItem = (val: IOptionsSelect) => {
		console.log(val);
		setMenuItemSelected(val);
	};

	const onSaveEditItemMenu = async (id: number) => {
		const update = await fetch("/order/api/update-menu-item", {
			method: "POST",
			body: JSON.stringify({ id, name: menuItemSelected?.label }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (update) {
			const resUpdate = await update.json();
			if (resUpdate.success) {
				toast(resUpdate.message, {
					type: "success",
				});

				const order_detail = data.order_detail.map((order_detail, i) => {
					const order_detail_menu_item =
						order_detail.order_detail_menu_item &&
						order_detail.order_detail_menu_item.map(
							(order_detail_menu_item, i) => {
								return {
									...order_detail_menu_item,
									...{
										name:
											order_detail_menu_item.id === id
												? menuItemSelected?.label
												: order_detail_menu_item.name,
									},
								};
							}
						);
					return { ...order_detail, order_detail_menu_item };
				});

				setData({ ...data, order_detail });
			}
		}

		setMenuItemSelected(null);
		setItemMenuEdit(null);
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
				<Breadcrumb pageName='Create' />
				<div className='h-screen flex justify-center items-center'>
					<Loading />
				</div>
			</>
		);
	}

	return (
		<>
			<Breadcrumb pageName='Create' />
			<div className='pb-36'>
				<form
					onSubmit={handleSubmit((data) => console.log(data))}
					className='flex space-x-4 relative'>
					<div className='flex w-2/3 flex-col space-y-6'>
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
								<h3 className='font-medium text-black dark:text-white'>
									Order Information
								</h3>
							</div>
							<div className='flex flex-col gap-5.5 p-6.5'>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Customer</label>
									{isPublish ? (
										<>
											{
												options.find(
													(item, i) => item.value === data.customer_id
												)?.label
											}
										</>
									) : (
										<>
											<Select
												options={options}
												isClearable={true}
												isSearchable={true}
												isDisabled={isPublish}
												defaultValue={options.find(
													(opt, i) => opt.value === data.customer_id
												)}
												onChange={(e) => onChange("customer_id", e?.value)}
											/>
										</>
									)}
								</div>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Affiliate</label>
									{isPublish ? (
										<>
											{
												affiliate.find(
													(item, i) => item.value === data.affiliate_code
												)?.label
											}
										</>
									) : (
										<>
											<Select
												options={affiliate}
												isClearable={true}
												isSearchable={true}
												isDisabled={isPublish}
												defaultValue={affiliate.find(
													(opt, i) => opt.value === data.affiliate_code
												)}
												onChange={(e) => onChange("affiliate_code", e?.value)}
											/>
										</>
									)}
								</div>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Notes</label>
									{isPublish ? (
										<>
											<div
												dangerouslySetInnerHTML={{
													__html: data.notes ? data.notes : "",
												}}
											/>
										</>
									) : (
										<>
											<Editor
												editorState={editorState}
												editorStyle={{ height: "400px" }}
												toolbarClassName='toolbarClassName'
												wrapperClassName='wrapperClassName'
												editorClassName='px-4 border border-[#dfdfdf] bg-white'
												onEditorStateChange={onEditorStateChange}
												onBlur={onSaveEditor}
											/>
										</>
									)}
								</div>
							</div>
						</div>
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
								<h3 className='font-medium text-black dark:text-white'>
									Order Detail
								</h3>
							</div>
							<div className='flex flex-col gap-10 p-6.5'>
								{!isPublish && (
									<div className='flex flex-col space-y-4 w-full'>
										<div className='w-full flex items-center space-x-4'>
											<div className='flex flex-col space-y-4 w-full'>
												<div className='flex flex-col gap-2'>
													<label htmlFor='m_menu_category'>
														Pilih Category
													</label>
													<Select
														options={catOptions}
														isClearable={true}
														isSearchable={true}
														className='w-full'
														placeholder='-- Select --'
														value={catSelected}
														isDisabled={isPublish}
														id='m_menu_category'
														onChange={(e) =>
															onChangeCategory({
																label: e?.label,
																value: e?.value,
															})
														}
													/>
												</div>
												<div className='flex flex-col gap-2'>
													<label htmlFor='m_menu_category'>Pilih Menu</label>
													<Select
														options={menuOptions}
														isClearable={true}
														isSearchable={true}
														isDisabled={isPublish}
														className='w-full'
														placeholder='-- Select --'
														value={menuSelected}
														onChange={(e) =>
															onSelectMenu({ value: e?.value, label: e?.label })
														}
													/>
												</div>
												<div className='flex flex-col gap-2'>
													<label htmlFor='m_menu_category'>Qty</label>
													<input
														type='number'
														className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
														min={menu?.min_qty}
														max={menu?.max_qty}
														disabled={isPublish}
														// value={qty}
														onChange={(e) =>
															onChangeQty(parseInt(e.target.value))
														}
													/>
													<span className='text-danger text-xs'>
														{menu?.min_qty &&
															`Minimal order ${menu.min_qty} pcs`}
													</span>
												</div>
												<div className='flex md:flex-row flex-col md:space-y-0 space-y-2 md:space-x-2 space-x-0 justify-between'>
													<div className='w-full flex justify-start'>
														<div
															onClick={() => onAddItem()}
															className={`${
																isAdditem ? "opacity-50" : ""
															} px-8 py-2 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70`}>
															{isAdditem ? <IconLoading /> : "Add Detail"}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								)}
								<div className='flex flex-col space-y-4 w-full'>
									{data.order_detail && data.order_detail.length > 0 ? (
										<>
											{data.order_detail.map((item, i) => {
												return (
													<>
														{item && (
															<div
																key={item.id}
																className='w-full flex items-start space-x-4'>
																<div className='flex'>{`${i + 1}.`}</div>
																<div className='flex flex-col space-y-2 w-full'>
																	<div className='flex'>
																		<span>{item.menu_name}</span>
																		<span className='px-2'>-</span>
																		<span>
																			{item.menu_price &&
																				` Rp. ${item.menu_price
																					.toString()
																					.replace(
																						/\B(?=(\d{3})+(?!\d))/g,
																						"."
																					)}`}
																		</span>
																	</div>
																	<div>
																		{item.order_detail_menu_item &&
																			item.order_detail_menu_item?.length >
																				0 && (
																				<>
																					{item.order_detail_menu_item.map(
																						(detail, i) => {
																							return (
																								<div
																									key={i}
																									className='px-0 flex space-x-2 cursor-pointer mb-2'>
																									<div>{`${i + 1}.`}</div>
																									<div className='flex space-x-4  w-full items-center'>
																										{itemMenuEdit &&
																										itemMenuEdit.id ===
																											item.id &&
																										itemMenuEdit.order_detail_id ===
																											detail.id ? (
																											<>
																												<div className='w-2/3'>
																													<Select
																														options={
																															menuItemOptions
																														}
																														isClearable={true}
																														isSearchable={true}
																														className='w-full'
																														placeholder='-- Select --'
																														defaultValue={menuItemOptions.find(
																															(opt, i) =>
																																opt.label ===
																																detail.name
																														)}
																														onChange={(e) =>
																															onSelectMenuItem({
																																value: e?.value,
																																label: e?.label,
																															})
																														}
																													/>
																												</div>
																												<div
																													className='text-xs'
																													onClick={() =>
																														onSaveEditItemMenu(
																															detail.id
																														)
																													}>
																													Done
																												</div>
																												<div
																													className='text-xs'
																													onClick={
																														onCancelEditItemMenu
																													}>
																													Cancel
																												</div>
																											</>
																										) : (
																											<>
																												<div>{detail.name}</div>
																												{!isPublish && (
																													<div
																														className='text-xs'
																														onClick={() => {
																															onEditItemMenu(
																																detail.order_detail_id,
																																detail.id
																															);
																														}}>
																														Edit
																													</div>
																												)}
																											</>
																										)}
																									</div>
																								</div>
																							);
																						}
																					)}
																				</>
																			)}
																	</div>
																</div>

																{!isPublish && (
																	<div
																		className='cursor-pointer hover:opacity-75'
																		onClick={() =>
																			item.id && onDeleteItem(item.id)
																		}>
																		<IconDelete width='20' />
																	</div>
																)}
															</div>
														)}
													</>
												);
											})}
										</>
									) : (
										<div className='flex justify-center items-center flex-col space-y-2'>
											<IconBoxOpen
												width={100}
												height={100}
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='flex w-1/3 flex-col relative'>
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
								<h3 className='font-medium text-black dark:text-white'>
									Publish
								</h3>
							</div>
							<div className='flex flex-col gap-5.5 p-6.5'>
								<div className='flex flex-col gap-2'>
									<label htmlFor='m_menu_category'>Waktu Pengiriman</label>
									{isPublish ? (
										<div className='flex space-x-2'>
											<div>
												{data.delivery_date &&
													formatShorttDate(data.delivery_date)}
											</div>
											<div>
												{data.delivery_date &&
													`${formatTime(data.delivery_date)}`}
											</div>
										</div>
									) : (
										<>
											<Datetime
												input={true}
												value={
													data.delivery_date ? new Date(data.delivery_date) : ""
												}
												className={cx(
													`w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-1 px-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary`,
													css`
														input {
															width: 100%;
														}
													`
												)}
												onChange={(e) => {
													onChange("delivery_date", e.toString());
												}}
											/>
										</>
									)}
								</div>
								<div className='flex space-x-2 justify-between'>
									<label htmlFor='name'>Status</label>
									<Badge
										label={data.status}
										state={data.status === "draft" ? "danger" : "success"}
									/>
								</div>
								<div className='flex flex-col justify-end'>
									{data.status === "draft" && (
										<button
											disabled={loadingInvoice ? true : false}
											className={`px-8 py-3 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70 ${
												loadingInvoice ? "opacity-70 cursor-wait" : ""
											}`}
											onClick={() => onPublishOrder()}>
											{loadingInvoice ? <IconLoading /> : `Buat Invoice`}
										</button>
									)}

									{data.status === "published" && (
										<button
											disabled={loadingInvoice ? true : false}
											className={`px-8 py-3 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70 ${
												loadingInvoice ? "opacity-70 cursor-wait" : ""
											}`}
											onClick={() => onChangeState("deleted")}>
											Delete
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default Form;
