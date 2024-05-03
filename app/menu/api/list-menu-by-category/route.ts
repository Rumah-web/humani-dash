import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { category_id } = await request.json();
	let data = {} as IOptionsSelect[];
	const query = await db.m_menu.findMany({
		select: {
			id: true,
			name: true,
		},
		where: {
			status: "published",
            m_menu_category_id: category_id
		},
	});

	if (query) {
		data = query.map((item, i) => {
			return {
				value: item.id,
				label: item.name,
			};
		});
	}

	return Response.json({
		data,
	});
}
