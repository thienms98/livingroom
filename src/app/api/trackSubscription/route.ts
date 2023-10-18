import { NextRequest, NextResponse } from "next/server";
import { roomService } from "../rooms/route";

export async function PUT(req:NextRequest){
  const {room, identity, trackSids, subscribe} = await req.json();
  console.log({room, identity, trackSids, subscribe});

  await roomService.updateSubscriptions(room, identity, trackSids, subscribe)
  
  return NextResponse.json({})
}