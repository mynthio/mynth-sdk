/**
 * Type definitions for the Mynth SDK.
 * Import as `import type { MynthSDKTypes } from "@mynthio/sdk"`.
 */
export namespace MynthSDKTypes {
  /** Status of a generation task */
  export type TaskStatus = "pending" | "completed" | "failed";

  /** Type of task (currently only "image" is supported) */
  export type TaskType = "image";

  /** Full task data returned from the API */
  export type TaskData = {
    /** Unique task identifier */
    id: string;
    /** Current status of the task */
    status: TaskStatus;
    /** Type of task */
    type: TaskType;
    /** ID of the API key used (null for public access) */
    apiKeyId: string | null;
    /** ID of the user who created the task */
    userId: string;
    /** Total cost in string format (null if not yet calculated) */
    cost: string | null;
    /** Generation result (null if not completed) */
    result: ImageResult | null;
    /** Original generation request (null if not available) */
    request: ImageGenerationRequestDb | null;
    /** ISO 8601 timestamp of creation */
    createdAt: string;
    /** ISO 8601 timestamp of last update */
    updatedAt: string;
  };

  /** Available model identifiers */
  export type ImageGenerationModelId =
    | "black-forest-labs/flux.1-dev"
    | "black-forest-labs/flux-1-schnell"
    | "black-forest-labs/flux.2-dev"
    | "google/gemini-3-pro-image-preview"
    | "tongyi-mai/z-image-turbo"
    | "john6666/bismuth-illustrious-mix"
    | "wan/wan2.6-image"
    | "xai/grok-imagine-image";

  /** Model to use for generation ("auto" lets the system choose) */
  export type ImageGenerationModel = ImageGenerationModelId | "auto";

  /** Structured prompt with positive and optional negative text */
  export type PromptStructured = {
    /** Main prompt describing what to generate */
    positive: string;
    /** Elements to exclude from the generation */
    negative?: string;
  };

  export type GenerateImageOptionsIn = {
    prompt: string | PromptStructured;
  };

  export type GenerateImageOptions = {
    prompt: PromptStructured;
  };

  /**
   * Prompt input for image generation.
   * Can be a simple string or structured with positive/negative prompts.
   */
  export type ImageGenerationRequestPrompt =
    | string
    | {
        /** Main prompt describing what to generate */
        positive: string;
        /** Elements to exclude (model support varies) */
        negative?: string;
        /** Enable AI prompt enhancement (default: true) */
        magic?: boolean;
      };

  /** Access configuration for the generated task */
  export type ImageGenerationRequestAccess = {
    /** Public access token configuration */
    pat?: {
      /** Generate a public access token for client-side polling */
      enabled?: boolean;
    };
  };

  /** Output image format */
  export type ImageGenerationRequestOutputFormat = "png" | "jpg" | "webp";

  /** Upscale configuration */
  export type ImageGenerationRequestUpscale =
    | 2
    | 4
    | {
        enabled?: boolean;
        factor?: 2 | 4;
      };

  /** Output configuration for generated images */
  export type ImageGenerationRequestOutput = {
    /** Image format (default: "webp") */
    format?: ImageGenerationRequestOutputFormat;
    /** Quality 1-100 (default varies by format) */
    quality?: number;
    /** Upscale factor (2x or 4x) */
    upscale?: ImageGenerationRequestUpscale;
  };

  /** Custom webhook endpoint configuration */
  export type ImageGenerationRequestCustomWebhook = {
    /** URL to receive webhook notifications */
    url: string;
  };

  /** Webhook configuration */
  export type ImageGenerationRequestWebhook = {
    /** Enable/disable webhooks (disabling overrides dashboard settings) */
    enabled?: boolean;
    /** Additional custom webhook endpoints */
    custom?: ImageGenerationRequestCustomWebhook[];
  };

  /** Custom content rating level definition */
  export type ImageGenerationRequestContentRatingLevel<
    T extends string = string,
  > = {
    /** Level identifier returned in the result */
    value: T;
    /** Human-readable description for the AI classifier */
    description: string;
  };

