import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {uuid } = await request.json()
    const dirUploadPath = process.env.DIR_UPLOAD;

    const data = await db.m_menu.findFirst({
        include: {
            m_menu_files: {
                include: {
                    m_files: {
                        select: {
                            path: true
                        }
                    }
                }
            },
        },
        where: {
            uuid
        }
    })
	
    const file = {...data?.m_menu_files[0].m_files, path: dirUploadPath + "/" + data?.m_menu_files[0].m_files.path}
	return Response.json({
		data,
        file
	});
}
