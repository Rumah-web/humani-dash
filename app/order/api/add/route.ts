import { generateOrderNo } from "@/app/lib/helper";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	let data = null;

	const findMenu = await db.order.findFirst({
		where: {
			status: "draft",
		},
	});

	if (findMenu) {
		data = findMenu;
	} else {
		const create = await db.order.create({});

		if (create) {
			const update = await db.order.update({
				include: {
					order_detail: true,
				},
				data: {
					order_no: generateOrderNo(create.id.toString()),
					notes: ''
				},
				where: {
					id: create.id,
				},
			});

			if (update) data = update;
		}
	}

	return Response.json({
		data,
	});
}
