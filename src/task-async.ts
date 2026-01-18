import type { MynthClient } from "./client";
import { TASK_DETAILS_PATH, TASK_STATUS_PATH } from "./constants";
import { Task } from "./task";
import type { MynthSDKTypes } from "./types";

const POLLING_TIMEOUT_MS = 1000 * 60 * 5; // 5 minutes
const FAST_POLLING_DURATION_MS = 12_000; // 12 seconds of fast polling
const FAST_POLLING_INTERVAL_MS = 2_500; // 2.5 seconds
const SLOW_POLLING_INTERVAL_MS = 5_000; // 5 seconds
const MAX_RETRY_COUNT = 7;

export class TaskAsyncTimeoutError extends Error {
  constructor(taskId: string) {
    super(`Task ${taskId} polling timed out after ${POLLING_TIMEOUT_MS}ms`);
    this.name = "TaskAsyncTimeoutError";
  }
}

export class TaskAsyncUnauthorizedError extends Error {
  constructor(taskId: string) {
    super(`Unauthorized access to task ${taskId}`);
    this.name = "TaskAsyncUnauthorizedError";
  }
}

export class TaskAsyncFetchError extends Error {
  constructor(taskId: string, cause?: Error) {
    super(`Failed to fetch status for task ${taskId} after multiple retries`);
    this.name = "TaskAsyncFetchError";
    this.cause = cause;
  }
}

export class TaskAsyncTaskFetchError extends Error {
  constructor(taskId: string, status?: number) {
    const suffix = status ? ` (status ${status})` : "";
    super(`Failed to fetch task ${taskId}${suffix}`);
    this.name = "TaskAsyncTaskFetchError";
  }
}

type FetchStatusResult =
  | { ok: true; status: MynthSDKTypes.TaskStatus }
  | { ok: false; unauthorized: boolean; retryable: boolean; error?: Error };

export class TaskAsync<
  MetadataT = Record<string, string | number | boolean> | undefined,
  ContentRatingT = MynthSDKTypes.ImageResultContentRating | undefined,
> {
  public readonly id: string;

  private readonly client: MynthClient;

  private readonly access: { pat?: string };

  private _completionPromise: Promise<Task<MetadataT, ContentRatingT>> | null = null;

  constructor(id: string, options: { client: MynthClient; pat?: string }) {
    this.id = id;

    this.client = options.client;
    this.access = { pat: options.pat };
  }

  toString(): string {
    return this.id;
  }

  public async toTask(): Promise<Task<MetadataT, ContentRatingT>> {
    // Lazy init - only start polling when explicitly requested
    if (!this._completionPromise) {
      this._completionPromise = this.pollUntilCompleted();
    }

    return this._completionPromise;
  }

  private async pollUntilCompleted(): Promise<Task<MetadataT, ContentRatingT>> {
    const startTime = Date.now();
    let retryCount = 0;
    let useApiKeyFallback = false;
    let lastError: Error | undefined;

    while (true) {
      const elapsed = Date.now() - startTime;

      console.log("polling", this.id, elapsed);

      if (elapsed >= POLLING_TIMEOUT_MS) {
        throw new TaskAsyncTimeoutError(this.id);
      }

      const result = await this.fetchStatus(useApiKeyFallback);

      console.log("result", this.id, result, "\n\n\n");

      if (result.ok) {
        retryCount = 0;

        if (result.status === "completed") {
          const taskData = await this.fetchTask();
          return new Task(taskData);
        }
      } else {
        if (result.unauthorized) {
          // If using PAT and got unauthorized, try falling back to API key
          if (this.access.pat && !useApiKeyFallback) {
            useApiKeyFallback = true;
            continue; // Retry immediately with API key
          }
          // Both PAT and API key failed, or no PAT was used
          throw new TaskAsyncUnauthorizedError(this.id);
        }

        if (result.retryable) {
          retryCount++;
          lastError = result.error;

          if (retryCount >= MAX_RETRY_COUNT) {
            throw new TaskAsyncFetchError(this.id, lastError);
          }
        }
      }

      // Calculate polling interval with slight randomness
      const isInFastPhase = elapsed < FAST_POLLING_DURATION_MS;
      const baseInterval = isInFastPhase
        ? FAST_POLLING_INTERVAL_MS
        : SLOW_POLLING_INTERVAL_MS;
      const jitter = Math.random() * 500; // 0-500ms randomness
      const interval = baseInterval + jitter;

      // Don't wait longer than remaining timeout
      const remainingTime = POLLING_TIMEOUT_MS - elapsed;
      const waitTime = Math.min(interval, remainingTime);

      await this.sleep(waitTime);
    }
  }

  private async fetchStatus(useApiKey: boolean): Promise<FetchStatusResult> {
    const accessToken =
      useApiKey || !this.access.pat ? undefined : this.access.pat;

    try {
      const response = await this.client.get<{
        status: MynthSDKTypes.TaskStatus;
      }>(TASK_STATUS_PATH(this.id), {
        accessToken,
      });

      if (response.ok) {
        return { ok: true, status: response.data.status };
      }

      // 401 or 403 are unauthorized
      if (response.status === 401 || response.status === 403) {
        return { ok: false, unauthorized: true, retryable: false };
      }

      // 404 means task not found or no access - treat as unauthorized
      if (response.status === 404) {
        return { ok: false, unauthorized: true, retryable: false };
      }

      // 5xx errors are retryable
      if (response.status >= 500) {
        return { ok: false, unauthorized: false, retryable: true };
      }

      // Other 4xx errors are not retryable
      return { ok: false, unauthorized: false, retryable: false };
    } catch (error) {
      // Network errors, connection failures etc. are retryable
      return {
        ok: false,
        unauthorized: false,
        retryable: true,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  private async fetchTask(): Promise<MynthSDKTypes.TaskData> {
    const response = await this.client.get<MynthSDKTypes.TaskData>(
      TASK_DETAILS_PATH(this.id)
    );

    if (response.ok) {
      return response.data;
    }

    if (response.status === 401 || response.status === 403) {
      throw new TaskAsyncUnauthorizedError(this.id);
    }

    if (response.status === 404) {
      throw new TaskAsyncUnauthorizedError(this.id);
    }

    throw new TaskAsyncTaskFetchError(this.id, response.status);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
