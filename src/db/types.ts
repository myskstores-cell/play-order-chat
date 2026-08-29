/** Database-level row shapes (provider agnostic). */

export const TABLES = {
  categories: "categories",
  products: "products",
} as const;

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductRow {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  short_description: string | null;
  price: number | string;
  compare_at_price: number | string | null;
  image_url: string | null;
  size: string | null;
  brand: string | null;
  sport: string | null;
  gender: string | null;
  material: string | null;
  stock_status: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
