import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const assets_api = process.env.API_ASSETS_HOST + "/view";
	const { where, take, skip, orderBy } = await request.json();

	let condition = {
		status: {
			not: "deleted",
		},
	} as any;

	if (Object.entries(where).length > 0) {
		condition = { ...condition, ...where };
	}

	let data = null as any;

	const query = await db.m_menu_category.findMany({
		select: {
			uuid: true,
			name: true,
			description: true,
			status: true,
			order: true,
			slug: true,
			m_files: {
				select: {
					path: true,
					uuid: true,
					name: true,
					type: true,
					size: true,
				},
			},
			m_menu_category: {
				select: {
					name: true
				}
			}
		},
		where: condition,
		take,
		skip,
		orderBy,
	});

	if (query) {
		data = query.map((menu, i) => {
			return {
				...menu,
				m_files: menu.m_files ? assets_api + "/" + menu.m_files?.uuid : null,
				parent: menu.m_menu_category ? menu.m_menu_category.name : null,
			};
		});
	}

	return Response.json({
		data,
	});
}
