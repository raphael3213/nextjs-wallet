import { ZodError } from "zod";

export function routeErrorHandler(error: Error) {
  if (error instanceof ZodError) {
    let errorMessage = "";
    error.issues.forEach((issue) => {
      errorMessage = errorMessage + issue.path[0] + ": " + issue.message + ". ";
    });
    return { errorMessage: errorMessage, statusCode: 400 };
  } else {
    return { errorMessage: "An unexpected error occurred.", statusCode: 500 };
  }
}
