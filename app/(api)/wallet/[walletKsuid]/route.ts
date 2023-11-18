import { fetchWallet } from "@/lib/actions/wallet.action";
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
    return NextResponse.json(wallet, { status: 200 });
  } catch (error) {
    return walletErrorHandler(error as Error);
  }
}
