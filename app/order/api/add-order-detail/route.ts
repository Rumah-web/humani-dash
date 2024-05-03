import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid, menu, qty } = await request.json();
	let data = null;

	const dataMenu = await db.m_menu.findFirst({
		where: {
			uuid: menu,
		},
	});
	const parent = await db.order.findFirst({
		where: {
			uuid,
		},
	});

	if (parent && dataMenu) {
		const total = qty * parseInt(dataMenu.price as any);
		const create = await db.order_detail.create({
			include: {
				m_menu: true,
			},
			data: {
				status: "published",
				order_id: parent.id,
				m_menu_id: dataMenu?.id,
				menu_name: dataMenu?.name,
				menu_price: dataMenu?.price,
				qty,
				total,
				notes: "-",
			},
		});

		if (create) {
			const menuItems = await db.m_menu_item.findMany({
				select: {
					m_menu: {
						select: {
							name: true
						}
					},
					order: true
				},
				where: {
					m_menu_id: dataMenu.id,
				},
				orderBy: {
					order: 'asc'
				}
			});

			if (menuItems) {
				for (let item of menuItems) {
					await db.order_detail_menu_item.create({
						data: {
							order_detail_id: create.id,
							name: item.m_menu.name,
							order: item.order,
						},
					});
				}
			}

			data = create;
		}
	}

	return Response.json({
		data,
	});
}
