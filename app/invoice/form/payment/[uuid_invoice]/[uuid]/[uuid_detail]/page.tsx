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
import Image from "next/image";
import draftToHtml from "draftjs-to-html";
import { useRouter } from "next/navigation";
import { convertBase64 } from "@/app/lib/helper";
import Select from "react-select";
import { IOptionsSelect, ISession } from "@/app/type";
import { invoice, payment, payment_detail } from "@prisma/client";
import { NumericFormat } from "react-number-format";
import { PageContext } from "@/app/context";
import Page403 from "@/components/Auth/403";

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
	const [paid, setPaid] = useState(false);
	const [data, setData] = useState(
		{} as Partial<payment_detail & { payment: payment & { invoice: invoice } }>
	);
	const [options, setOptions] = useState([] as IOptionsSelect[]);
	const [paidOptions, setPaidOptions] = useState([] as IOptionsSelect[]);
	const [dataField, setDataField] = useState({});
	const router = useRouter();

	const params = useParams<{ uuid_invoice: string; uuid: string; uuid_detail: string }>();

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
		formData.append("uuid", data.uuid as any);

		const base64 = (await convertBase64(file)) as any;

		setFile(base64);
		setBase64(true);

		await fetch("/payment-detail/api/upload-file", {
			method: "POST",
			body: formData,
		});

		setLoadingUpload(false);
	};

	const onUpdateByField = async (data: any) => {
		if (Object.keys(data).length > 0) {
			await fetch("/payment-detail/api/update-field", {
				method: "POST",
				body: JSON.stringify({ uuid: params.uuid_detail, data }),
				headers: {
					"content-type": "application/json",
				},
			});
		}
	};

	const onSetPaid = async (val: string) => {
		if (val === "yes") {
			setPaid(true);
		} else {
			setPaid(false);
		}
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
		await fetch("/payment-detail/api/change-state", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid, status }),
			headers: {
				"content-type": "application/json",
			},
		});

		router.push(`/invoice/${params.uuid}`);
	};

	const onSaveEditor = async () => {
		const raw = convertToRaw(editorState.getCurrentContent());
		await onUpdateByField({ description: draftToHtml(raw) });
	};

	const onPublish = async () => {
		setPublished(true);
		const publishOrder = await fetch("/payment-detail/api/publish", {
			method: "POST",
			body: JSON.stringify({ uuid: data.uuid, paid }),
			headers: {
				"content-type": "application/json",
			},
		});

		if (publishOrder) {
			const res = await publishOrder.json();

			setPublished(false);
			if (res.success) {
				router.push(`/invoice/form/${res.data.payment?.invoice.uuid}`);
			} else {
				alert("Terjadi Kesalahan");
			}
		}
	};

	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			await onUpdateByField(dataField);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [data, 500]);

	useEffect(() => {
		(async () => {
			const opt = [
				{ label: "Transfer", value: "manual_transfer" },
				{ label: "Cash", value: "cash" },
			];
			setOptions(opt);

			const paidOptions = [
				{ label: "Yes", value: "yes" },
				{ label: "No", value: "no" },
			];

			setPaidOptions(paidOptions);

			const req = await fetch("/payment-detail/api/by-uuid", {
				method: "POST",
				body: JSON.stringify({ uuid: params.uuid_detail }),
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

				if (data.description) {
					setEditorState(
						EditorState.createWithContent(
							ContentState.createFromBlockArray(
								convertFromHTML(data.description) as any
							)
						)
					);
				}

				setLoading(false);
			}
		})();
	}, []);

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
			<Breadcrumb
				pageName='Payment'
				breadLinks={[{ label: "Invoice", url: `/invoice/form/${params.uuid_invoice}` }]}
			/>
			<div className='pb-36'>
				<form
					onSubmit={handleSubmit((data) => console.log(data))}
					className='flex space-x-4 relative'>
					<div className='flex w-2/3 flex-col space-y-6'>
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
								<h3 className='font-medium text-black dark:text-white'>
									Payment
								</h3>
							</div>
							<div className='flex flex-col gap-5.5 p-6.5'>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Payment Method</label>
									<Select
										options={options}
										isSearchable={true}
										defaultValue={options.find(
											(opt, i) => opt.value === data.payment_method
										)}
										onChange={(e) => onChange("payment_method", e?.value)}
									/>
								</div>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Nominal</label>
									<NumericFormat
										value={data.nominal as any}
										name='nominal'
										allowLeadingZeros
										thousandSeparator=','
										className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
										onValueChange={(values, sourceInfo) => {
											onChange(
												"nominal",
												typeof values.value === "string"
													? parseInt(values.value)
													: values.value
											);
										}}
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
										label={data.status === "draft" ? "Not Verified" : "Success"}
										state={data.status === "draft" ? "danger" : "success"}
									/>
								</div>
								<div className='flex-1 flx-col space-y-2'>
									<label htmlFor='name'>Pelunasan</label>
									<Select
										options={paidOptions}
										onChange={(e) => onSetPaid(e?.value)}
									/>
								</div>
								<div className='flex flex-col space-y-2'>
									<label htmlFor='name'>Bukti Bayar</label>
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
																	src={`${file}${
																		istBase64 ? `` : `?width=200`
																	}`}
																	alt={data.description || ""}
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
											onClick={() => onPublish()}>
											Verified
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
