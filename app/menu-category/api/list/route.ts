import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const dirUploadPath = process.env.DIR_UPLOAD;
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
			m_files: {
				select: {
					path: true,
					name: true,
					type: true,
					size: true,
				},
			},
		},
		where: condition,
		take,
		skip,
		orderBy,
	});

	if (query) {
		data = query.map((menu, i) => {
			return { ...menu, m_files: menu.m_files ? dirUploadPath + "/" + menu.m_files?.path : null };
		});
	}

	return Response.json({
		data,
	});
}
