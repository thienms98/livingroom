import jwt from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  const username = await req.json();
  const token = cookies().get('token')?.value;
  if(!token){ 
    removeToken(username);
    return NextResponse.json({},{status: 401});
  }

  const data = jwt.verify<{username: string,
    displayName?: string,
    metadata?: string}>(token);
  if(!data) {
    removeToken(username);
    return NextResponse.json({msg: 'token invalid' }, {status: 403})
  }

  const refToken = await prisma.account.findFirst({where: {token}});
  if(!refToken){ 
    removeToken(username);
    return NextResponse.json({msg: 'token invalid'}, {status: 403});
  }

  const freshToken = jwt.sign({
    username: data.username,
    displayName: data?.displayName || '',
    metadata: data?.metadata || ''
  } as Object, {expiresIn: 10*60});
  if(!freshToken){ 
    removeToken(username);
    return NextResponse.json({msg: 'jwt fail'},{status: 403})
  }

  cookies().set('token', freshToken);
  await prisma.account.update({
    where: {username: data.username}, 
    data: {token: freshToken}
  })

  return NextResponse.json({token: freshToken})
}

async function removeToken(username: string){
  await prisma.account.update({where: {username}, data: {token: ''}})
}