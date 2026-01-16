import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

import { Mynth } from "./index";
import { Task } from "./task";

describe("TaskAsync polling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("should resolve to Task after polling returns completed status", async () => {
    // Arrange
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({ taskId: "test-task-123", access: { publicAccessToken: "pat" } }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: "pending" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: "pending" }),
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ status: "completed" }),
      });
    vi.stubGlobal("fetch", mockFetch);

    const client = new Mynth({ apiKey: "test-api-key" });

    // Act
    const taskPromise = client.generate({
      prompt: "a cat",
      model: "black-forest-labs/flux.1-dev",
    });

    await vi.advanceTimersToNextTimerAsync();
    await vi.advanceTimersToNextTimerAsync();

    // Assert
    await expect(taskPromise).resolves.toBeInstanceOf(Task);
  });
});
