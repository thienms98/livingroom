import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const {room} = await req.json()
  console.log(room);
  
  await prisma.room.update({
    where: { name: room },
    data: {
      numParticipants: { increment: 1 },
    },
  });

  return NextResponse.json({success: true})
}

export async function DELETE(req: NextRequest) {
  const {room} = await req.json()
  console.log(room);
  
  
  await prisma.room.update({
    where: { name: room },
    data: {
      numParticipants: { decrement: 1 },
    },
  });

  return NextResponse.json({success: true})
}