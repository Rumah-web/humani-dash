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
import { m_menu_category } from "@prisma/client";
import Image from "next/image";
import draftToHtml from "draftjs-to-html";
import { useRouter } from "next/navigation";
import { convertBase64 } from "@/app/lib/helper";
import Select from "react-select";
import { IOptionsSelect, ISession } from "@/app/type";
import { PageContext } from "@/app/context";
import Page403 from "@/components/Auth/403";
import { IconDelete } from "@/components/Icons";
import { toast } from "react-toastify";

const Editor = dynamic(
	() => import("react-draft-wysiwyg").then((mod) => mod.Editor),
	{ ssr: false }
);

const Form = () => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [file, setFile] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [istBase64, setBase64] = useState(false);
	const [isLoadingUpload, setLoadingUpload] = useState(false);
	const [published, setPublished] = useState(false);
	const [data, setData] = useState({} as m_menu_category);
	const [options, setOptions] = useState([] as IOptionsSelect[]);
	const [optionsShow, setOptionsShow] = useState([] as IOptionsSelect[]);
	const [dataField, setDataField] = useState({});
	const router = useRouter();

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

	const fileTypes = ["JPG", "PNG", "JPEG"];

	const onEditorStateChange = (editorState: any) => {
		if (editorState) setEditorState(editorState);
	};

	const handleChangeFile = async (file: any) => {
		setLoadingUpload(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("uuid", data.uuid);

		const base64 = (await convertBase64(file)) as any;

		setFile(base64);
		setBase64(true);

		await fetch("/menu-category/api/upload-file", {
			method: "POST",
			body: formData,
		});

		setLoadingUpload(false);
	};

	const onUpdateByField = async (data: any) => {
		await fetch("/menu-category/api/update-field", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid, data }),
			headers: {
				"content-type": "application/json",
			},
		});
	};

	const onChange = async (column: string, value: any) => {
		const fieldValue = typeof value === "undefined" ? null : value;
		const params = {
			[column]: ["order"].includes(column) ? parseInt(fieldValue) : fieldValue,
		};
		setData({ ...data, ...params });
		setDataField(params);
	};

	const onChangeState = async (status: string) => {
		setPublished(true);
		await fetch("/menu-category/api/change-state", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid, status }),
			headers: {
				"content-type": "application/json",
			},
		});
		setPublished(false);

		router.push(`/menu-category`);
	};

	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			await onUpdateByField(dataField);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [data, 500]);

	useEffect(() => {
		(async () => {
			const req = await fetch("/menu-category/api/by-uuid", {
				method: "POST",
				body: JSON.stringify({ uuid: params.uuid }),
				headers: {
					"content-type": "application/json",
				},
			});

			const parentOptions = await fetch("/menu-category/api/parent", {
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
					setFile(file);
				}

				if (parentOptions) {
					const parentData = await parentOptions.json();
					setOptions(parentData.data);
				}

				setOptionsShow([
					{ label: "Yes", value: true },
					{ label: "No", value: false },
				]);

				setEditorState(
					EditorState.createWithContent(
						ContentState.createFromBlockArray(
							convertFromHTML(data.description) as any
						)
					)
				);
				setLoading(false);
			}
		})();
	}, []);

	const onDeleteFoto = async (id: number) => {
		if (window.confirm(`Yakin ingin menghapus foto ini ?`)) {
			setFile(null);
			await fetch("/menu-category/api/delete-file", {
				method: "POST",
				body: JSON.stringify({ uuid: params.uuid }),
			});

			toast('sukses', {type: 'success'})
		}
	};

	const onSaveEditor = async () => {
		const raw = convertToRaw(editorState.getCurrentContent());
		await onUpdateByField({ description: draftToHtml(raw) });
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
									Category Information
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
									<label htmlFor='m_menu_category_id'>Parent</label>
									<Select
										options={options}
										isClearable={true}
										isSearchable={true}
										defaultValue={options.find(
											(opt, i) => opt.value === data.parent_id
										)}
										onChange={(e) => onChange("parent_id", e?.value)}
									/>
								</div>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='m_menu_category_id'>Show In Price Menu</label>
									<Select
										options={optionsShow}
										defaultValue={optionsShow.find(
											(opt, i) => opt.value === data.is_show
										)}
										onChange={(e) => onChange("is_show", e?.value)}
									/>
								</div>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Order</label>
									<input
										{...register("order", { required: true })}
										value={data.order as number}
										type='number'
										className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
										onChange={(e) => onChange("order", e.target.value)}
									/>
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
										onBlur={onSaveEditor}
									/>
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
								<div className='flex space-x-2 justify-between'>
									<label htmlFor='name'>Status</label>
									<Badge
										label={data.status}
										state={data.status === "draft" ? "danger" : "success"}
									/>
								</div>
								<div className='mt-4 flex flex-col space-y-2'>
									<label htmlFor='name'>Cover</label>
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
										<div className='relative'>
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
																	src={`${file}${
																		istBase64 ? `` : `?width=200`
																	}`}
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
											{file && (
												<div
													className='absolute top-0 right-0 p-2 cursor-pointer hover:opacity-70'
													onClick={() => onDeleteFoto(data.id)}>
													<IconDelete width='20' />
												</div>
											)}
										</div>
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
