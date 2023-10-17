import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "@/lib/jwt";

export async function GET(req:NextRequest){
  const token = cookies().get('token')?.value;
  const { username } = jwt.verify<{username: string}>(token || '') || {username: ''};
  if(!username) return NextResponse.json({},{status: 403});

  const room = req.nextUrl.searchParams.get('room')
  if(!room) return NextResponse.json({msg: 'room name is required'})
  const data = await prisma.room.findUnique({where: {roomName: room}})

  const permission = username === data?.creator

  return NextResponse.json({...data, permission})
}