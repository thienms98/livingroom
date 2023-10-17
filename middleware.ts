import { NextRequest, NextResponse } from "next/server";

export async function Middleware(req: NextRequest){
  const token = req.headers

  console.log('fire middleware');
  


  return NextResponse.next()
}

export const config = {
  matcher: ['/api/.*'],
}