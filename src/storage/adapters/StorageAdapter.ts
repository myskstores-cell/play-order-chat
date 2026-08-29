/** Provider-agnostic file storage contract. */
export interface StorageAdapter {
  uploadImage(file: File, path: string): Promise<string>;
  deleteImage(path: string): Promise<void>;
  getImageUrl(path: string): string;
}

export class StorageError extends Error {
  constructor(
    message: string,
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = "StorageError";
  }
}
