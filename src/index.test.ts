/* eslint-disable unicorn/no-empty-file -- Tests temporarily disabled */
// import { Mynth } from "./index";
// import { Task } from "./task";
// import { TaskAsync } from "./task-async";
// import { afterEach, beforeEach, describe, expect, mock, test } from "bun:test";

// // Mock fetch globally
// const mockFetch = mock(() =>
//   Promise.resolve({
//     json: () =>
//       Promise.resolve({
//         taskId: "test-task-123",
//         access: {
//           publicAccessToken: "test-pat-456",
//         },
//       }),
//   })
// );

// describe("Mynth SDK", () => {
//   beforeEach(() => {
//     globalThis.fetch = mockFetch as unknown as typeof fetch;
//     mockFetch.mockClear();
//   });

//   afterEach(() => {
//     mockFetch.mockClear();
//   });

//   describe("generate", () => {
//     const client = new Mynth({ apiKey: "test-api-key" });

//     describe("mode parameter", () => {
//       test("should return Task when mode is 'sync' (default)", async () => {
//         const result = await client.generate({
//           prompt: "a cat",
//           model: "black-forest-labs/flux.1-dev",
//         });

//         expect(result).toBeInstanceOf(Task);
//         expect(result.id).toBe("test-task-123");
//       });

//       test("should return Task when mode is explicitly 'sync'", async () => {
//         const result = await client.generate(
//           { prompt: "a cat" },
//           { mode: "sync" }
//         );

//         expect(result).toBeInstanceOf(Task);
//         expect(result.id).toBe("test-task-123");
//       });

//       test("should return TaskAsync when mode is 'async'", async () => {
//         const result = await client.generate(
//           { prompt: "a cat" },
//           { mode: "async" }
//         );

//         expect(result).toBeInstanceOf(TaskAsync);
//         expect(result.id).toBe("test-task-123");
//       });

//       test("TaskAsync.complete() should return a Task", async () => {
//         const taskAsync = await client.generate(
//           { prompt: "a cat" },
//           { mode: "async" }
//         );

//         expect(taskAsync).toBeInstanceOf(TaskAsync);

//         const task = await taskAsync.complete();
//         expect(task).toBeInstanceOf(Task);
//         expect(task.id).toBe("test-task-123");
//       });
//     });

//     describe("prompt handling", () => {
//       test("should accept a string prompt", async () => {
//         await client.generate({ prompt: "a beautiful sunset" });

//         expect(mockFetch).toHaveBeenCalledTimes(1);
//         const [, options] = mockFetch.mock.calls[0] as unknown as [
//           string,
//           RequestInit,
//         ];
//         const body = JSON.parse(options.body as string);
//         expect(body.prompt.positive).toBe("a beautiful sunset");
//       });

//       test("should accept a structured prompt with positive text", async () => {
//         await client.generate({
//           prompt: { positive: "a cat", negative: "blurry" },
//         });

//         expect(mockFetch).toHaveBeenCalledTimes(1);
//         const [, options] = mockFetch.mock.calls[0] as unknown as [
//           string,
//           RequestInit,
//         ];
//         const body = JSON.parse(options.body as string);
//         expect(body.prompt.positive).toBe("a cat");
//       });
//     });

//     describe("API request", () => {
//       test("should call the correct endpoint", async () => {
//         await client.generate({ prompt: "test" });

//         expect(mockFetch).toHaveBeenCalledTimes(1);
//         const [url] = mockFetch.mock.calls[0] as unknown as [
//           string,
//           RequestInit,
//         ];
//         expect(url).toBe("http://localhost:3100/image/generate");
//       });

//       test("should include authorization header", async () => {
//         await client.generate({ prompt: "test" });

//         const [, options] = mockFetch.mock.calls[0] as unknown as [
//           string,
//           RequestInit,
//         ];
//         expect(options.headers).toMatchObject({
//           Authorization: "Bearer test-api-key",
//           "Content-Type": "application/json",
//         });
//       });
//     });
//   });
// });
