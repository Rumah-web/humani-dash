import { generateInvoiceNo, invoiceDueDate } from "@/app/lib/helper";
import db from "@/prisma/lib/db";
import { payment_detail } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const { uuid, paid } = await request.json();

	const currentDate = new Date();

	let success = false as boolean;
	let result = {} as payment_detail;

	try {
		await prisma?.$transaction(async (tx) => {
			const data = await tx.payment_detail.update({
				include: {
					payment: {
						include: {
							invoice: {
								select: {
									uuid: true,
								},
							},
						},
					},
				},
				data: {
					status: "success",
				},
				where: {
					uuid,
				},
			});

			if (data) {
				result = data;

				if (paid) {
					const payment = await tx.payment.update({
						data: {
							status: "paid",
							paid_date: currentDate
						},
						where: {
							id: data.payment_id,
						},
					});

					if (payment) {
						const inv = await tx.invoice.update({
							data: {
								status: "paid",
							},
							where: {
								id: payment.invoice_id,
							},
						});
						if (inv && inv.order_id) {
							await tx.order.update({
								data: {
									status_process: "new",
								},
								where: {
									id: inv.order_id,
								},
							});
						}
					}
				}
			}
		});

		success = true;
	} catch (error) {
		success = false;
	}

	return Response.json({
		success,
		data: result,
	});
}
