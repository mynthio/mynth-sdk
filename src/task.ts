import type { MynthSDKTypes } from "./types";

// Typed image result types based on content rating configuration
type TypedImageResultImageSuccess<ContentRatingT> = Omit<
  MynthSDKTypes.ImageResultImageSuccess,
  "content_rating"
> & {
  content_rating?: ContentRatingT;
};

type TypedImageResultImageFailure = MynthSDKTypes.ImageResultImageFailure;

type TypedImageResultImage<ContentRatingT> =
  | TypedImageResultImageSuccess<ContentRatingT>
  | TypedImageResultImageFailure;

export class Task<
  MetadataT = Record<string, string | number | boolean> | undefined,
  ContentRatingT = MynthSDKTypes.ImageResultContentRating | undefined,
> {
  public readonly data: MynthSDKTypes.TaskData;

  constructor(data: MynthSDKTypes.TaskData) {
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  getImages(options: {
    includeFailed: true;
  }): TypedImageResultImage<ContentRatingT>[];
  getImages(options?: {
    includeFailed?: false;
  }): TypedImageResultImageSuccess<ContentRatingT>[];
  getImages(
    options: { includeFailed?: boolean } = {}
  ):
    | TypedImageResultImage<ContentRatingT>[]
    | TypedImageResultImageSuccess<ContentRatingT>[] {
    if (options.includeFailed)
      return (this.data.result?.images ??
        []) as TypedImageResultImage<ContentRatingT>[];

    return (this.data.result?.images.filter(
      (image) => image.status === "succeeded"
    ) ?? []) as TypedImageResultImageSuccess<ContentRatingT>[];
  }

  getMetadata(): MetadataT {
    return this.data.request?.metadata as MetadataT;
  }
}
