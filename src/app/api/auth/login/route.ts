import jwt from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(req:NextRequest){
  const {username, password} = await req.json();

  const user = await prisma.account.findUnique({where: {
    username,
    password
  }})

  if(!user) return NextResponse.json({message: 'Username or passowrd incorrect'}, {status: 401})
  const data = await prisma.profile.findUnique({where: {username}});

  const token = jwt.sign(data as Object, {expiresIn: 15*60});
  // console.log(token);

  if(!token) return NextResponse.json({message: 'gen token fail'})
  await prisma.account.update({where: {username}, data: {token}})
  
  cookies().set('token', token)

  return NextResponse.json({success: true})
}