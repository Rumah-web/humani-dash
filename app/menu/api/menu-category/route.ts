import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    

    let data = {} as IOptionsSelect[]
    const query = await db.m_menu_category.findMany({
        select: {
            id: true,
            name: true
        },
        where: {
            status: 'published',
            parent_id: {
                not: null
            },
            m_menu_category: {
                status: 'published',
                is_show: true
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
