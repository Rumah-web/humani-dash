import db from "@/prisma/lib/db";
import { order_status_history } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const assets_api = process.env.API_ASSETS_HOST + "/view";
	const { uuid } = await request.json();

	let data = [] as Partial<order_status_history>[];


	const findOrder = await db.order.findFirst({
		where: {
			uuid,
		},
	});

	if (findOrder) {
		const query = await db.order_status_history.findMany({
			select: {
				status: true,
			},
			where: {
				order_id: findOrder.id,
			},
		});

		if (query) {
			data = query;
		}
	}

	return Response.json({
		data,
	});
}
