import { createTransaction } from "@/lib/actions/transaction.actions";
import { transactionErrorHandler } from "@/lib/handlers/transaction.handler";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(
  request: NextRequest,
  { params }: { params: { walletKsuid: string } }
) {
  try {
    const body = await request.json();

    const walletKsuidSchema = z.string().min(1);

    const walletKsuid = await walletKsuidSchema.parse(params.walletKsuid);

    const createTransactionSchema = z.object({
      description: z.string().min(1).trim(),
      amount: z.number().refine((value) => value !== 0, {
        message: "Number must be non-zero",
      }),
    });

    const createTransactionParams = await createTransactionSchema.parse(body);

    const result = await createTransaction(
      createTransactionParams,
      walletKsuid
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return transactionErrorHandler(error as Error);
  }
}
