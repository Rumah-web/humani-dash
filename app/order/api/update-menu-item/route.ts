import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { id, name } = await request.json();

	let success: boolean = false;
	let message: string = "Failed";

	const update = await db.order_detail_menu_item.update({
		data: {
			name,
		},
		where: {
			id,
		},
	});

	if (update) {
		success = true;
        message = 'Success'
	}

	return Response.json({
		success,
        message
	});
}
