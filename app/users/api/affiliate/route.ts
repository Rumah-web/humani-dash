import { IOptionsSelect } from "@/app/type";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    

    let data = {} as IOptionsSelect[]
    const query = await db.m_user_roles.findMany({
		select:{
			m_user: {
				select: {
					affiliate_code: true,
					name: true
				}
			}
		},
        where: {
			m_roles: {
				name: 'affiliate'
			}
		}
    })

    if(query) {
        data = query.map((item, i) => {
            return {
                value: item.m_user.affiliate_code,
                label: item.m_user.name || ''
            }
        })
    }

    
    
	return Response.json({
		data
	});
}
