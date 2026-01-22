export namespace MynthSDKTypes {
  export type TaskStatus = "pending" | "completed" | "failed";

  export type TaskType = "image";

  export type TaskData = {
    id: string;
    status: TaskStatus;
    type: TaskType;
    apiKeyId: string | null;
    userId: string;
    cost: string | null;
    result: ImageResult | null;
    request: ImageGenerationRequestDb | null;
    createdAt: string;
    updatedAt: string;
  };

  export type ImageGenerationModelId =
    | "black-forest-labs/flux.1-dev"
    | "black-forest-labs/flux-1-schnell"
    | "tongyi-mai/z-image-turbo";

  export type ImageGenerationModel = ImageGenerationModelId | "auto";

  export type PromptStructured = {
    positive: string;
    negative?: string;
  };

  export type GenerateImageOptionsIn = {
    prompt: string | PromptStructured;
  };

  export type GenerateImageOptions = {
    prompt: PromptStructured;
  };

  export function normalizePrompt(
    prompt: string | PromptStructured
  ): PromptStructured {
    if (typeof prompt === "string") {
      return { positive: prompt };
    }
    return prompt;
  }

  export type ImageGenerationRequestPrompt =
    | string
    | {
        positive: string;
        negative?: string;
        magic?: boolean;
      };

  export type ImageGenerationRequestAccess = {
    pat?: {
      enabled?: boolean;
    };
  };

  export type ImageGenerationRequestOutputFormat = "png" | "jpg" | "webp";

  export type ImageGenerationRequestUpscale =
    | 2
    | 4
    | {
        enabled?: boolean;
        factor?: 2 | 4;
      };

  export type ImageGenerationRequestOutput = {
    format?: ImageGenerationRequestOutputFormat;
    quality?: number;
    upscale?: ImageGenerationRequestUpscale;
  };

  export type ImageGenerationRequestCustomWebhook = {
    url: string;
  };

  export type ImageGenerationRequestWebhook = {
    enabled?: boolean;
    custom?: ImageGenerationRequestCustomWebhook[];
  };

  export type ImageGenerationRequestContentRatingLevel<
    T extends string = string,
  > = {
    value: T;
    description: string;
  };

  export type ImageGenerationRequestContentRating = {
    enabled?: boolean;
    levels?: readonly ImageGenerationRequestContentRatingLevel[];
  };

  export type ImageGenerationRequestSize =
    | "instagram"
    | "square"
    | "portrait"
    | "landscape"
    | `${number}x${number}`
    | {
        width: number;
        height: number;
        mode?: "strict" | "preset" | "aligned";
      }
    | "auto";

  export type ImageGenerationRequest = {
    prompt: ImageGenerationRequestPrompt;
    model?: ImageGenerationModel;
    size?: ImageGenerationRequestSize;
    count?: number;
    output?: ImageGenerationRequestOutput;
    access?: ImageGenerationRequestAccess;
    webhook?: ImageGenerationRequestWebhook;
    content_rating?: ImageGenerationRequestContentRating;
    metadata?: Record<string, string | number | boolean>;
  };

  export type ImageGenerationRequestDbPrompt = {
    positive: string;
    negative?: string;
    magic?: boolean;
  };

  export type ImageGenerationRequestDbWebhook = ImageGenerationRequestWebhook;

  export type ImageGenerationRequestDbContentRating =
    ImageGenerationRequestContentRating;

  export type ImageGenerationRequestDb = {
    prompt: ImageGenerationRequestDbPrompt;
    model?: ImageGenerationModel;
    size?: ImageGenerationRequestSize;
    count: number;
    output?: ImageGenerationRequestOutput;
    webhook?: ImageGenerationRequestDbWebhook;
    content_rating?: ImageGenerationRequestDbContentRating;
    metadata?: Record<string, string | number | boolean>;
  };

  export type ImageResultContentRatingDefaultLevel =
    | "safe"
    | "suggestive"
    | "explicit";

  export type ImageResultContentRating =
    | {
        mode: "default";
        level: ImageResultContentRatingDefaultLevel;
      }
    | {
        mode: "custom";
        level: string;
      };

  export type ImageResultImageSuccess = {
    status: "succeeded";
    url: string;
    providerId: string;
    cost: string;
    content_rating?: ImageResultContentRating;
  };

  export type ImageResultImageFailure = {
    status: "failed";
    error: string;
  };

  export type ImageResultImage =
    | ImageResultImageSuccess
    | ImageResultImageFailure;

  export type ImageResultCost = {
    images: string;
    total: string;
    fee: string;
  };

  export type ImageResultResolved = {
    resolution?: {
      width: number;
      height: number;
    };
    prompt?: {
      positive: string;
      negative?: string;
    };
  };

  export type ImageResultModelSettings = {
    resolution: {
      width: number;
      height: number;
    };
    steps?: number;
  };

  export type ImageResult = {
    images: ImageResultImage[];
    cost: ImageResultCost;
    model: {
      id: ImageGenerationModelId;
      settings: ImageResultModelSettings;
    };
    resolved: ImageResultResolved;
  };

  /**
   * Webhook payload for task completion
   */
  export type WebhookTaskImageCompletedPayload = {
    task: { id: string };
    event: "task.image.completed";
    result: ImageResult;
    request: ImageGenerationRequestDb;
  };

  /**
   * Webhook payload for task failure
   */
  export type WebhookTaskImageFailedPayload = {
    task: { id: string };
    event: "task.image.failed";
    request: ImageGenerationRequestDb;
    errors: {
      code: string;
      message: string;
    }[];
  };

  /**
   * Webhook payload union
   */
  export type WebhookPayload =
    | WebhookTaskImageCompletedPayload
    | WebhookTaskImageFailedPayload;
}
