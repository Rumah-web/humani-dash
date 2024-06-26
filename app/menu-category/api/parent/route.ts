import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const { uuid } = await request.json();
	let data = {} as IOptionsSelect[]
    const query = await db.m_menu_category.findMany({
        select: {
            id: true,
            name: true
        },
		where: {
			parent_id: null,
            status: 'published',
            uuid: {
                not: uuid
            }
		}
    })

    if(query) {
        data = query.map((category, i) => {
            return {
                value: category.id,
                label: category.name
            }
        })
    }

    
    
	return Response.json({
		data
	});
}
