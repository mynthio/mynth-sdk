import type { MynthSDKTypes } from "./types";

export class Task {
  public readonly data: MynthSDKTypes.TaskData;

  constructor(data: MynthSDKTypes.TaskData) {
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  getImages(options: { includeFailed: true }): MynthSDKTypes.ImageResultImage[];
  getImages(options?: {
    includeFailed?: false;
  }): MynthSDKTypes.ImageResultImageSuccess[];
  getImages(
    options: { includeFailed?: boolean } = {}
  ):
    | MynthSDKTypes.ImageResultImage[]
    | MynthSDKTypes.ImageResultImageSuccess[] {
    if (options.includeFailed) return this.data.result?.images ?? [];

    return (
      this.data.result?.images.filter(
        (image) => image.status === "succeeded"
      ) ?? []
    );
  }

  getMetadata<MetadataT = unknown>(): MetadataT {
    return this.data.metadata as MetadataT;
  }
}
