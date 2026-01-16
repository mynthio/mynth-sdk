import { MynthClient } from "./client";
import { AVAILABLE_MODELS, GENERATE_IMAGE_URL } from "./constants";
import type { Task } from "./task";
import {
  TaskAsync,
  TaskAsyncFetchError,
  TaskAsyncTimeoutError,
  TaskAsyncUnauthorizedError,
} from "./task-async";
import type { MynthSDKTypes } from "./types";

type GenerateOptions = {
  mode?: "sync" | "async";
  // future options: timeout, etc.
};

class Mynth {
  private readonly client: MynthClient;

  constructor(options: { apiKey: string }) {
    this.client = new MynthClient({ apiKey: options.apiKey });
  }

  // Overload signatures
  public async generate(request: MynthSDKTypes.ImageGenerationRequest): Promise<Task>;
  public async generate(
    request: MynthSDKTypes.ImageGenerationRequest,
    opts: { mode: "async" },
  ): Promise<TaskAsync>;
  public async generate(
    request: MynthSDKTypes.ImageGenerationRequest,
    opts: { mode: "sync" },
  ): Promise<Task>;

  // Implementation
  public async generate(
    request: MynthSDKTypes.ImageGenerationRequest,
    opts: GenerateOptions = {},
  ): Promise<Task | TaskAsync> {
    const mode = opts.mode ?? "sync";

    const json = await this.client.post<{
      taskId: string;
      access?: {
        publicAccessToken: string;
      };
    }>(GENERATE_IMAGE_URL, request);

    const taskAsync = new TaskAsync(json.taskId, {
      client: this.client,
      pat: json.access?.publicAccessToken,
    });

    if (mode === "async") {
      return taskAsync;
    }

    return taskAsync.toTask();
  }
}

export {
  Mynth,
  AVAILABLE_MODELS,
  TaskAsyncTimeoutError,
  TaskAsyncUnauthorizedError,
  TaskAsyncFetchError,
};
export default Mynth;
