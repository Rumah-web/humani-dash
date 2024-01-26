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

  let data = null as any

	const query = await db.m_menu.findMany({
		select: {
			uuid: true,
			name: true,
			description: true,
			price: true,
			price_promo: true,
			status: true,
			m_menu_files: {
				select: {
					m_files: {
						select: {
							path: true,
							name: true,
							type: true,
							size: true,
						},
					},
				},
				take: 1,
			},
		},
		where: condition,
		take,
		skip,
		orderBy,
	});

	if (query) {
		data = query.map((menu, i) => {
			const m_menu_files = menu.m_menu_files.map((menu_file, x) => {
				const m_files = {
					...menu_file.m_files,
					path: dirUploadPath + "/" + menu_file.m_files.path,
				};
				return { ...menu_file, m_files };
			});

			return { ...menu, m_menu_files };
		});
	}

	return Response.json({
		data,
	});
}
