import db from '@/prisma/lib/db'
 
type ResponseData = {
  message: string
}
 
export async function POST(request: Request) {

  const data = await db.invoice.groupBy({
    by: ['status'],
    _count: {
      status: true
    },
    where: {
      status: {
        not: 'deleted'
      }
    }
  })

  return Response.json({
    data
  })
}