import { NextRequest, NextResponse } from "next/server";
import { roomService } from "../rooms/route";

type ReqBody = {room: string, identity: string, tracks_id: string, mute:boolean}

export async function POST(req:NextRequest){
  const {room, identity, tracks_id, mute}:ReqBody = await req.json();
  
  console.log({room, identity, tracks_id, mute});
  

  await roomService.mutePublishedTrack(room, identity, tracks_id, mute)

  return NextResponse.json({},{status: 200})
}