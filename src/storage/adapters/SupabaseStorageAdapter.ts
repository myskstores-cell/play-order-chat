import { supabaseClient } from "@/db/supabase/supabaseClient";
import { StorageError, type StorageAdapter } from "./StorageAdapter";

export class SupabaseStorageAdapter implements StorageAdapter {
  constructor(private readonly bucket = "product-images") {}

  async uploadImage(file: File, path: string): Promise<string> {
    const { error } = await supabaseClient.storage
      .from(this.bucket)
      .upload(path, file, { upsert: true });
    if (error) throw new StorageError("Failed to upload image", error);
    return this.getImageUrl(path);
  }

  async deleteImage(path: string): Promise<void> {
    const { error } = await supabaseClient.storage.from(this.bucket).remove([path]);
    if (error) throw new StorageError("Failed to delete image", error);
  }

  getImageUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("/")) return path;
    return supabaseClient.storage.from(this.bucket).getPublicUrl(path).data.publicUrl;
  }
}
