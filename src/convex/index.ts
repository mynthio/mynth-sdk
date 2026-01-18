import type { GenericActionCtx } from "convex/server";

import type { MynthSDKTypes } from "../types";
import { tryToGetWebhookSecretFromEnv, verifySignature } from "./utils";

// Webhook header constants
const WEBHOOK_HEADERS_EVENT = "X-Mynth-Event";
const WEBHOOK_HEADERS_SIGNATURE = "X-Mynth-Signature";

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex generic requires any
type EventHandlers<T extends GenericActionCtx<any> = GenericActionCtx<any>> = {
  imageTaskCompleted?: (
    payload: MynthSDKTypes.WebhookTaskImageCompletedPayload,
    context: { context: T; request: Request }
  ) => Promise<void>;
  imageTaskFailed?: (
    payload: MynthSDKTypes.WebhookTaskImageFailedPayload,
    context: { context: T; request: Request }
  ) => Promise<void>;
};

type MynthWebhookActionOptions = {
  webhookSecret?: string;
};

export const mynthWebhookAction = (
  eventHandlers: EventHandlers,
  options?: MynthWebhookActionOptions
) => {
  const webhookSecret =
    options?.webhookSecret ?? tryToGetWebhookSecretFromEnv();

  if (!webhookSecret) {
    throw new Error("`MYNTH_WEBHOOK_SECRET` is not set");
  }

  // Return a function that matches PublicHttpAction signature
  return async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Convex generic requires any
    _ctx: GenericActionCtx<any>,
    request: Request
  ): Promise<Response> => {
    const signature = request.headers.get(WEBHOOK_HEADERS_SIGNATURE);

    if (!signature) {
      return new Response("Unauthorized", { status: 401 });
    }

    const event = request.headers.get(WEBHOOK_HEADERS_EVENT);

    if (!event) {
      return new Response("Unauthorized", { status: 401 });
    }

    const bodyRaw = await request.text();
    const isValid = await verifySignature(bodyRaw, signature, webhookSecret);

    if (!isValid) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = JSON.parse(bodyRaw) as MynthSDKTypes.WebhookPayload;

    console.log("payload", payload);

    switch (payload.event) {
      case "task.image.completed":
        await eventHandlers.imageTaskCompleted?.(payload, {
          context: _ctx,
          request,
        });
        break;
      case "task.image.failed":
        await eventHandlers.imageTaskFailed?.(payload, {
          context: _ctx,
          request,
        });
        break;
      default:
        return new Response("Unauthorized", { status: 401 });
    }

    return new Response(undefined, { status: 200 });
  };
};
