import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";
import { payment_detail } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const assets_api = process.env.API_ASSETS_HOST + "/view";
	const { uuid } = await request.json();
	let data = [] as payment_detail[];

	const payment = await db.payment.findFirst({
		where: {
			uuid,
		},
	});

	if (payment) {
		let query = await db.payment_detail.findMany({
			include: {
				m_files: {
					select: {
						path: true,
						uuid: true,
					},
				},
			},
			where: {
				payment_id: payment.id,
				status: {
					not: "draft",
				},
			},
		});

		if (query) {
			data = query.map((item, i) => {
				const m_files = {
					...item.m_files,
					path: assets_api + "/" + item.m_files?.uuid,
				};
				return { ...item, m_files };
			});
		}
	}

	return Response.json({
		data,
	});
}
