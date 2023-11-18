import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function walletErrorHandler(error: Error) {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { error: "Duplicate entry detected." },
          { status: 400 }
        );
        break;
      case "P2025":
        return NextResponse.json(
          { error: "Record not found." },
          { status: 404 }
        );
        break;
      default:
        return NextResponse.json(
          { error: "An unexpected error occurred." },
          { status: 500 }
        );
        break;
    }
  } else if (error instanceof PrismaClientUnknownRequestError) {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  } else if (error instanceof PrismaClientValidationError) {
    return NextResponse.json({ error: "Validation error." }, { status: 400 });
  } else if (error instanceof ZodError) {
    let errorMessage = "";
    error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  } else {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
