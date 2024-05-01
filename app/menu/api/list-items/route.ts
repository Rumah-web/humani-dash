import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    

    let data = {} as IOptionsSelect[]
    const query = await db.m_item.findMany({
        select: {
            id: true,
            name: true
        }
    })

    if(query) {
        data = query.map((item, i) => {
            return {
                value: item.id,
                label: item.name
            }
        })
    }

    
    
	return Response.json({
		data
	});
}
