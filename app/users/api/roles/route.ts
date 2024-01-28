import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {

    const data = await db.m_roles.findMany({
        select: {
            id: true,
            name: true
        }
    })
    
	return Response.json({
		data
	});
}
