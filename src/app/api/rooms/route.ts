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
    const rooms = await prisma.room.findMany();
    console.log('total rooms: ', rooms.length);
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
    console.log('create room ', createdRoom);
    const myRoom = await prisma.room.create({data: {
      sid: createdRoom.sid,
      name: createdRoom.name,
      emptyTimeout: createdRoom.emptyTimeout,
      maxParticipants: createdRoom.maxParticipants,
      creationTime: new Date(createdRoom.creationTime) ,
      turnPassword: createdRoom.turnPassword ,
      metadata: createdRoom.metadata ,
      numParticipants: createdRoom.numParticipants ,
      numPublishers: createdRoom.numPublishers ,
      activeRecording: createdRoom.activeRecording ,
      creator: user.username,
    }})
    return NextResponse.json({myRoom})
  }
  catch(err){
    console.log(err);
    
    return NextResponse.json({message: err})
  }
}

export async function DELETE(req:NextRequest){
  const { room } = await req.json()
  roomService.deleteRoom(room).then(() => {
    console.log('deleted room: ', room);
    prisma.room.delete({where: {name: room}})
  });
}