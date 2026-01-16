export namespace MynthSDKTypes {
  export type TaskStatus = "pending" | "completed";

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

  /**
   * Normalize the prompt input to a structured format
   */
  export function normalizePrompt(prompt: string | PromptStructured): PromptStructured {
    if (typeof prompt === "string") {
      return { positive: prompt };
    }
    return prompt;
  }

  // Image Generation Request Type
  export type ImageGenerationRequestPrompt =
    | string
    | {
        positive: string;
        negative?: string;
        magic?: boolean;
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

  export type ImageGenerationRequestContentRatingLevel = {
    value: string;
    description: string;
  };

  export type ImageGenerationRequestContentRating = {
    enabled?: boolean;
    levels?: ImageGenerationRequestContentRatingLevel[];
  };

  export type ImageGenerationRequestAccess = {
    pat?: {
      enabled?: boolean;
    };
  };

  export type ImageGenerationRequest = {
    prompt: ImageGenerationRequestPrompt;
    model:
      | "black-forest-labs/flux.1-dev"
      | "black-forest-labs/flux-1-schnell"
      | "tongyi-mai/z-image-turbo";
    size?: ImageGenerationRequestSize;
    count?: number;
    output?: ImageGenerationRequestOutput;
    access?: ImageGenerationRequestAccess;
    content_rating?: ImageGenerationRequestContentRating;
    webhook?: ImageGenerationRequestWebhook;
    metadata?: Record<string, string | number | boolean>;
  };
}
