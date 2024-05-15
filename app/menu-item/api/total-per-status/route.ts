import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { filter } = await request.json();

	let condition = {
		status: {
			not: "deleted",
		},
	};

	if (filter && Object.keys(filter).length > 0) {
		condition = { ...condition, ...filter };
	}

	const data = await db.m_item.groupBy({
		by: ["status"],
		_count: {
			status: true,
		},
		where: condition,
	});

	return Response.json({
		data,
	});
}
