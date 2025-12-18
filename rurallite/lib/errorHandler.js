import { sendError } from "./responseHandler";
import { ERROR_CODES } from "./errorCodes";
import { logger } from "./logger";

/**
 * Centralized error handler
 * - Logs full details (stack, message, code) via `logger`
 * - Returns appropriate `sendError(...)` response for the client
 */
export function handleError(error, context = "unknown") {
  const isProd = process.env.NODE_ENV === "production";

  // Default mapping
  let code = ERROR_CODES.INTERNAL_ERROR;
  let status = 500;
  let message = isProd ? "Something went wrong. Please try again later." : (error?.message || "Unknown error");
  let details = undefined;

  // Classify common error types
  if (error?.name === "ZodError") {
    code = ERROR_CODES.VALIDATION_ERROR;
    status = 400;
    // in dev, reveal validation issues for debugging
    details = isProd ? undefined : (error.issues || error.errors || error);
    message = isProd ? message : "Validation Error";
  } else if (error?.code === ERROR_CODES.UNAUTHORIZED || error?.status === 401 || error?.name === "AuthError") {
    code = ERROR_CODES.UNAUTHORIZED;
    status = 401;
    message = error?.message || message;
  } else if (error?.code && Object.values(ERROR_CODES).includes(error.code)) {
    // If an error already provides one of our codes, use it.
    code = error.code;
    // If the error included an explicit status use it
    status = error.status || status;
  }

  // Log full details internally (redact stack in prod)
  logger.error(`Error in ${context}`, {
    message: error?.message,
    stack: isProd ? "REDACTED" : (error?.stack || "no stack"),
    code,
    context,
  });

  // Return a safe JSON response
  const clientDetails = isProd ? undefined : details ?? (error?.stack || error?.message);
  return sendError(message, code, status, clientDetails);
}
