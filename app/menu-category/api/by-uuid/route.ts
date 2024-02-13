import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();
	const dirUploadPath = process.env.DIR_UPLOAD;

	const data = await db.m_menu_category.findFirst({
		include: {
			m_files: {
				select: {
					path: true,
				},
			},
		},
		where: {
			uuid,
		},
	});

	let file = null as any;

	if (data?.m_files) {
		file = dirUploadPath + "/" + data?.m_files.path
	}

	return Response.json({
		data,
		file,
	});
}
