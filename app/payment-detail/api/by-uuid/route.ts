import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();
	const assets_api =  process.env.API_ASSETS_HOST + '/view';

	const data = await db.payment_detail.findFirst({
		include:{
			m_files: {
				select: {
					uuid: true,
					path: true
				}
			}
		},
		where: {
			uuid,
		},
	});

	let file = null as any
    
    if(data?.m_files) {
        file = {...data?.m_files, path: assets_api + "/" + data?.m_files.uuid}
    }


	return Response.json({
		data,
		file
	});
}
