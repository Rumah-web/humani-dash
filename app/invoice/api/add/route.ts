import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {

	let data = null;

    const findMenu = await db.m_item.findFirst({
        where: {
            status: 'draft'
        }
    })

    if(findMenu) {
        data = findMenu
    } else {
        const create = await db.m_item.create({
            data: {
                name: '',
                description: ''
            }
        })

        if(create) {
            data = create
        }
    }
	

	return Response.json({
		data,
	});
}
