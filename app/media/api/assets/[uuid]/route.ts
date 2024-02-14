// render image

import { resizeImage } from "@/app/lib/helper";
import db from "@/prisma/lib/db";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
const fs = require("fs");
import path from "path";

type ResponseData = {
	message: string;
};

export async function GET(
	request: NextRequest,
	context: any,
	response: NextResponse
) {
	const dirUploadPath = process.env.DIR_UPLOAD;
	const { uuid } = context.params;
	const width = request.nextUrl.searchParams.get("width");
	const height = request.nextUrl.searchParams.get("height");
	const fill = request.nextUrl.searchParams.get("fill") as "contain" | "cover" | "fill" | "inside" | "outside";

	let condition = {} as any;

	if (uuid) {
		condition = { ...condition, uuid };
	}

	let data = null as any;

	const query = await db.m_files.findFirst({
		select: {
			uuid: true,
			name: true,
			size: true,
			path: true,
			type: true,
			created_at: true,
		},
		where: condition,
	});

	if (query) {
		data = { ...query, path: dirUploadPath + "/" + query.path };
	}

	try {
		const dir = path.resolve("./public", data.path);
		const new_path = await resizeImage(
			dir,
			width ? parseInt(width) : 100,
			height ? parseInt(height) : null,
			fill ? fill : 'cover'
		);
		const filenames = fs.readFileSync(new_path);

		return new Response(filenames, { headers: { "content-type": data.type } });
	} catch (e) {
		console.log(e);
		return Response.json({ message: `Something miss ${e}`, hallo: `Something miss ${e}` }, { status: 500 });
	}
}
