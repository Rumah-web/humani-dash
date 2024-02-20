import db from "@/prisma/lib/db";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import { m_files } from "@prisma/client";
import { IUpload } from "@/app/type";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const formData = (await request.formData()) as any;
	const assets_api = process.env.API_ASSETS_HOST + "/view";

	// Get params from the form data
	const file = formData.get("file");
	const uuid = formData.get("uuid");

	let data = null as any;

	// Check if a file is received
	if (!file) {
		// If no file is received, return a JSON response with an error and a 400 status code
		return Response.json({ error: "No files received." }, { status: 400 });
	}

	try {
		/* Send request to another server */
		const upload = await fetch(`${process.env.API_ASSETS_HOST}/upload`, {
			method: "POST",
			body: formData,
		});

		const file: IUpload = await upload.json();

		if (file) {
			const findByUUID = await db.m_user.findFirst({
				select: {
					id: true,
					uuid: true,
					image: true,
					m_files: {
						select: {
							id: true,
							path: true,
						},
					},
				},
				where: {
					uuid,
				},
			});

			let m_files = {} as m_files;
			if (findByUUID?.image) {
				m_files = await db.m_files.update({
					data: {
						name: file.name,
						size: file.size,
						type: file.type,
						path: file.path,
					},
					where: {
						id: findByUUID.image,
					},
				});
			} else {
				m_files = await db.m_files.create({
					data: {
						name: file.name,
						size: file.size,
						type: file.type,
						path: file.path,
					},
				});
			}

			if (m_files) {
				if (!findByUUID?.image) {
					const update = await db.m_user.update({
						where: {
							id: findByUUID?.id,
						},
						data: {
							image: m_files.id,
						},
					});

					if (update) {
						data = { ...m_files, path: assets_api + "/" + m_files.uuid };

						return Response.json({
							data,
							message: "Success",
							status: 200,
						});
					}
				} else {
					data = { ...m_files, path: assets_api + "/" + m_files.uuid };

					return Response.json({
						data,
						message: "Success",
						status: 200,
					});
				}
			}
		}

		// Return a JSON response with a success message and a 201 status code
		return Response.json({ message: "Success", status: 201 });
	} catch (error) {
		// If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
		console.log("Error occurred ", error);
		return Response.json({ message: "Failed", status: 500 });
	}
}
