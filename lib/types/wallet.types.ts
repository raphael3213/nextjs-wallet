import { Decimal } from "@prisma/client/runtime/library";

export type Wallet = {
  id: number;
  ksuid: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  balance: Decimal;
};

export type CreateWalletParams = {
  name: string;
  balance?: number;
};
