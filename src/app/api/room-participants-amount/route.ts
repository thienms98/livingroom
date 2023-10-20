import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { roomService } from "../rooms/route";

export async function GET(req: NextRequest) {
  const room = req.nextUrl.searchParams.get('room') || ''
  const amount = (await roomService.listParticipants(room)).length

  return NextResponse.json({success: true, amount})
}
