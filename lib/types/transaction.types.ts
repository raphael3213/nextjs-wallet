import { Decimal } from "@prisma/client/runtime/library";

export type TransactionType = "CREDIT" | "DEBIT";

export type Transaction = {
  id: number;
  ksuid: string;
  amount: Decimal;
  balance: Decimal;
  description: string;
  type: TransactionType;
  createdAt: number;
  updatedAt: number;
};

export type TransactionColumn = Omit<Transaction, "id" | "updatedAt">;
export type CreateTransactionParams = {
  amount: number;
  description: string;
};
