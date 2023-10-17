import { NextRequest, NextResponse } from "next/server";
import { roomService } from "../rooms/route";

export async function GET(req:NextRequest){
  const room = req.nextUrl.searchParams.get('room');
  if(!room) return NextResponse.json({msg: 'room name is required'}, {status: 403})

  const participants = await roomService.listParticipants(room);
  return NextResponse.json({participants})
}

export async function POST(){}
export async function PUT(){}

export async function DELETE(req:NextRequest){
  const { room, username } = await req.json()

  try{
    roomService.removeParticipant(room, username)
    return NextResponse.json({msg: 'ok'})
  }catch(err){
    return NextResponse.json({msg: 'fail'})
  }
}