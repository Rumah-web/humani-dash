import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const assets_api = process.env.API_ASSETS_HOST + "/view";

	let condition = {
		status: {
			not: "deleted",
		},
	} as any;

	let data = {} as IOptionsSelect[];

	const query = await db.m_item.findMany({
		select: {
			uuid: true,
			name: true,
			status: true,
			description: true,
			id: true
		},
		where: condition,
	});

	if (query) {
		if (query) {
			data = query.map((item, i) => {
				return {
					value: item.id,
					label: item.name,
				};
			});
		}
	}

	return Response.json({
		data,
	});
}
