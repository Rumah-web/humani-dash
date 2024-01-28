"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Badge from "@/components/Badges";
import { useParams } from "next/navigation";
import Loading from "@/components/Table/Loading";
import { m_user } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Select from 'react-select'

const Form = () => {
	
	const [file, setFile] = useState(null);
	const [isLoading, setLoading] = useState(true);
	const [isLoadingUpload, setLoadingUpload] = useState(false);
	const [published, setPublished] = useState(false);
	const [data, setData] = useState({} as m_user);
	const [dataField, setDataField] = useState({});
	const router = useRouter();
	const [userData, setUserData] = useState(null as any);
	const [roles, setRoles] = useState([] as {value: string, label: string}[]);

	const params = useParams<{ uuid: string }>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const fileTypes = ["JPG", "PNG"];

	const getRoles = async () => {
		const req = await fetch("/users/api/roles", {
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
	}


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

	const handleChangeFile = async (file: any) => {
		setLoadingUpload(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("uuid", data.uuid);

		const upload = await fetch("/users/api/upload-file", {
			method: "POST",
			body: formData,
		});

		if (upload) {
			const { data } = await upload.json();
			setFile(data.path);

			setLoadingUpload(false);
		}
	};

	const onUpdateByField = async (data: any) => {
		await fetch("/users/api/update-field", {
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

	const onChangeState = async (status: string) => {
		setPublished(true);
		await fetch("/users/api/change-state", {
			method: "POST",
			body: JSON.stringify({ uuid: params.uuid, status }),
			headers: {
				"content-type": "application/json",
			},
		});
		setPublished(false);

		router.push(`/users`);
	};

	useEffect(() => {
		const timeoutId = setTimeout(async () => {
			await onUpdateByField(dataField);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, [data, 500]);

	useEffect(() => {
		(async () => {
			const req = await fetch("/users/api/by-uuid", {
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
				
				setLoading(false);
			}

			const session = await getSession();
			setUserData(session);

			const roles = await getRoles()

			if(roles.length > 0) {
				setRoles(roles.map((rol: any, i: number) => {
					return {
						value: rol.id,
						label: rol.name
					}
				}))
			}
			


		})();

	}, []);

	const onChangeRoles = (val: any) => {
		console.log('SELE : ', val)
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
						<div className='flex flex-col space-y-2'>
							<label htmlFor='name'>Name</label>
							<input
								{...register("name", { required: true })}
								value={data.name ? data.name : ''}
								className='w-full py-2 px-3'
								onChange={(e) => onChange("name", e.target.value)}
							/>
						</div>
						<div className='flex flex-col space-y-2'>
							<label htmlFor='email'>Email</label>
							<input
								{...register("email", { required: true })}
								value={data.email ? data.email : ''}
								className='w-full py-2 px-3'
								onChange={(e) => onChange("email", e.target.value)}
							/>
						</div>
						<div className='flex flex-col space-y-2'>
							<label htmlFor='email'>Roles</label>
							<Select 
								options={roles}
								onChange={onChangeRoles}
      							isMulti />
						</div>
						<div className='flex flex-col space-y-2'>
							<label htmlFor='username'>Username</label>
							<input
								{...register("username", { required: true })}
								value={data.username ? data.username : ''}
								className='w-full py-2 px-3'
								onChange={(e) => onChange("username", e.target.value)}
							/>
						</div>
						<div className='flex flex-col space-y-2'>
							<label htmlFor='password'>Password</label>
							<input
								{...register("password", { required: true })}
								value={data.password ? data.password : ''}
								type="password"
								className='w-full py-2 px-3'
								onChange={(e) => onChange("password", e.target.value)}
							/>
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
						<div className='mt-4 flex flex-col space-y-2'>
							<label htmlFor='name'>Foto Profile</label>
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
													<div className={`flex justify-center h-36 relative`}>
														<Image
															src={"/" + file}
															alt={data.username}
															width={100}
															height={100}
															priority={false}
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
									onClick={() => onChangeState('active')}>
									Activate
								</button>
							)}

							{data.status === "active" && (
								<button
									disabled={published ? true : false}
									className={`px-8 py-3 bg-danger rounded-lg text-white text-xs cursor-pointer hover:opacity-70 ${
										published ? "opacity-70 cursor-wait" : ""
									}`}
									onClick={() => onChangeState('inactive')}>
									Set Not Active
								</button>
							)}
						</div>
					</div>
				</form>
			</div>
		</>
	);
};

export default Form;
