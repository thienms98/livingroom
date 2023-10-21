import jwt from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  const token = cookies().get('token')?.value;
  if(!token) return NextResponse.json({},{status: 403});
  
  const user = jwt.verify<{username: string}>(token)
  if(!user) return NextResponse.json({},{status: 403});
  
  console.log(user.username,' log out')
  cookies().delete('token');
  await prisma.account.update({where: {username: user.username}, data: {token: ''}})
  return NextResponse.json({msg: 'ok'})
}