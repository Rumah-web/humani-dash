import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();
	let data = null;

	const findPayment = await db.payment.findFirst({
		select: {
			id: true,
		},
		where: {
			uuid,
		},
	});

	if (findPayment) {
		const findDetail = await db.payment_detail.findFirst({
			where: {
				payment_id: findPayment.id,
				status: "draft",
			},
		});

		if (findDetail) {
			data = findDetail;
		} else {
			const create = await db.payment_detail.create({
				data: {
					payment_id: findPayment.id,
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
