export const API_URL = "https://api.mynth.io";

export const GENERATE_IMAGE_PATH = "/image/generate";
export const TASK_PATH = "/tasks";
export const TASK_DETAILS_PATH = (id: string) => `${TASK_PATH}/${id}`;
export const TASK_STATUS_PATH = (id: string) => `${TASK_PATH}/${id}/status`;

export const AVAILABLE_MODELS = [
  {
    id: "black-forest-labs/flux.1-dev",
    label: "FLUX.1 Dev",
    capabilities: ["magic_prompt", "steps"] as const,
  },
  {
    id: "black-forest-labs/flux-1-schnell",
    label: "FLUX.1 Schnell",
    capabilities: ["magic_prompt"] as const,
  },
  {
    id: "tongyi-mai/z-image-turbo",
    label: "Z Image Turbo",
    capabilities: ["magic_prompt", "steps"] as const,
  },
  {
    id: "black-forest-labs/flux.2-dev",
    label: "FLUX.2 Dev",
    capabilities: ["magic_prompt", "steps"] as const,
  },
] as const;
