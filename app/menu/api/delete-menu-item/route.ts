import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {id} = await request.json()

    const update = await db.m_menu_item.delete({
        where: {
            id
        }
    })
	

	return Response.json({
		data: update,
	});
}
