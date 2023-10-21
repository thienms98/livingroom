import jwt from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
  let username = req.nextUrl.searchParams.get('username');
  if(!username) {
    const token = cookies().get('token')?.value;
    username = jwt.verify<{username: string}>(token || '')?.username || '';
  }
  if(!username) return NextResponse.json(null)

  const profile = await prisma.profile.findUnique({where: {username}});
  if(!profile) return NextResponse.json({success: false, msg: 'user not found'})

  return NextResponse.json({profile})
}

export async function PUT(req:NextRequest){
  const {username, data}: {username: string, data: {
    displayName?: string,
    metadata?: string
  }} = await req.json();

  const token = cookies().get('token')?.value;
  const selfUsername = jwt.verify<{username: string}>(token || '')?.username || '';

  if(username !== selfUsername) return NextResponse.json({
    success: false,
    msg: 'you dont have permission to do this'
  }, {status: 403})

  try{
    await prisma.profile.update({
      where: {username: selfUsername},
      data
    })
    return NextResponse.json({success: true})
  }catch(err){
    return NextResponse.json({success: false})
  }
}