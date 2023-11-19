import { fetchWallet } from "@/lib/actions/wallet.action";
import { isErrorType } from "@/lib/type-guards/error.type-guard";
import { routeErrorHandler } from "@/lib/handlers/route.handler";
import { walletErrorHandler } from "@/lib/handlers/wallet.handler";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { walletKsuid: string } }
) {
  try {
    const walletKsuidSchema = z.string().min(1);
    const walletKsuid = walletKsuidSchema.parse(params.walletKsuid);

    const wallet = await fetchWallet(walletKsuid);
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
