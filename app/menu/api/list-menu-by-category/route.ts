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
			price: true,
			price_promo: true,
		},
		where: {
			status: "published",
			m_menu_category_id: category_id,
		},
	});

	if (query) {
		data = query.map((item, i) => {
			const price = `${
				parseInt(item.price.toString()) - parseInt(item.price_promo.toString())
			}`;
			const label = `${item.name} - ${` Rp. ${price
				.toString()
				.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}`;
			return {
				value: item.id,
				label,
			};
		});
	}

	return Response.json({
		data,
	});
}
