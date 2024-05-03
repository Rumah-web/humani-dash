import db from "@/prisma/lib/db";
import { order_detail_menu_item } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid, menu, qty } = await request.json();
	let data = null;
	let success = false as boolean;

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

		try {
			await prisma?.$transaction(async (tx) => {
				let create = await tx.order_detail.create({
					include: {
						m_menu: true,
						order_detail_menu_item: true,
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
					const menuItems = await tx.m_menu_item.findMany({
						select: {
							m_menu: {
								select: {
									name: true,
								},
							},
							m_item: {
								select: {
									name: true,
								},
							},
							order: true,
						},
						where: {
							m_menu_id: dataMenu.id,
						},
						orderBy: {
							order: "asc",
						},
					});

					if (menuItems) {
						let order_detail_menu_item = [] as order_detail_menu_item[];
						for (let item of menuItems) {
							order_detail_menu_item = [
								...order_detail_menu_item,
								{
									order_detail_id: create.id,
									name: item.m_item ? item.m_item.name : "-",
									order: item.order,
								} as any,
							];
						}

						await tx.order_detail_menu_item.createMany({
							data: order_detail_menu_item,
						});

						create = {
							...create,
							...{ order_detail_menu_item: order_detail_menu_item },
						};
					}

					data = create;
				}
			});
			success = true;
		} catch (error) {
			success = true;
		}

		
	}

	return Response.json({
		data,
		success
	});
}
