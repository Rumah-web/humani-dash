import db from '@/prisma/lib/db'
 
type ResponseData = {
  message: string
}
 
export async function POST(request: Request) {
  const {where } = await request.json()

  let condition = {
    status: {
      not: 'deleted'
    }
  } as any

  if(Object.entries(where).length > 0) {
      condition = {...condition, ...where}
  }

  const total = await db.order.count({
    where: condition
  })

  return Response.json({
    total
  })
}