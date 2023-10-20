import jwt from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  const token = cookies().get('token')?.value;
  if(!token) return NextResponse.json({},{status: 401});
  
  const user = jwt.verify<{username: string}>(token)
  if(!user) return NextResponse.json({},{status: 401});
  
  console.log('log ',user.username,' out')
  cookies().delete('token');
  await prisma.account.update({where: {username: user.username}, data: {token: ''}})
  return NextResponse.json({msg: 'ok'})
}