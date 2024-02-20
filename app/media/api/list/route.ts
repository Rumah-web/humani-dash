import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const assets_api =  process.env.API_ASSETS_HOST + '/view';
	const { where, take, skip, orderBy } = await request.json();

	let condition = {
		
	} as any;

	if (Object.entries(where).length > 0) {
		condition = { ...condition, ...where };
	}

	let data = null as any;

	const query = await db.m_files.findMany({
		select: {
			uuid: true,
			name: true,
			size: true,
			path: true,
			type: true,
			created_at: true,
		},
		where: condition,
		take,
		skip,
		orderBy,
	});

	if (query) {
		data = query.map((file, i) => {

			return { ...file, path: assets_api + "/" + file.uuid };
		});
	}

	return Response.json({
		data,
	});
}
