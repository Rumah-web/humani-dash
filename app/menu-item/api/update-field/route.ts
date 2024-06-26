import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {data, uuid} = await request.json()

    const update = await db.m_item.update({
        data,
        where: {
            uuid
        }
    })
	

	return Response.json({
		data: update,
	});
}
