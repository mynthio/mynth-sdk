/**
 * Image generation model IDs
 */
export type ImageGenerationModelId =
  | "black-forest-labs/flux.1-dev"
  | "black-forest-labs/flux-1-schnell"
  | "tongyi-mai/z-image-turbo";

/**
 * Resolution configuration
 */
export type Resolution = {
  width: number;
  height: number;
  mode?: "strict" | "preset" | "aligned";
};

/**
 * Upscale configuration
 */
export type UpscaleConfig =
  | 2
  | 4
  | {
      enabled?: boolean;
      factor?: 2 | 4;
    };

/**
 * Output settings for image generation
 */
export type ImageRequestOutput = {
  format?: "png" | "jpg" | "webp";
  quality?: number;
  upscale?: UpscaleConfig;
};

/**
 * Content rating level
 */
export type ContentRatingLevel = {
  value: string;
  description: string;
};

/**
 * Content rating settings
 */
export type ContentRating = {
  enabled?: boolean;
  levels?: ContentRatingLevel[];
};

/**
 * Webhook configuration
 */
export type WebhookConfig = {
  enabled?: boolean;
  custom?: {
    url: string;
  }[];
};

/**
 * Prompt configuration
 */
export type Prompt = {
  positive: string;
  negative?: string;
  magic?: boolean;
};

/**
 * Image generation request metadata
 */
export type ImageRequestMetadata = {
  prompt: Prompt;
  model: ImageGenerationModelId;
  size: Resolution | { auto: true };
  count?: number;
  output?: ImageRequestOutput;
  webhook?: WebhookConfig;
  content_rating?: ContentRating;
  metadata?: Record<string, string | number | boolean>;
};

/**
 * Individual image result
 */
export type ImageResultImage = {
  url: string;
  providerId: string;
  cost: string;
  content_rating?:
    | {
        mode: "default";
        level: "safe" | "suggestive" | "explicit";
      }
    | {
        mode: "custom";
        level: string;
      };
};

/**
 * Cost breakdown for image generation
 */
export type ImageResultCost = {
  images: string;
  total: string;
  fee: string;
};

/**
 * Model settings used for generation
 */
export type ImageResultModelSettings = {
  resolution: {
    width: number;
    height: number;
  };
  steps?: number;
};

/**
 * Resolved parameters from the request
 */
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

/**
 * Complete image generation result
 */
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
 * Webhook payload types
 */
export type WebhookTaskImageCompletedPayload = {
  task: { id: string };
  event: "task.image.completed";
  result: ImageResult;
  request: ImageRequestMetadata;
};

export type WebhookPayload = WebhookTaskImageCompletedPayload;

/**
 * Webhook event types
 */
export type WebhookEvent = "task.image.completed";
