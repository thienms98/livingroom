import jwt from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
  const tokens = await prisma.account.findMany({
    select: {username:true, token: true}
  })

  const amount = tokens.filter(({username, token}) => {
    if(!token) return false
    try{
      const data = jwt.verify(token)
      if(data) return true
      else return false
    }catch(err){
      return false
    }
  }).length
  console.log('online users: ', amount);
  
  return NextResponse.json({tokens, amount})
}