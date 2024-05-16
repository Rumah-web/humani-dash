import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { id } = await request.json();

	let success = false as boolean;

	const orderDetail = await db.order_detail.findFirst({
		where: {
			id,
		},
	});

	if (orderDetail) {
		try {
			await db.$transaction(async (tx) => {
				await tx.order_detail_menu_item.deleteMany({
					where: {
						order_detail_id: orderDetail.id,
					},
				});
		
				await tx.order_detail.delete({
					where: {
						id: orderDetail.id,
					},
				});
			});
			success = true;
		} catch (error) {
			success = false
		}
		
		

		
	}

	return Response.json({
		success
	});
}
