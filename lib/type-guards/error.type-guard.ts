import { Transaction, Wallet } from "@prisma/client";
import { ErrorType } from "../types/error.types";

export function isErrorType(object: any): object is ErrorType {
  if ("errorMessage" in object && "statusCode" in object) {
    return true;
  }
  return false;
}
