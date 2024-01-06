import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

// 購入履歴検索API
//https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;

  try {
    const purchase = await prisma.purchase.findMany({
      where: { userId: userId },
    });
    console.log(purchase);

    return NextResponse.json(purchase);
  } catch (err) {
    return NextResponse.json(err);
  }
}
