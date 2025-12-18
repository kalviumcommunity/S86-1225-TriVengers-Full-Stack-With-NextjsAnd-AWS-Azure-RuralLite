import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock responseHandler.sendError and logger
vi.mock("../lib/responseHandler", () => ({
  sendError: vi.fn((message, code, status, details) => ({ message, code, status, details })),
}));

// Mock logger using inline vi.fn to avoid hoisting initialization issues
vi.mock("../lib/logger", () => ({
  logger: { error: vi.fn() },
}));

// Import after mocks so imports use mocks
import { handleError } from "../lib/errorHandler";
import { ERROR_CODES } from "../lib/errorCodes";
import { sendError } from "../lib/responseHandler";
import { logger } from "../lib/logger";

beforeEach(() => {
  vi.resetModules();
  // Reset mocks
  (logger.error as any).mockReset();
  (sendError as any).mockClear();
});

describe("handleError", () => {
  it("handles generic Error in development (shows message and stack)", () => {
    process.env.NODE_ENV = "development";
    const err = new Error("Test failure");

    const res = handleError(err, "TEST CONTEXT");

    expect((sendError as any)).toHaveBeenCalled();
    expect(res).toEqual({ message: "Test failure", code: ERROR_CODES.INTERNAL_ERROR, status: 500, details: expect.any(String) });
    expect(logger.error).toHaveBeenCalledWith("Error in TEST CONTEXT", expect.objectContaining({ message: "Test failure", code: ERROR_CODES.INTERNAL_ERROR }));
    expect(logger.error.mock.calls[0][1].stack).toContain("Error");
  });

  it("handles generic Error in production (redacts stack and uses safe message)", () => {
    process.env.NODE_ENV = "production";
    const err = new Error("Database exploded");

    const res = handleError(err, "GET /api/users");

    expect((sendError as any)).toHaveBeenCalledWith("Something went wrong. Please try again later.", ERROR_CODES.INTERNAL_ERROR, 500, undefined);
    expect(res).toEqual({ message: "Something went wrong. Please try again later.", code: ERROR_CODES.INTERNAL_ERROR, status: 500, details: undefined });
    expect(logger.error).toHaveBeenCalledWith("Error in GET /api/users", expect.objectContaining({ stack: "REDACTED" }));
  });

  it("maps ZodError to VALIDATION_ERROR and exposes issues in dev", () => {
    process.env.NODE_ENV = "development";
    const zodErr = { name: "ZodError", issues: [{ path: ["email"], message: "Invalid email" }], message: "Invalid input" } as any;

    const res = handleError(zodErr, "POST /api/users (validation)");

    expect((sendError as any)).toHaveBeenCalledWith("Validation Error", ERROR_CODES.VALIDATION_ERROR, 400, expect.any(Object));
    expect(res.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(logger.error).toHaveBeenCalledWith("Error in POST /api/users (validation)", expect.objectContaining({ code: ERROR_CODES.VALIDATION_ERROR }));
  });

  it("maps unauthorized errors to UNAUTHORIZED", () => {
    process.env.NODE_ENV = "development";
    const unauthorized = { status: 401, message: "No token" } as any;

    const res = handleError(unauthorized, "GET /api/private");

    expect((sendError as any)).toHaveBeenCalledWith("No token", ERROR_CODES.UNAUTHORIZED, 401, expect.any(String));
    expect(res.code).toBe(ERROR_CODES.UNAUTHORIZED);
  });

  it("respects provided error.code if it matches known codes", () => {
    process.env.NODE_ENV = "development";
    const err = { code: ERROR_CODES.CONFLICT, status: 409, message: "Duplicate" } as any;

    const res = handleError(err, "POST /api/users");

    expect((sendError as any)).toHaveBeenCalledWith("Duplicate", ERROR_CODES.CONFLICT, 409, expect.any(String));
    expect(res.code).toBe(ERROR_CODES.CONFLICT);
  });
});
