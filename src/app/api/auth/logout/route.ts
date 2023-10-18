import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
  const token = cookies().get('token')?.value;
  if(!token) return NextResponse.json({},{status: 401});

  cookies().delete('token');
  return NextResponse.json({msg: 'ok'})
}