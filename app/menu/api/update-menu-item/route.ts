import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {data, id} = await request.json()

    const update = await db.m_menu_item.update({
        data:{
            ...data, status: 'published'
        },
        where: {
            id
        }
    })
	

	return Response.json({
		data: update,
	});
}
