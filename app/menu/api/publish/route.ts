import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {uuid} = await request.json()

    const update = await db.m_menu.update({
        data: {
            status: 'published'
        },
        where: {
            uuid
        }
    })
	

	return Response.json({
		data: update,
	});
}
