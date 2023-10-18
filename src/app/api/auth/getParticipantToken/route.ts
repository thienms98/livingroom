import prisma from "@/lib/prisma";
import { AccessToken, TrackSource } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get("room");
  const username = req.nextUrl.searchParams.get("username");
  if (!room) {
    return NextResponse.json(
      { error: 'Missing "room" query parameter' },
      { status: 400 }
    );
  } else if (!username) {
    return NextResponse.json(
      { error: 'Missing "username" query parameter' },
      { status: 400 }
    );
  }

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const mRoom = await prisma.room.findUnique({where: {name:room}});
  await prisma.participants.create({data: {
    participant: {connect: {username}},
    room: {connect: {name: room}}
  }})

  const at = new AccessToken(apiKey, apiSecret, { identity: username });
  const permission =  mRoom?.creator === username

  at.addGrant({ room, roomJoin: true, canPublish: permission, canSubscribe: permission , canPublishSources: [TrackSource.MICROPHONE, TrackSource.CAMERA, TrackSource.SCREEN_SHARE, TrackSource.SCREEN_SHARE_AUDIO] });

  return NextResponse.json({ token: at.toJwt() });
}