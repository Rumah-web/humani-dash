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
	const assets_api = process.env.API_ASSETS_HOST + "/view";
	const {uuid} = await request.json()

	try {
		const findMenuByUUID = await db.m_menu.findFirst({
			select: {
				id: true,
				uuid: true,
			},
			where: {
				uuid,
			},
		});

		if (findMenuByUUID) {
			console.log(findMenuByUUID)
			await db.m_menu_files.deleteMany({
				where: {
					m_menu_id: findMenuByUUID?.id,
				},
			});
		}

		// Return a JSON response with a success message and a 201 status code
		return Response.json({ message: "Success", status: 201 });
	} catch (error) {
		// If an error occurs during file writing, log the error and return a JSON response with a failure message and a 500 status code
		console.log("Error occurred ", error);
		return Response.json({ message: "Failed", status: 500 });
	}
}
