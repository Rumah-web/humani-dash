// render image

import db from "@/prisma/lib/db";
import type { NextApiRequest } from "next";
const fs = require("fs");
import path from "path";

type ResponseData = {
	message: string;
};

export async function GET(request: NextApiRequest, context: any) {
	const dirUploadPath = process.env.DIR_UPLOAD;
	const { uuid } = context.params;

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
		const filenames = fs.readFileSync(dir);

		return new Response(filenames, { headers: { "content-type": data.type } });
	} catch (e) {
		console.log(e);
		return Response.json({ message: `Something miss ${e}` }, { status: 500 });
	}
}
