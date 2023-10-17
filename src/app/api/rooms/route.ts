import { NextRequest, NextResponse } from "next/server";
import { RoomServiceClient, Room } from 'livekit-server-sdk';
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "@/lib/jwt";

const apiKey = process.env.LIVEKIT_API_KEY || ''
const apiSecret = process.env.LIVEKIT_API_SECRET || ''
const livekitHost = process.env.NEXT_PUBLIC_LIVEKIT_URL || '';
export const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

export async function GET(req:NextRequest){
  try{
    const rooms = await roomService.listRooms();
    console.log('rooms\'s amount ', rooms.length);
    
    return NextResponse.json(rooms)
  }
  catch(err){
    return NextResponse.json({message: err})
  }
}

export async function POST(req:NextRequest){
  const token = cookies().get('token')?.value;
  const user = jwt.verify<{username: string}>(token || '');
  if(!user) return NextResponse.json({},{status: 403});

  const { room, emptyTimeout, maxParticipants } = await req.json()
  const opts = {
    name: room,
    emptyTimeout: emptyTimeout || 60 * 60, // 60 minutes
    maxParticipants: maxParticipants || 20,
  };
  try{
    const createdRoom = await roomService.createRoom(opts)
    console.log('room created   ', createdRoom);
    await prisma.room.create({data: {
      roomId: createdRoom.sid,
      roomName: createdRoom.name,
      creator: user.username 
    }})
    return NextResponse.json({room})
  }
  catch(err){
    console.log(err);
    
    return NextResponse.json({message: err})
  }
}

export async function DELETE(req:NextRequest){
  const { room } = await req.json()
  roomService.deleteRoom(room).then(() => {
    console.log('room deleted: ', room);
    prisma.room.delete({where: {roomName: room}})
  });
}