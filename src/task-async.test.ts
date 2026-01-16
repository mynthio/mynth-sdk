import { describe, expect, test } from "bun:test";

import { Mynth } from "./index";

describe("Mynth", () => {
  test("creates instance", () => {
    const mynth = new Mynth({ apiKey: "test-api-key" });
    expect(mynth).toBeInstanceOf(Mynth);
  });
});
