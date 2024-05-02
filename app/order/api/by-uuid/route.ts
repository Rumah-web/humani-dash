import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();
	const assets_api =  process.env.API_ASSETS_HOST + '/view';

	const data = await db.order.findFirst({
		include: {
			order_detail: true,
		},
		where: {
			uuid,
		},
	});


	return Response.json({
		data,
	});
}
