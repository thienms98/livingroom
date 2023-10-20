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
  const data = await prisma.room.findUnique({where: {name: room}})
  console.log('get room ', room);

  const permission = username === data?.creator

  return NextResponse.json({...data, permission})
}

export async function PUT(req:NextRequest){
  const {room, data} = await req.json();
  if(!room) return NextResponse.json({msg: 'room name is required'})

  const roomInfo = await prisma.room.findUnique({where: {name: room}})

  if(!roomInfo) return NextResponse.json({msg: 'room not found'})
  await prisma.room.update({
    where: {
      name: room
    },
    data: {
      ...data
    }
  })

  return NextResponse.json({msg: 'ok'})
}