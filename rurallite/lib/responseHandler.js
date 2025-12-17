import { NextResponse } from "next/server";

export const buildSuccess = (data = null, message = "Success", meta) => {
  const payload = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  if (meta && Object.keys(meta).length > 0) payload.meta = meta;

  return payload;
};

export const buildError = (message = "Something went wrong", code = "INTERNAL_ERROR", details) => {
  return {
    success: false,
    message,
    error: { code, details },
    timestamp: new Date().toISOString(),
  };
};

export const sendSuccess = (data = null, message = "Success", status = 200, meta) => {
  return NextResponse.json(buildSuccess(data, message, meta), { status });
};

export const sendError = (message = "Something went wrong", code = "INTERNAL_ERROR", status = 500, details) => {
  return NextResponse.json(buildError(message, code, details), { status });
};
