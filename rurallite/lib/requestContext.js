import { randomUUID } from "crypto";

// Build per-request metadata for structured logs and error handling
export function getRequestContext(req, context = "unknown") {
  const url = req?.url ? new URL(req.url) : null;
  const requestId = req?.headers?.get?.("x-request-id") || randomUUID();

  const base = {
    requestId,
    method: req?.method,
    endpoint: url?.pathname,
    context,
  };

  const withMeta = (meta = {}) => ({ ...base, ...meta });

  return { ...base, withMeta };
}
