import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {uuid, status} = await request.json()

    const update = await db.order.update({
        data: {
            status
        },
        where: {
            uuid
        }
    })
	

	return Response.json({
		data: update,
	});
}
