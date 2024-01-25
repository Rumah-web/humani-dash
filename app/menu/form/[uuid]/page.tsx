"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import { EditorState, ContentState, convertFromHTML } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Badge from "@/components/Badges";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Loading from "@/components/Table/Loading";
import { m_menu } from "@prisma/client";
import { NumericFormat } from "react-number-format";
import Image from "next/image";

const Editor = dynamic(
	() => import("react-draft-wysiwyg").then((mod) => mod.Editor),
	{ ssr: false }
);

const Form = () => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [file, setFile] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isLoadingUpload, setLoadingUpload] = useState(true);
	const [data, setData] = useState({} as m_menu);

	const params = useParams<{ uuid: string }>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const fileTypes = ["JPG", "PNG"];

	const onEditorStateChange = (editorState: any) => {
		setEditorState(editorState);
	};

	const handleChangeFile = async (file: any) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("uuid", data.uuid);

		setLoadingUpload(true);

		const upload = await fetch("/menu/api/upload-file", {
			method: "POST",
			body: formData,
		});

		if (upload) {
			const { data } = await upload.json();
			setFile(data.path);

			setLoadingUpload(false);
		}

		console.log("file : ", file);
	};

	useEffect(() => {
		(async () => {
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
				setFile(file.path);
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
						<div className='flex flex-col space-y-2'>
							<label htmlFor='name'>Name</label>
							<input
								{...register("name", { required: true })}
								value={data.name}
								className='w-full py-2 px-3 '
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
							/>
						</div>
						<div className='flex flex-col space-y-2'>
							<label htmlFor='name'>Price</label>
							<NumericFormat
								prefix={"Rp."}
								value={data.price as any}
								allowLeadingZeros
								thousandSeparator=','
								className='w-full py-2 px-3'
							/>
							{errors.price && <p>Please enter number for price.</p>}
						</div>
						<div className='flex flex-col space-y-2'>
							<label htmlFor='name'>Discount Price</label>
							<NumericFormat
								prefix={"Rp."}
								value={data.price_promo as any}
								allowLeadingZeros
								thousandSeparator=','
								className='w-full py-2 px-3'
							/>
							{errors.price && <p>Please enter number for discount price.</p>}
						</div>
					</div>
					<div className='flex w-1/3 flex-col space-y-4 p-4 relative'>
						<div className='flex space-x-2 justify-between'>
							<label htmlFor='name'>Status</label>
							<Badge
								label={data.status}
								state={data.status === "draft" ? "danger" : "success"}
							/>
						</div>
						<div className='mt-4'>
							<FileUploader
								handleChange={handleChangeFile}
								name='file'
								types={fileTypes}>
								<div
									className={`border border-dashed border-primary cursor-pointer hover:opacity-60`}>
									{file ? (
										<>
											<div className={`flex justify-center h-36 relative`}>
												<Image
													src={"/" + file}
													alt={data.name}
													width={100}
													height={100}
													className="w-fit"
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
						</div>
						<div className='flex flex-col justify-end'>
							{data.status === "draft" && (
								<input
									type='submit'
									value={"Publish"}
									className='px-8 py-3 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
								/>
							)}

							{data.status === "published" && (
								<input
									type='submit'
									value={"Update"}
									className='px-8 py-3 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
								/>
							)}
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default Form;
