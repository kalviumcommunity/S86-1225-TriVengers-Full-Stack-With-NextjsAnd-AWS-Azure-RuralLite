import { describe, expect, it, vi } from "vitest";
import { logger } from "../lib/logger";

describe("logger", () => {
  it("logger.info prints valid JSON with level 'info'", () => {
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    logger.info("hello world", { a: 1 });
    expect(spy).toHaveBeenCalled();
    const printed = spy.mock.calls[0][0];
    const parsed = JSON.parse(printed);
    expect(parsed.level).toBe("info");
    expect(parsed.message).toBe("hello world");
    expect(parsed.meta).toEqual({ a: 1 });
    spy.mockRestore();
  });

  it("logger.error prints valid JSON with level 'error'", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error("bad", { code: "X" });
    expect(spy).toHaveBeenCalled();
    const printed = spy.mock.calls[0][0];
    const parsed = JSON.parse(printed);
    expect(parsed.level).toBe("error");
    expect(parsed.message).toBe("bad");
    expect(parsed.meta).toEqual({ code: "X" });
    spy.mockRestore();
  });
});
