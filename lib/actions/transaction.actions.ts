"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import KSUID from "ksuid";
import { dateNow, destructureObject, getKsuid } from "../utils";
import { CreateTransactionParams } from "../types/transaction.types";
import { type } from "os";
import { Decimal } from "@prisma/client/runtime/library";
import { transactionErrorHandler } from "../handlers/transaction.handler";

const prisma = new PrismaClient();

export async function createTransaction(
  createTransactionParams: CreateTransactionParams,
  walletKsuid: string
) {
  try {
    await prisma.$connect();

    const transactionTime = dateNow();
    const transactionKsuid = getKsuid();

    const transactionAmount = createTransactionParams.amount;

    const transactionType = transactionAmount < 0 ? "DEBIT" : "CREDIT";

    const transactionDescription = createTransactionParams.description;

    const absouluteAmount = Math.abs(transactionAmount);

    const result = await prisma.$transaction(
      async (prisma) => {
        const wallet = (await prisma.wallet.findUniqueOrThrow({
          where: {
            ksuid: walletKsuid,
          },
        }))!;

        if (
          Number(wallet.balance) < absouluteAmount &&
          transactionType === "DEBIT"
        ) {
          throw new Error("Not Enough Balance");
        }

        const transaction = await prisma.transaction.create({
          data: {
            amount: absouluteAmount,
            balance: wallet.balance,
            description: transactionDescription,
            type: transactionType,
            createdAt: transactionTime,
            updatedAt: transactionTime,
            walletId: wallet.id,
            ksuid: transactionKsuid,
          },
        });

        const updatedWallet = await prisma.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            balance: Number(wallet.balance) + transactionAmount,
          },
        });
        return {
          balance: updatedWallet.balance,
          transactionId: transaction.ksuid,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
      }
    );
    return result;
  } catch (error) {
    return transactionErrorHandler(error as Error);
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchAllTransaction(
  walletKsuid: string,
  skip: number,
  limit?: number
) {
  try {
    prisma.$connect();

    const wallet = (await prisma.wallet.findUniqueOrThrow({
      where: {
        ksuid: walletKsuid,
      },
      include: {
        transactions: {
          skip: skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          select: {
            id: false,
            walletId: false,
            ksuid: true,
            amount: true,
            balance: true,
            description: true,
            type: true,
            createdAt: true,
            updatedAt: false,
          },
        },
      },
    }))!;

    return wallet.transactions;
  } catch (error) {
    return transactionErrorHandler(error as Error);
  } finally {
    prisma.$disconnect();
  }
}
