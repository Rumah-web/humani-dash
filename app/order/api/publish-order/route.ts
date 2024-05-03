import { generateInvoiceNo, invoiceDueDate } from "@/app/lib/helper";
import db from "@/prisma/lib/db";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid } = await request.json();

	const currentDate = new Date();

	let success = false as boolean;

    try {
        await prisma?.$transaction(async (tx) => {
            const order = await tx.order.update({
                include: {
                    order_detail: {
                        select: {
                            total: true,
                        },
                    },
                },
                data: {
                    status: "new",
                },
                where: {
                    uuid,
                },
            });
    
            if (order) {
                let total = 0;
                let ppn = 0;
                let discount = 0;
                let delivery_charge = 0;
    
                for (let detail of order.order_detail) {
                    total += parseFloat(detail.total.toString());
                }
                const invoice = await tx.invoice.create({
                    data: {
                        order_id: order.id,
                        invoice_date: currentDate,
                        invoice_due_date: invoiceDueDate(currentDate),
                        status: "new",
                        total,
                        ppn,
                        discount,
                        delivery_charge,
                        description: "di kirim tgl 2 mei 2024 jam 5 sore",
                        invoice_no: generateInvoiceNo(order.order_no),
                    },
                });
    
                if (invoice) {
                    const total_payment =
                        parseFloat(invoice.total.toString()) +
                        parseFloat(invoice.ppn.toString()) +
                        parseFloat(invoice.discount.toString()) +
                        parseFloat(invoice.delivery_charge.toString());
    
                    await tx.payment.create({
                        data: {
                            invoice_id: invoice.id,
                            total: total_payment,
                            status: "new",
                        },
                    });
                }
            }
        });
        success = true;
    } catch (error) {
        success = false
    }

	return Response.json({
		success,
	});
}
