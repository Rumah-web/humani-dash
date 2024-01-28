import db from '@/prisma/lib/db'
import { auth } from "@/auth";
 
type ResponseData = {
  message: string
}
 
export async function POST(request: Request) {

  // Get sessionToken object
  const session = await auth()

  return Response.json({
    session
  })
}