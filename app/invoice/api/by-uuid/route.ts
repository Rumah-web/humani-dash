import db from "@/prisma/lib/db";
import { invoice, payment } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();
	const assets_api = process.env.API_ASSETS_HOST + "/view";

	let data = {} as invoice & {
		payment: { total: Decimal | undefined; uuid: string | undefined; status: string | undefined };
	};
	let result = await db.invoice.findFirst({
		include: {
			order: {
				include: {
					order_detail: {
						include: {
							order_detail_menu_item: true,
						},
					},
					customer: true,
					m_user: true,
				},
			},
			payment: true,
		},
		where: {
			uuid,
		},
	});

	if (result) {
		data = {
			...result,
			payment: {
				total: result?.payment.find((item, i) => i === 0)?.total,
				status: result?.payment.find((item, i) => i === 0)?.status,
				uuid: result?.payment.find((item, i) => i === 0)?.uuid,
			},
		};
	}

	return Response.json({
		data,
	});
}
