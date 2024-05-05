import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";
import { payment_detail } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();
	let data = {} as payment_detail[];

	const payment = await db.payment.findFirst({
		where: {
			uuid,
            status: {
                not: 'paid'
            }
		},
	});

	if (payment) {
		const query = await db.payment_detail.findMany({
			where: {
				payment_id: payment.id,
			},
		});

        if(query) {
            data = query
        }

	}

	return Response.json({
		data,
	});
}
