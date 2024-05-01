"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import {
	EditorState,
	ContentState,
	convertFromHTML,
	convertFromRaw,
	convertToRaw,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Badge from "@/components/Badges";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Loading from "@/components/Table/Loading";
import { m_item, m_menu, m_menu_item } from "@prisma/client";
import { NumericFormat } from "react-number-format";
import Image from "next/image";
import draftToHtml from "draftjs-to-html";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { IOptionsSelect } from "@/app/type";
import { convertBase64 } from "@/app/lib/helper";
import { IconDelete } from "@/components/Icons";

const Editor = dynamic(
	() => import("react-draft-wysiwyg").then((mod) => mod.Editor),
	{ ssr: false }
);

const Form = () => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [file, setFile] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isLoadingUpload, setLoadingUpload] = useState(false);
	const [isAdditem, setAdditem] = useState(false);
	const [isBase64, setBase64] = useState(false);
	const [published, setPublished] = useState(false);
	const [data, setData] = useState(
		{} as m_menu & { m_menu_item: Partial<m_menu_item & { m_item: m_item }>[] }
	);
	const [menuItem, setMenuitem] = useState([] as m_menu_item[]);
	const [itemsOptions, setItemsOptions] = useState([] as IOptionsSelect[]);
	const [dataField, setDataField] = useState({});
	const [options, setOptions] = useState([] as IOptionsSelect[]);
	const [valueOption, setValueOption] = useState({} as IOptionsSelect);
	const router = useRouter();

	const params = useParams<{ uuid: string }>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const fileTypes = ["JPG", "PNG", "JPEG"];

	const onEditorStateChange = (editorState: any) => {
		setEditorState(editorState);
	};

	const handleChangeFile = async (file: any) => {
		setLoadingUpload(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("uuid", data.uuid);

		const base64 = (await convertBase64(file)) as any;

		setFile(base64);
		setBase64(true);

		await fetch("/menu/api/upload-file", {
			method: "POST",
			body: formData,
		});

		setLoadingUpload(false);
	};

	const onUpdateByField = async (data: any) => {
		await fetch("/menu/api/update-field", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid, data }),
			headers: {
				"content-type": "application/json",
			},
		});
	};

	const onChange = async (column: string, value: any) => {
		const params = { [column]: value };
		setData({ ...data, ...params });
		setDataField(params);
	};

	const onChangeItem = async (column: string, value: any, id: any) => {
		const params = { [column]: value };

		const update = await fetch("/menu/api/update-menu-item", {
			method: "POST",
			body: JSON.stringify({ id, data: params }),
			headers: {
				"content-type": "application/json",
			},
		});

		const updateItems = await update.json();
	};

	const onChangeState = async (status: string) => {
		setPublished(true);
		await fetch("/menu/api/change-state", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid, status }),
			headers: {
				"content-type": "application/json",
			},
		});
		setPublished(false);

		router.push(`/menu`);
	};

	useEffect(() => {
		const timeoutIdDesc = setTimeout(async () => {
			const raw = convertToRaw(editorState.getCurrentContent());
			await onUpdateByField({ description: draftToHtml(raw) });
		}, 500);
		return () => clearTimeout(timeoutIdDesc);
	}, [editorState, 500]);

	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			await onUpdateByField(dataField);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [data, 500]);

	useEffect(() => {
		(async () => {
			const reqCategory = await fetch("/menu/api/menu-category", {
				method: "POST",
				body: JSON.stringify({}),
				headers: {
					"content-type": "application/json",
				},
			});

			const reqItems = await fetch("/menu/api/list-items", {
				method: "POST",
				body: JSON.stringify({}),
				headers: {
					"content-type": "application/json",
				},
			});

			const req = await fetch("/menu/api/by-uuid", {
				method: "POST",
				body: JSON.stringify({ uuid: params.uuid }),
				headers: {
					"content-type": "application/json",
				},
			});

			if (req) {
				const { data, file } = await req.json();
				setData(data);
				if (file) {
					setFile(file.path);
				}

				setEditorState(
					EditorState.createWithContent(
						ContentState.createFromBlockArray(
							convertFromHTML(data.description) as any
						)
					)
				);
				if (reqCategory) {
					const category = await reqCategory.json();
					setOptions(category.data);
					setValueOption(
						category.data.find(
							(opt: IOptionsSelect, i: number) =>
								opt.value === data.m_menu_category_id
						)
					);
				}

				if (reqItems) {
					const listItem = await reqItems.json();
					setItemsOptions(listItem.data);
				}

				setLoading(false);
			}
		})();
	}, []);

	const onAddItem = async () => {
		setAdditem(true);

		const addItem = await fetch("/menu/api/add-menu-item", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid }),
			headers: {
				"content-type": "application/json",
			},
		});

		const menuitem = await addItem.json();
		if (menuitem) {
			setData({ ...data, m_menu_item: [...data.m_menu_item, menuitem.data] });
		}
	};

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
									Menu Information
								</h3>
							</div>
							<div className='flex flex-col gap-5.5 p-6.5'>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Name</label>
									<input
										{...register("name", { required: true })}
										value={data.name}
										className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
										onChange={(e) => onChange("name", e.target.value)}
									/>
								</div>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='m_menu_category_id'>Category</label>
									<Select
										options={options}
										defaultValue={options.find(
											(opt, i) => opt.value === data.m_menu_category_id
										)}
										onChange={(e) => onChange("m_menu_category_id", e?.value)}
									/>
								</div>

								<div className='flex md:flex-row flex-col md:space-y-0 space-y-2 md:space-x-2 space-x-0 justify-between'>
									<div className='flex flex-col space-y-2 w-full'>
										<label htmlFor='name'>Min Order</label>
										<NumericFormat
											value={data.min_qty as any}
											name='min_qty'
											allowLeadingZeros
											thousandSeparator=','
											className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
											onValueChange={(values, sourceInfo) => {
												onChange("price_promo", values.value);
											}}
										/>
									</div>
									<div className='flex flex-col space-y-2 w-full'>
										<label htmlFor='name'>Max Order</label>
										<NumericFormat
											value={data.max_qty as any}
											name='max_qty'
											allowLeadingZeros
											thousandSeparator=','
											className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
											onValueChange={(values, sourceInfo) => {
												onChange("price_promo", values.value);
											}}
										/>
									</div>
								</div>

								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Description</label>
									<Editor
										editorState={editorState}
										editorStyle={{ height: "400px" }}
										toolbarClassName='toolbarClassName'
										wrapperClassName='wrapperClassName'
										editorClassName='px-4 border border-[#dfdfdf] bg-white'
										onEditorStateChange={onEditorStateChange}
									/>
								</div>
							</div>
						</div>
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
								<h3 className='font-medium text-black dark:text-white'>Item</h3>
							</div>
							<div className='flex flex-col gap-5.5 p-6.5'>
								<div className='flex flex-col space-y-4 w-full'>
									{data.m_menu_item && data.m_menu_item.length > 0 && (
										<>
											{data.m_menu_item.map((item, i) => {
												console.log("items : ", item);
												return (
													<div
														key={item.id}
														className='w-full flex items-center space-x-4'>
														<div className='flex flex-col w-full'>
															<div className='flex w-full'>
																<Select
																	options={itemsOptions}
																	className='w-full'
																	defaultValue={itemsOptions.find(
																		(opt, i) => opt.value === item.m_item_id
																	)}
																	onChange={(e) =>
																		onChangeItem("m_item_id", e?.value, item.id)
																	}
																/>
															</div>
														</div>
														<div className='cursor-pointer hover:opacity-75'>
															<IconDelete />
														</div>
													</div>
												);
											})}
										</>
									)}
									{/* {isAdditem ? "Add" : "Hide"} */}
								</div>
								<div className='flex md:flex-row flex-col md:space-y-0 space-y-2 md:space-x-2 space-x-0 justify-between'>
									<div className='w-full flex justify-start'>
										<div
											className='px-8 py-2 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
											onClick={onAddItem}>
											Add Item
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
								<h3 className='font-medium text-black dark:text-white'>
									Price
								</h3>
							</div>
							<div className='flex flex-col gap-5.5 p-6.5'>
								<div className='flex md:flex-row flex-col md:space-y-0 space-y-2 md:space-x-2 space-x-0 justify-between'>
									<div className='flex flex-col space-y-2 w-full'>
										<label htmlFor='name'>Price</label>
										<NumericFormat
											prefix={"Rp."}
											value={data.price as any}
											name='price'
											allowLeadingZeros
											thousandSeparator=','
											className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
											onValueChange={(values, sourceInfo) => {
												onChange("price", values.value);
											}}
										/>
									</div>
									<div className='flex flex-col space-y-2 w-full'>
										<label htmlFor='name'>Discount Price</label>
										<NumericFormat
											prefix={"Rp."}
											value={data.price_promo as any}
											name='price_promo'
											allowLeadingZeros
											thousandSeparator=','
											className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
											onValueChange={(values, sourceInfo) => {
												onChange("price_promo", values.value);
											}}
										/>
									</div>
								</div>
							</div>
							<div className='flex flex-col gap-5.5 p-6.5'>
								<div className='flex md:flex-row flex-col md:space-y-0 space-y-2 md:space-x-2 space-x-0 justify-between'>
									List Tiered
								</div>
								<div className='flex md:flex-row flex-col md:space-y-0 space-y-2 md:space-x-2 space-x-0 justify-between'>
									<div className='w-full flex justify-start'>
										<div
											className='px-8 py-2 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
											onClick={() => {}}>
											Add Tiered
										</div>
									</div>
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
							<div className='flex flex-col gap-5.5 p-6.5 space-y-2'>
								<div className='flex space-x-2 justify-between'>
									<label htmlFor='name'>Status</label>
									<Badge
										label={data.status}
										state={data.status === "draft" ? "danger" : "success"}
									/>
								</div>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Foto Menu</label>
									{isLoadingUpload ? (
										<>
											<div
												className={`border border-dashed border-primary cursor-pointer hover:opacity-60`}>
												<div className='flex flex-col text-primary items-center justify-center py-12 text-center'>
													<Loading />
												</div>
											</div>
										</>
									) : (
										<>
											<FileUploader
												handleChange={handleChangeFile}
												name='file'
												types={fileTypes}>
												<div
													className={`border border-dashed border-primary cursor-pointer hover:opacity-60`}>
													{file ? (
														<>
															<div
																className={`flex justify-center h-36 relative`}>
																<Image
																	src={`${file}${isBase64 ? `` : `?width=200`}`}
																	alt={data.name}
																	width={100}
																	height={100}
																	priority={false}
																	unoptimized
																	className='w-fit'
																/>
															</div>
														</>
													) : (
														<>
															<div className='flex flex-col text-primary items-center justify-center py-16 text-center'>
																<svg
																	className='w-6 h-6 mr-1 text-current-50'
																	xmlns='http://www.w3.org/2000/svg'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth='2'
																		d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
																	/>
																</svg>
																<p className='mt-2 text-xs text-graydark'>
																	Drag your files here or click in this area.
																</p>
															</div>
														</>
													)}
												</div>
											</FileUploader>
										</>
									)}
								</div>
								<div className='flex flex-col justify-end'>
									{data.status === "draft" && (
										<button
											disabled={published ? true : false}
											className={`px-8 py-3 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70 ${
												published ? "opacity-70 cursor-wait" : ""
											}`}
											onClick={() => onChangeState("published")}>
											Publish
										</button>
									)}

									{data.status === "published" && (
										<button
											disabled={published ? true : false}
											className={`px-8 py-3 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70 ${
												published ? "opacity-70 cursor-wait" : ""
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
