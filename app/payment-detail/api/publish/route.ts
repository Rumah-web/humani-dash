import { generateInvoiceNo, invoiceDueDate } from "@/app/lib/helper";
import db from "@/prisma/lib/db";
import { payment_detail } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();

	const currentDate = new Date();

	let success = false as boolean;
    let result = {} as payment_detail

    try {
        await prisma?.$transaction(async (tx) => {
            const data = await tx.payment_detail.update({
                data: {
                    status: "success",
                },
                where: {
                    uuid,
                },
            });
    
            if (data) {
                result = data
            }
        });
        success = true;
    } catch (error) {
        success = false
    }

	return Response.json({
		success,
        data: result
	});
}
