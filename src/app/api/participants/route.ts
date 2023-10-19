import { NextRequest, NextResponse } from "next/server";
import { roomService } from "../rooms/route";
import prisma from "@/lib/prisma";

export async function GET(req:NextRequest){
  const room = req.nextUrl.searchParams.get('room');
  if(!room) return NextResponse.json({msg: 'room name is required'}, {status: 403})

  const participants = await roomService.listParticipants(room);
  return NextResponse.json({participants})
}

export async function POST(){}
export async function PUT(req:NextRequest){
  const {room, identity, metadata, permissions} = await req.json()

  await roomService.updateParticipant(room, identity, metadata, permissions )
  
  return NextResponse.json({msg: 'ok'})
}

export async function DELETE(req:NextRequest){
  const { room, username }: {room: string, username: string} = await req.json()

  try{
    await roomService.removeParticipant(room, username)
  }catch(err){
    console.log(err);
    
    return NextResponse.json({succes: false, msg: 'fail'})
  }

  return NextResponse.json({succes: true, msg: 'ok'})
}