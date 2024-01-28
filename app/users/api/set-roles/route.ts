import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {roles, user_id} = await request.json()

    const findUser = await db.m_user.findFirst({
        where: {
            uuid: user_id
        }
    })

    if(findUser) {
        await db.m_user_roles.deleteMany({
            where: {
                m_user_id: findUser?.id
            }
        })

        if(roles.length > 0) {
            const data = roles.map((role: any, i: number) => {
                return {
                    m_roles_id: role.id,
                    m_user_id: findUser?.id
                }
            })

            await db.m_user_roles.createMany({
                data,
            })
        }
    }

	return Response.json({
		data: roles,
	});
}
