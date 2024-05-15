"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useForm } from "react-hook-form";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Loading from "@/components/Table/Loading";
import { m_menu_category, order_status_history } from "@prisma/client";
import { useRouter } from "next/navigation";
import { PageContext } from "@/app/context";
import { ISession } from "@/app/type";
import Page403 from "@/components/Auth/403";
import { toast } from "react-toastify";

const Form = () => {
	const [isLoading, setLoading] = useState(true);
	const [published, setPublished] = useState(false);
	const [data, setData] = useState([] as Partial<order_status_history>[]);
	const [listStatusAvailable, setListStatusAvailable] = useState([] as any);
	const [dataField, setDataField] = useState({});
	const router = useRouter();

	const params = useParams<{ uuid_order: string }>();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const paramsPage = React.useContext(PageContext) as any;

	let session: ISession | null = null;

	const listStatus = [
		"new",
		"prepare",
		"cooking",
		"packing",
		"delivery",
		"finished",
	];

	if (paramsPage.session) {
		session = paramsPage.session;
	}

	useEffect(() => {
		(async () => {
			const req = await fetch("/process-order/api/list", {
				method: "POST",
				body: JSON.stringify({ uuid: params.uuid_order }),
				headers: {
					"content-type": "application/json",
				},
			});

			if (req) {
				const { data, file } = await req.json();
				setData(data);
				setLoading(false);

				setListStatusAvailable(
					listStatus.filter(
						(item, i) =>
							!data
								.map((dt: any, x: number) => {
									return dt.status;
								})
								.includes(item)
					)
				);
			}
		})();
	}, []);

	const onUpdateProcess = async (status: string) => {
		if (listStatusAvailable.length > 0) {
			const currentAvailable = listStatusAvailable[0];
			if (currentAvailable === status) {
				const update = await fetch("/process-order/api/update-status", {
					method: "POST",
					body: JSON.stringify({ uuid: params.uuid_order, status }),
					headers: {
						"content-type": "application/json",
					},
				});

				if (update) {
					const dtUpdate = [...data, { status }]
					setData(dtUpdate);
					setListStatusAvailable(
						listStatus.filter(
							(item, i) =>
								!dtUpdate
									.map((dt: any, x: number) => {
										return dt.status;
									})
									.includes(item)
						)
					);
					const dataUpdate = await update.json();
					toast(dataUpdate.message, { type: "success" });
				}
			} else {
				toast("Proses harus teratur", { type: "error" });
			}
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
				pageName='Process Order'
				breadLinks={[
					{ label: "Order", url: `/order/form/${params.uuid_order}` },
				]}
			/>
			<div className='pb-36'>
				<form
					onSubmit={handleSubmit((data) => console.log(data))}
					className='flex space-x-4 relative'>
					<div className='flex w-full flex-col space-y-6'>
						<div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
							<div className='flex px-24 py-12'>
								<div className='flex w-full items-center'>
									{listStatus.map((status, i) => {
										const isLast = i + 1 === listStatus.length;
										return (
											<div
												key={i}
												className={`flex justify-between ${
													!isLast && "w-full"
												}`}>
												<div
													className={`flex items-center text-sm px-4 py-2 rounded-lg capitalize ${
														data.filter((item, i) => item.status === status)
															.length > 0
															? `bg-success text-white cursor-default`
															: `bg-gray text-graydark cursor-pointer hover:underline hover:bg-gray-3`
													}`}
													onClick={() =>
														listStatusAvailable.includes(status) &&
														onUpdateProcess(status)
													}>
													{status}
												</div>
												{!isLast && (
													<div className='w-full flex justify-center items-center'>
														&#10141;
													</div>
												)}
											</div>
										);
									})}
									{/* <div>{JSON.stringify(data.length)}</div> */}
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
