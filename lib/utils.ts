import KSUID from "ksuid";
import { Wallet } from "./types/wallet.types";
import { Transaction } from "./types/transaction.types";

export function dateNow() {
  return Math.floor(Date.now() / 1000);
}

export function destructureObject(
  object: Wallet | Transaction
): Omit<Wallet, "id"> | Omit<Transaction, "id"> {
  const { id, ...destructuredObject } = object;
  return destructuredObject;
}

export function getKsuid() {
  return KSUID.randomSync().string;
}
