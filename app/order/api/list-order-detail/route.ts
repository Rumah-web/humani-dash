import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { order_id } = await request.json();
	let data = {} as IOptionsSelect[];
	const query = await db.order_detail.findMany({
		select: {
			m_menu: {
				select: {
					id: true,
					name: true
				}
			}
		},
		where: {
			status: "published",
			order_id
		},
	});

	if (query) {
		data = query.map((item, i) => {
			return {
				value: item.m_menu?.id,
				label: item.m_menu?.name,
			};
		});
	}

	return Response.json({
		data,
	});
}
