import { getDatabase } from "@/db/database";
import { TABLES, type CategoryRow } from "@/db/types";
import type { Category } from "@/models/Category";
import type { Product } from "@/models/Product";
import { storageService } from "./storageService";
import { productService } from "./productService";

function toCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: storageService.getImageUrl(row.image_url) || null,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const rows = await getDatabase().find<CategoryRow>(
      TABLES.categories,
      { is_active: true },
      { orderBy: [{ column: "sort_order" }, { column: "name" }] },
    );
    return rows.map(toCategory);
  },

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const rows = await getDatabase().find<CategoryRow>(TABLES.categories, {
      slug,
      is_active: true,
    });
    return rows[0] ? toCategory(rows[0]) : null;
  },

  async getCategoryProducts(slug: string): Promise<Product[]> {
    return productService.getProductsByCategory(slug);
  },
};
