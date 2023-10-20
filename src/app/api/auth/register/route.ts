import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  const {username, password, displayName, metadata} = await req.json()
  console.log({username, password, displayName, metadata} );
  

  try{
    await prisma.account.create({data: {
      password,
      token: '',
      User: {
        create: {
          username,
          displayName,
          metadata,
        }
      }
    }})
    return NextResponse.json({success: true})
  }catch(err){
    console.log(err)
  }

  return NextResponse.json({success: false})
}