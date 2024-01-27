import db from "@/prisma/lib/db";
import { m_user } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const dirUploadPath = process.env.DIR_UPLOAD;
	const { where, take, skip, orderBy } = await request.json();

	let condition = {
		
	} as any;

	if (Object.entries(where).length > 0) {
		condition = { ...condition, ...where };
	}

	let data: m_user | any = null
	const query = await db.m_user.findMany({
		select: {
			uuid: true,
			name: true,
			email: true,
			email_verified: true,
			created_at: true,
			affiliate_code: true,
			m_files: {
				select: {
					path: true
				}
			},
			m_user_roles: {
				select: {
					m_roles: {
						select: {
							name: true
						}
					}
				}
			}
		},
		where: condition,
		take,
		skip,
		orderBy,
	});

	if(query) {
		data = query.map((user, i) => {
			const m_files = {...user.m_files, path: dirUploadPath + "/" + user.m_files?.path}
			return {...user, m_files}
		})
	}

	return Response.json({
		data,
	});
}
