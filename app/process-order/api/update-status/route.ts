import db from "@/prisma/lib/db";
import { order_status_history } from "@prisma/client";

type ResponseData = {
	message: string;
};

export async function POST(request: Request) {
	const assets_api = process.env.API_ASSETS_HOST + "/view";
	const { uuid, status } = await request.json();

	let data = [] as Partial<order_status_history>[];

	let success = false as boolean;
	let message = "Failed" as string;

	try {
		await db.$transaction(async (tx) => {
			const findOrder = await tx.order.update({
				data: {
					status_process: status,
				},
				where: {
					uuid,
				},
			});

			if (findOrder) {
				await tx.order_status_history.create({
					data: {
						status,
						order_id: findOrder.id,
					},
				});

				if (status === "prepare") {
					await tx.order.update({
						data: {
							status: "process",
						},
						where: {
							id: findOrder.id,
						},
					});
				} else if (status === "delivery") {
					await tx.order.update({
						data: {
							status: "delivery",
						},
						where: {
							id: findOrder.id,
						},
					});
				} else if (status === "finished") {
					await tx.order.update({
						data: {
							status: "finished",
						},
						where: {
							id: findOrder.id,
						},
					});
				}
			}

			success = true;
			message = "Success";
		});
	} catch (error) {}

	return Response.json({
		success,
		message,
	});
}
