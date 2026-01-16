# @mynth/sdk

Official SDK for the [Mynth](https://mynth.io) AI image generation API.

## Installation

```bash
npm install @mynth/sdk
# or
bun add @mynth/sdk
```

## Quick Start

```typescript
import Mynth from "@mynth/sdk";

const mynth = new Mynth({ apiKey: "your-api-key" });

// Generate an image (sync mode - waits for completion)
const task = await mynth.generate({
  prompt: "A beautiful sunset over mountains",
  model: "black-forest-labs/flux.1-dev",
});

console.log("Task completed:", task.id);
```

## Async Mode

For long-running tasks, use async mode to get a task handle immediately:

```typescript
const task = await mynth.generate(
  {
    prompt: "A futuristic cityscape",
    model: "black-forest-labs/flux.1-dev",
  },
  { mode: "async" },
);

console.log("Task started:", task.id);

// Wait for completion when ready
const completedTask = await task;
```

## Available Models

- `black-forest-labs/flux.1-dev` - FLUX.1 Dev
- `black-forest-labs/flux-1-schnell` - FLUX.1 Schnell
- `black-forest-labs/flux.2-dev` - FLUX.2 Dev
- `tongyi-mai/z-image-turbo` - Z Image Turbo

## Request Options

```typescript
const task = await mynth.generate({
  prompt: {
    positive: "A serene lake at dawn",
    negative: "people, buildings",
    magic: true, // Enable prompt enhancement
  },
  model: "black-forest-labs/flux.1-dev",
  size: "landscape", // or "portrait", "square", "instagram", { width: 1024, height: 768 }
  count: 1,
  output: {
    format: "png", // "png", "jpg", "webp"
    quality: 90,
    upscale: 2, // 2x or 4x upscaling
  },
  webhook: {
    enabled: true,
    custom: [{ url: "https://your-webhook.com/endpoint" }],
  },
  metadata: {
    customField: "value",
  },
});
```

## Convex Integration

The SDK includes a Convex webhook handler for easy integration:

```typescript
import { mynthWebhookAction } from "@mynth/sdk/convex";

export const mynthWebhook = mynthWebhookAction({
  imageTaskCompleted: async (payload, { context }) => {
    console.log("Image generated:", payload.result.images);
  },
});
```

Set `MYNTH_WEBHOOK_SECRET` in your environment variables.

## Error Handling

```typescript
import {
  Mynth,
  TaskAsyncTimeoutError,
  TaskAsyncUnauthorizedError,
  TaskAsyncFetchError,
} from "@mynth/sdk";

try {
  const task = await mynth.generate({ ... });
} catch (error) {
  if (error instanceof TaskAsyncTimeoutError) {
    console.error("Task polling timed out");
  } else if (error instanceof TaskAsyncUnauthorizedError) {
    console.error("Invalid API key or access denied");
  } else if (error instanceof TaskAsyncFetchError) {
    console.error("Network error while polling task status");
  }
}
```

## Documentation

For full documentation, visit [docs.mynth.io](https://docs.mynth.io).

## License

MIT
