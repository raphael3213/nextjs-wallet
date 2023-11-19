"use server";
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { ErrorType } from "../types/error.types";

export async function walletErrorHandler(error: Error): Promise<ErrorType> {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return { errorMessage: "Duplicate entry detected.", statusCode: 400 };

        break;
      case "P2025":
        return { errorMessage: "Record not found.", statusCode: 404 };

        break;
      default:
        return {
          errorMessage: "An unexpected error occurred.",
          statusCode: 500,
        };
        break;
    }
  } else if (error instanceof PrismaClientUnknownRequestError) {
    return { errorMessage: "An unexpected error occurred.", statusCode: 500 };
  } else if (error instanceof PrismaClientValidationError) {
    return { errorMessage: "Validation error.", statusCode: 400 };
  } else if (error instanceof ZodError) {
    let errorMessage = "";
    error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });
    return { errorMessage: errorMessage, statusCode: 400 };
  } else {
    return { errorMessage: error.message, statusCode: 500 };
  }
}
