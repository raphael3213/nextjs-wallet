"use server";

import { PrismaClient } from "@prisma/client";
import { CreateWalletParams } from "../types/wallet.types";
import { dateNow, getKsuid } from "../utils";

const prisma = new PrismaClient();

export async function createWallet(createWalletParams: CreateWalletParams) {
  // change this to two function
  try {
    await prisma.$connect();

    const transactionTime = dateNow();
    const walletKsuid = getKsuid();
    const transactionKsuid = getKsuid();
    let wallet;

    if (createWalletParams.balance) {
      //create function to return this object
      const transaction = {
        balance: 0,
        amount: createWalletParams.balance,
        description: "INITIAL_CREDIT",
        type: "CREDIT",
        createdAt: transactionTime,
        updatedAt: transactionTime,
        ksuid: transactionKsuid,
      };

      wallet = await prisma.wallet.create({
        data: {
          name: createWalletParams.name,
          balance: createWalletParams.balance,
          createdAt: transactionTime,
          updatedAt: transactionTime,
          ksuid: walletKsuid,
          transactions: {
            create: [transaction],
          },
        },
        select: {
          name: true,
          balance: true,
          createdAt: true,
          updatedAt: true,
          ksuid: true,
        },
      });
    } else {
      wallet = await prisma.wallet.create({
        data: {
          name: createWalletParams.name,
          balance: 0,
          createdAt: transactionTime,
          updatedAt: transactionTime,
          ksuid: walletKsuid,
        },
        select: {
          name: true,
          balance: true,
          createdAt: true,
          updatedAt: true,
          ksuid: true,
        },
      });
    }

    return wallet;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function fetchWallet(walletKsuid: string) {
  try {
    await prisma.$connect();
    const wallet = (await prisma.wallet.findUniqueOrThrow({
      where: {
        ksuid: walletKsuid,
      },
      select: {
        name: true,
        balance: true,
        createdAt: true,
        updatedAt: true,
        ksuid: true,
      },
    }))!;
    return wallet;
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
