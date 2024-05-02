import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();
	const assets_api =  process.env.API_ASSETS_HOST + '/view';

	const data = await db.m_item.findFirst({
		where: {
			uuid,
		},
	});


	return Response.json({
		data,
	});
}
