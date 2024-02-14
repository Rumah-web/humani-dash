import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
    const {uuid } = await request.json()
    // const dir_upload_path = process.env.API_ASSETS;
    const assets_api =  process.env.API_ASSETS_HOST + '/' +process.env.API_ASSETS;
    const api_upload =  process.env.API_ASSETS_HOST;

    const data = await db.m_menu.findFirst({
        include: {
            m_menu_files: {
                include: {
                    m_files: {
                        select: {
                            path: true,
                            uuid: true
                        }
                    }
                }
            },
        },
        where: {
            uuid
        }
    })

    let file = null as any
    
    if(data?.m_menu_files && data?.m_menu_files.length > 0) {
        file = {...data?.m_menu_files[0].m_files, path: assets_api + "/" + data?.m_menu_files[0].m_files.uuid}
    }
    
	return Response.json({
		data,
        file,
        apiupload: api_upload
	});
}
