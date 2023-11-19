import { createWallet } from "@/lib/actions/wallet.action";
import { isErrorType } from "@/lib/guards/error.guard";
import { routeErrorHandler } from "@/lib/handlers/route.handler";
import { walletErrorHandler } from "@/lib/handlers/wallet.handler";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const createWalletValidation = z.object({
      name: z.string().min(1).trim(),
      balance: z.number().min(1).optional(),
    });
    const createWalletParam = createWalletValidation.parse(body);
    const wallet = await createWallet(createWalletParam);

    if (isErrorType(wallet)) {
      return NextResponse.json(
        { error: wallet.errorMessage },
        { status: wallet.statusCode }
      );
    }
    return NextResponse.json(wallet);
  } catch (error) {
    const { errorMessage, statusCode } = await routeErrorHandler(
      error as Error
    );
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
