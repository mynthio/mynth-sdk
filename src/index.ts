import { MynthClient } from "./client";
import { AVAILABLE_MODELS, GENERATE_IMAGE_PATH } from "./constants";
import type { Task } from "./task";
import {
  TaskAsync,
  TaskAsyncFetchError,
  TaskAsyncTaskFetchError,
  TaskAsyncTimeoutError,
  TaskAsyncUnauthorizedError,
} from "./task-async";
import type { MynthSDKTypes } from "./types";

type GenerateOptions = {
  mode?: "sync" | "async";
  // future options: timeout, etc.
};

// Extract metadata type from ImageGenerationRequest
type ExtractMetadata<T extends MynthSDKTypes.ImageGenerationRequest> =
  T["metadata"];

// Extract content rating configuration from ImageGenerationRequest
type ExtractContentRatingConfig<T extends MynthSDKTypes.ImageGenerationRequest> =
  T["content_rating"];

// Extract content rating levels for custom mode - handle both mutable and readonly arrays
type ExtractContentRatingLevels<T extends MynthSDKTypes.ImageGenerationRequest> =
  ExtractContentRatingConfig<T> extends { levels: readonly (infer L)[] }
    ? L
    : ExtractContentRatingConfig<T> extends { levels: (infer L)[] }
    ? L
    : never;

// Extract content rating level values as union type
type ExtractContentRatingLevelValues<T extends MynthSDKTypes.ImageGenerationRequest> =
  ExtractContentRatingLevels<T> extends { value: infer V }
    ? V extends string
      ? V
      : never
    : never;

// Determine if content rating is custom (has levels defined)
type IsContentRatingCustom<T extends MynthSDKTypes.ImageGenerationRequest> =
  ExtractContentRatingConfig<T> extends { levels: readonly any[] | any[] }
    ? true
    : false;

// Create the appropriate content rating response type based on request config
type ExtractContentRatingResponse<T extends MynthSDKTypes.ImageGenerationRequest> =
  IsContentRatingCustom<T> extends true
    ? {
        mode: "custom";
        level: ExtractContentRatingLevelValues<T>;
      }
    : ExtractContentRatingConfig<T> extends { enabled?: true }
    ? {
        mode: "default";
        level: MynthSDKTypes.ImageResultContentRatingDefaultLevel;
      }
    : MynthSDKTypes.ImageResultContentRating | undefined;

class Mynth {
  private readonly client: MynthClient;

  constructor(options: { apiKey: string; baseUrl?: string }) {
    this.client = new MynthClient({
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
    });
  }

  // Overload signatures with const parameter to preserve literal types
  public async generate<const T extends MynthSDKTypes.ImageGenerationRequest>(
    request: T
  ): Promise<Task<ExtractMetadata<T>, ExtractContentRatingResponse<T>>>;
  public async generate<const T extends MynthSDKTypes.ImageGenerationRequest>(
    request: T,
    opts: { mode: "async" }
  ): Promise<TaskAsync<ExtractMetadata<T>, ExtractContentRatingResponse<T>>>;
  public async generate<const T extends MynthSDKTypes.ImageGenerationRequest>(
    request: T,
    opts: { mode: "sync" }
  ): Promise<Task<ExtractMetadata<T>, ExtractContentRatingResponse<T>>>;

  // Implementation
  public async generate<const T extends MynthSDKTypes.ImageGenerationRequest>(
    request: T,
    opts: GenerateOptions = {}
  ): Promise<Task<ExtractMetadata<T>, ExtractContentRatingResponse<T>> | TaskAsync<ExtractMetadata<T>, ExtractContentRatingResponse<T>>> {
    const mode = opts.mode ?? "sync";

    const json = await this.client.post<{
      taskId: string;
      access?: {
        publicAccessToken: string;
      };
    }>(GENERATE_IMAGE_PATH, request);

    const taskAsync = new TaskAsync<ExtractMetadata<T>, ExtractContentRatingResponse<T>>(json.taskId, {
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
  TaskAsyncTaskFetchError,
};
export type { MynthSDKTypes };
export default Mynth;
