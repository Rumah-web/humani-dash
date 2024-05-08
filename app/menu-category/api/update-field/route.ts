import db from "@/prisma/lib/db";
import * as referralCodes from "referral-codes";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	let { data, uuid } = await request.json();

	const key = Object.keys(data)[0] as string;
	const val = Object.values(data)[0] as string;

	if (key === "name") {
		let slug = val.replace(/\s+/g, "-").toLowerCase();

		const findExistSlug = await db.m_menu_category.findFirst({
			where: {
				slug,
			},
		});

		if (findExistSlug) {
			const prefix = referralCodes.generate({
				length: 5,
				charset: referralCodes.charset(referralCodes.Charset.ALPHABETIC),
			});
			slug = `${slug}-${prefix}`;
            slug = slug.replace(/\s+/g, "-").toLowerCase();
		}

		data = { ...data, slug };
	}

	const update = await db.m_menu_category.update({
		data,
		where: {
			uuid,
		},
	});

	return Response.json({
		data: update,
	});
}
