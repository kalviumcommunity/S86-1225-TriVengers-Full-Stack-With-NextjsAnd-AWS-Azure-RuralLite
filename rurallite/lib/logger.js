const buildLog = (level, message, meta = {}) => {
  const { requestId, method, endpoint, context, ...rest } = meta || {};
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    requestId,
    method,
    endpoint,
    context,
  };

  if (rest && Object.keys(rest).length > 0) {
    payload.meta = rest;
  }

  return JSON.stringify(payload);
};

export const logger = {
  info: (message, meta = {}) => {
    console.log(buildLog("info", message, meta));
  },
  warn: (message, meta = {}) => {
    console.warn(buildLog("warn", message, meta));
  },
  error: (message, meta = {}) => {
    console.error(buildLog("error", message, meta));
  },
};
