import db from "@/prisma/lib/db";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs";
import { m_files } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const formData = (await request.formData()) as any;
	const mediaPath = process.env.PATH_UPLOAD;
	const dirUploadPath = process.env.DIR_UPLOAD;

	// Get params from the form data
	const file = formData.get("file");
	const uuid = formData.get("uuid");

	let date = new Date();
	let data = null as any;

	// Check if a file is received
	if (!file) {
		// If no file is received, return a JSON response with an error and a 400 status code
		return Response.json({ error: "No files received." }, { status: 400 });
	}

	// Convert the file data to a Buffer
	const buffer = Buffer.from(await file.arrayBuffer());

	// Replace spaces in the file name with underscores
	const filename =
		Date.now() +
		"_" +
		Math.random().toString().substring(2) +
		path.extname(file.name);

	try {
		// Write the file to the specified directory (public/assets) with the modified filename
		const uploadPath =
			date.getFullYear() +
			"/" +
			("0" + (date.getMonth() + 1)).slice(-2) +
			"/" +
			date.getDay().toString().padStart(2, "0");
		fs.mkdirSync(mediaPath + "/" + uploadPath, { recursive: true });
		fs.writeFileSync(
			path.join(process.cwd(), mediaPath + "/" + uploadPath + "/" + filename),
			buffer
		);

		const findMenuByUUID = await db.m_menu.findFirst({
			select: {
				id: true,
				uuid: true,
				m_menu_files: {
					select: {
						m_files_id: true,
					},
					take: 1,
				},
			},
			where: {
				uuid,
			},
		});

		let m_files = {} as m_files;
		if (typeof findMenuByUUID?.m_menu_files[0] !== 'undefined') {
			m_files = await db.m_files.update({
				data: {
					name: file.name.replaceAll(" ", "_"),
					size: file.size,
					type: file.type,
					path: uploadPath + "/" + filename,
				},
				where: {
					id: findMenuByUUID.m_menu_files[0].m_files_id,
				},
			});
		} else {
			m_files = await db.m_files.create({
				data: {
					name: file.name.replaceAll(" ", "_"),
					size: file.size,
					type: file.type,
					path: uploadPath + "/" + filename,
				},
			});
		}

		if (m_files) {
			if (typeof findMenuByUUID?.m_menu_files[0] === 'undefined') {
				const create = await db.m_menu_files.create({
					data: {
						m_menu_id: findMenuByUUID?.id as any,
						m_files_id: m_files.id,
					},
				});

				if (create) {
					data = { ...m_files, path: dirUploadPath + "/" + m_files.path };

					return Response.json({
						data,
						message: "Success",
						status: 200,
					});
				}
			} else {
				data = { ...m_files, path: dirUploadPath + "/" + m_files.path };

				return Response.json({
					data,
					message: "Success",
					status: 200,
				});
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
