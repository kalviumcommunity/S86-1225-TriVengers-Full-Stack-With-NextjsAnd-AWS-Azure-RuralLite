import { NextResponse } from "next/server";

export type ErrorPayload = {
  code: string;
  details?: any;
};

export type ApiSuccess<T = any> = {
  success: true;
  message: string;
  data?: T;
  meta?: Record<string, any>;
  timestamp: string;
};

export type ApiError = {
  success: false;
  message: string;
  error: ErrorPayload;
  timestamp: string;
};

export const buildSuccess = <T = any>(
  data: T = null,
  message = "Success",
  meta?: Record<string, any>
): ApiSuccess<T> => {
  const payload: ApiSuccess<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (meta && Object.keys(meta).length > 0) payload.meta = meta;

  return payload;
};

export const buildError = (
  message = "Something went wrong",
  code = "INTERNAL_ERROR",
  details?: any
): ApiError => {
  return {
    success: false,
    message,
    error: { code, details },
    timestamp: new Date().toISOString(),
  };
};

export const sendSuccess = (
  data: any = null,
  message = "Success",
  status = 200,
  meta?: Record<string, any>
) => {
  return NextResponse.json(buildSuccess(data, message, meta), { status });
};

export const sendError = (
  message = "Something went wrong",
  code = "INTERNAL_ERROR",
  status = 500,
  details?: any
) => {
  return NextResponse.json(buildError(message, code, details), { status });
};
