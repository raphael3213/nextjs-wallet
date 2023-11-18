export type TransactionType = "CREDIT" | "DEBIT";

export type Transaction = {
  id: number;
  ksuid: string;
  amount: number;
  balance: number;
  description: string;
  type: TransactionType;
  createdAt: number;
  updatedAt: number;
};

export type CreateTransactionParams = {
  amount: number;
  description: string;
};
