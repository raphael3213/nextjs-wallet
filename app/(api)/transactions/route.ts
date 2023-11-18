import { fetchAllTransaction } from "@/lib/actions/transaction.actions";
import { transactionErrorHandler } from "@/lib/handlers/transaction.handler";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const walletKsuidSchema = z.string().min(1);
    const walletKsuid = walletKsuidSchema.parse(params.get("walletId"));
    const skip = parseInt(params.get("skip") || "0");
    const limit = parseInt(params.get("limit") || "10");

    const transactions = await fetchAllTransaction(walletKsuid, skip, limit);
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    return transactionErrorHandler(error as Error);
  }
}
