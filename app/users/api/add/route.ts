import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { owner } = await request.json();

	let data = null;

	const userCreated = await db.m_user.findUnique({
		where: {
			uuid: owner,
		},
	});

	if (userCreated) {
		const findMenu = await db.m_user.findFirst({
			where: {
				status: "draft",
				user_owner: userCreated.id,
			},
		});

		if (findMenu) {
			data = findMenu;
		} else {
			const create = await db.m_user.create({
				data: {
					name: "",
                    username: "",
                    password: "",
                    user_owner: userCreated.id
				},
			});

			if (create) {
				data = create;
			}
		}
	}

	return Response.json({
		data,
	});
}
