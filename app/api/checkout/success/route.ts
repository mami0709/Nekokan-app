import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request, response: Response) {
  const { sessionId } = await request.json();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // 新しい購入履歴を常に作成する
    const purchase = await prisma.purchase.create({
      data: {
        userId: session.client_reference_id!,
        bookId: session.metadata?.bookId!,
      },
    });
    return NextResponse.json({ purchase });
  } catch (err: any) {
    return NextResponse.json({ message: err.message });
  }
}
