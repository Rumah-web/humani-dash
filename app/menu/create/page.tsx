"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { EditorState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Badge from "@/components/Badges";
import dynamic from 'next/dynamic';

const Editor = dynamic(
    () => import('react-draft-wysiwyg').then(mod => mod.Editor),
    { ssr: false })

const Create = () => {
	const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [file, setFile] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const fileTypes = ["JPG", "PNG"];

	const options = [
		{ value: "draft", label: "Draft" },
		{ value: "published", label: "Publish" },
	];

	const onEditorStateChange = (editorState: any) => {
		setEditorState(editorState);
	};

	const handleChangeFile = (file: any) => {
		setFile(file);
        console.log('file : ', file)
	};

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
							<input
								type='number'
								{...register("price", { pattern: /\d+/ })}
								className='w-full py-2 px-3'
							/>
							{errors.price && <p>Please enter number for price.</p>}
						</div>
						<div className='flex flex-col space-y-2'>
							<label htmlFor='name'>Discount Price</label>
							<input
								type='number'
								{...register("price_promo", { pattern: /\d+/ })}
								className='w-full py-2 px-3'
							/>
							{errors.price && <p>Please enter number for discount price.</p>}
						</div>
					</div>
					<div className='flex w-1/3 flex-col space-y-4 p-4 relative'>
						<div className='flex space-x-2 justify-between'>
							<label htmlFor='name'>Status</label>
							<Badge
								label='draft'
								state={"draft" ? "danger" : "success"}
							/>
						</div>
						<div className="mt-4">
							<FileUploader
								handleChange={handleChangeFile}
								name='file'
								types={fileTypes}>
								<div className="border border-dashed border-primary cursor-pointer hover:opacity-60">
									<div className='flex flex-col text-primary items-center justify-center py-16 text-center'>
										<svg
											className='w-6 h-6 mr-1 text-current-50'
											xmlns='http://www.w3.org/2000/svg'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'>
											<path
												stroke-linecap='round'
												stroke-linejoin='round'
												stroke-width='2'
												d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
											/>
										</svg>
										<p className='mt-2 text-xs text-graydark'>
											Drag your files here or click in this area.
										</p>
									</div>
								</div>
							</FileUploader>
						</div>
						<div className='flex flex-col justify-end'>
							<input
								type='submit'
								value={"Publish"}
								className='px-8 py-3 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70'
							/>
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default Create;
