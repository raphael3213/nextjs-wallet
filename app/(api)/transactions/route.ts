import { fetchAllTransaction } from "@/lib/actions/transaction.actions";
import { isErrorType } from "@/lib/type-guards/error.type-guard";
import { routeErrorHandler } from "@/lib/handlers/route.handler";
import { transactionErrorHandler } from "@/lib/handlers/transaction.handler";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;

    const walletKsuidSchema = z.string().min(1);
    const walletKsuid = walletKsuidSchema.parse(params.get("walletId"));
    const skipSchema = z.coerce.number().min(0);
    const skip = skipSchema.parse(params.get("skip"));
    const limitSchema = z.coerce.number().min(0);
    const limitValue = limitSchema.parse(params.get("limit"));
    const limit = limitValue === 0 ? 10 : limitValue;
    const transactions = await fetchAllTransaction(walletKsuid, skip, limit);
    if (isErrorType(transactions)) {
      return NextResponse.json(
        { error: transactions.errorMessage },
        { status: transactions.statusCode }
      );
    }
    return NextResponse.json(transactions);
  } catch (error) {
    const { errorMessage, statusCode } = await routeErrorHandler(
      error as Error
    );
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
