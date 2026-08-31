import { getDatabase } from "@/db/database";
import { TABLES, type CategoryRow, type ProductRow } from "@/db/types";

/**
 * Admin catalog service. Unlike the storefront services it reads every row
 * (including inactive ones) and supports writes. All access is enforced by
 * database policies: only users holding the admin role can write.
 */

export type ProductInput = Partial<Omit<ProductRow, "id" | "created_at" | "updated_at">>;
export type CategoryInput = Partial<Omit<CategoryRow, "id" | "created_at" | "updated_at">>;

export const adminService = {
  listProducts(): Promise<ProductRow[]> {
    return getDatabase().find<ProductRow>(
      TABLES.products,
      {},
      { orderBy: [{ column: "sort_order" }, { column: "name" }] },
    );
  },

  listCategories(): Promise<CategoryRow[]> {
    return getDatabase().find<CategoryRow>(
      TABLES.categories,
      {},
      { orderBy: [{ column: "sort_order" }, { column: "name" }] },
    );
  },

  createProduct(data: ProductInput): Promise<ProductRow> {
    return getDatabase().create<ProductRow>(TABLES.products, data as Partial<ProductRow>);
  },

  updateProduct(id: string, data: ProductInput): Promise<ProductRow> {
    return getDatabase().update<ProductRow>(TABLES.products, id, data as Partial<ProductRow>);
  },

  deleteProduct(id: string): Promise<void> {
    return getDatabase().delete(TABLES.products, id);
  },

  createCategory(data: CategoryInput): Promise<CategoryRow> {
    return getDatabase().create<CategoryRow>(TABLES.categories, data as Partial<CategoryRow>);
  },

  updateCategory(id: string, data: CategoryInput): Promise<CategoryRow> {
    return getDatabase().update<CategoryRow>(TABLES.categories, id, data as Partial<CategoryRow>);
  },

  deleteCategory(id: string): Promise<void> {
    return getDatabase().delete(TABLES.categories, id);
  },
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
