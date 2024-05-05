import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const assets_api = process.env.API_ASSETS_HOST + "/view";
	const { where, take, skip, orderBy } = await request.json();

	let condition = {
		status: {
			not: "deleted",
		},
	} as any;

	if (Object.entries(where).length > 0) {
		condition = { ...condition, ...where };
	}

	let data = null as any;

	const query = await db.invoice.findMany({
		select: {
			uuid: true,
			status: true,
			description: true,
			invoice_date: true,
			invoice_due_date: true,
			invoice_no: true
		},
		where: condition,
		take,
		skip,
		orderBy,
	});

	if (query) {
		data = query
	}

	return Response.json({
		data,
	});
}