  /** Content rating configuration */
  export type ImageGenerationRequestContentRating = {
    /** Enable content rating classification */
    enabled?: boolean;
    /** Custom rating levels (uses default sfw/nsfw if not provided) */
    levels?: readonly ImageGenerationRequestContentRatingLevel[];
  };

  /**
   * Image size specification.
   * Can be a preset name, dimension string, or explicit dimensions.
   */
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

  /**
   * Image generation request parameters.
   */
  export type ImageGenerationRequest = {
    /** Text prompt or structured prompt object */
    prompt: ImageGenerationRequestPrompt;
    /** Model to use (default: "auto") */
    model?: ImageGenerationModel;
    /** Image size/dimensions (default: "auto") */
    size?: ImageGenerationRequestSize;
    /** Number of images to generate (default: 1) */
    count?: number;
    /** Output format and quality settings */
    output?: ImageGenerationRequestOutput;
    /** Public access token configuration */
    access?: ImageGenerationRequestAccess;
    /** Webhook notification settings */
    webhook?: ImageGenerationRequestWebhook;
    /** Content rating classification settings */
    content_rating?: ImageGenerationRequestContentRating;
    /** Custom metadata to attach (returned in results and webhooks). Max 2KB. */
    metadata?: Record<string, unknown>;
  };

  /** @internal Stored prompt format */
  export type ImageGenerationRequestDbPrompt = {
    positive: string;
    negative?: string;
    magic?: boolean;
  };

  /** @internal */
  export type ImageGenerationRequestDbWebhook = ImageGenerationRequestWebhook;

  /** @internal */
  export type ImageGenerationRequestDbContentRating =
    ImageGenerationRequestContentRating;

  /** @internal Stored request format */
  export type ImageGenerationRequestDb = {
    prompt: ImageGenerationRequestDbPrompt;
    model?: ImageGenerationModel;
    size?: ImageGenerationRequestSize;
    count: number;
    output?: ImageGenerationRequestOutput;
    webhook?: ImageGenerationRequestDbWebhook;
    content_rating?: ImageGenerationRequestDbContentRating;
    metadata?: Record<string, unknown>;
  };

  /** Default content rating levels */
  export type ImageResultContentRatingDefaultLevel = "sfw" | "nsfw";

  /** Content rating result */
  export type ImageResultContentRating =
    | {
        mode: "default";
        level: ImageResultContentRatingDefaultLevel;
      }
    | {
        mode: "custom";
        level: string;
      };

  /** Successfully generated image */
  export type ImageResultImageSuccess = {
    status: "succeeded";
    /** Image ID */
    id: string;
    /** CDN URL of the generated image */
    url: string;
    /** Provider-specific image identifier */
    provider_id: string;
    /** Cost for this image in string format */
    cost: string;
    /** Content rating if classification was enabled */
    content_rating?: ImageResultContentRating;
  };

  /** Failed image generation */
  export type ImageResultImageFailure = {
    status: "failed";
    /** Error message describing the failure */
    error: string;
  };

  /** Individual image result (success or failure) */
  export type ImageResultImage =
    | ImageResultImageSuccess
    | ImageResultImageFailure;

  /** Cost breakdown for the generation */
  export type ImageResultCost = {
    /** Cost of image generation */
    images: string;
    /** Total cost including all fees */
    total: string;
    /** Platform fee */
    fee: string;
  };

  /** Model-specific settings used for generation */
  export type ImageResultSettings = {
    /** Number of inference steps (model-dependent) */
    steps?: number;
  };

  /** Complete generation result */
  export type ImageResult = {
    /** Array of generated images (may include failures) */
    images: ImageResultImage[];
    /** Cost breakdown */
    cost: ImageResultCost;
    /** Model that was used */
    model_id: ImageGenerationModelId;
    /** Image size as a string (e.g., "1024x1024") */
    size: string;
    /** Model-specific settings */
    settings: ImageResultSettings;
    /** Auto-enhanced prompt (when magic prompt is enabled) */
    magic_prompt?: {
      positive: string;
      negative?: string;
    };
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
