import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();
	let data = null;

	const menu = await db.m_menu.findFirst({
		where: {
			uuid,
		},
	});

	if (menu) {
		console.log(menu);
		const find = await db.m_menu_item.findFirst({
			include: {
				m_item: {
					select: {
						name: true,
						id: true,
					},
				},
			},
			where: {
				status: "draft",
				m_menu_id: menu.id,
			},
		});

		if (find) {
			data = find;
		} else {
			const create = await db.m_menu_item.create({
				include: {
					m_item: {
						select: {
							name: true,
							id: true,
						},
					},
				},
				data: {
					m_menu_id: menu.id,
				},
			});

			if (create) {
				data = create;
			}
		}
	}

	return Response.json({
		data,
	});
}
