import db from '@/prisma/lib/db'
 
type ResponseData = {
  message: string
}
 
export async function POST(request: Request) {
  const {where, take, skip, orderBy } = await request.json()

  let condition = {
    status: {
      not: 'deleted'
    }
  } as any

  if(Object.entries(where).length > 0) {
      condition = {...condition, ...where}
  }

  const data = await db.m_menu.findMany({
    select: {
        name: true,
        description: true,
        price: true,
        price_promo: true,
        status: true,
        m_menu_files: {
            select: {
                m_files: {
                    select: {
                        path: true,
                        name: true,
                        type: true,
                        size: true
                    }
                }
            }
        }
    },
    where: condition,
    take,
    skip,
    orderBy
  })

  return Response.json({
    data
  })
}