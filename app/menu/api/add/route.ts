import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {

	let data = null;

    const findMenu = await db.m_menu.findFirst({
        where: {
            status: 'draft'
        }
    })

    if(findMenu) {
        data = findMenu
    } else {
        const create = await db.m_menu.create({
            data: {
                name: '',
                description: '',
                price: 0,
                price_promo: 0
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
