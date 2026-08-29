import type { StorageAdapter } from "@/storage/adapters/StorageAdapter";
import { SupabaseStorageAdapter } from "@/storage/adapters/SupabaseStorageAdapter";

let adapter: StorageAdapter = new SupabaseStorageAdapter();

export function setStorageAdapter(next: StorageAdapter) {
  adapter = next;
}

export const storageService = {
  uploadImage: (file: File, path: string) => adapter.uploadImage(file, path),
  deleteImage: (path: string) => adapter.deleteImage(path),
  getImageUrl: (path: string | null | undefined) =>
    path ? adapter.getImageUrl(path) : "",
};
