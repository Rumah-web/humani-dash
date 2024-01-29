import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {uuid } = await request.json()
    const dirUploadPath = process.env.DIR_UPLOAD;

    const data = await db.m_user.findFirst({
        select: {
            uuid: true,
            name: true,
            email: true,
            username: true,
            user_owner: true,
            status: true,
            password: true,
            m_files: {
                select: {
                    path: true
                }
            },
            m_user_roles: {
                select: {
                    m_user_id: true,
                    m_roles_id: true,
                    m_roles: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                }
            }
        },
        where: {
            uuid
        }
    })


    let file = null as any
    
    if(data?.m_files) {
        file = {...data?.m_files, path: dirUploadPath + "/" + data?.m_files.path}
    }

    if(data) {
        data.password = null as any
    }
    
	return Response.json({
		data,
        file
	});
}
