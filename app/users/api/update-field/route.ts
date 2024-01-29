import db from "@/prisma/lib/db";
import * as argon2 from "argon2";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {data, uuid} = await request.json()


    if(Object.keys(data)[0] === 'password') {
        const pass = await argon2.hash(Object.values(data)[0] as any)
        await db.m_user.update({
            data: {
                password: pass
            },
            where: {
                uuid
            }
        })
    } else {
        await db.m_user.update({
            data,
            where: {
                uuid
            }
        })
    }

    
	

	return Response.json({
		data,
	});
}
