export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface Product {
  id: string;
  categoryId: string | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
  images?: string[];
  size: string | null;

  brand: string | null;
  sport: string | null;
  gender: string | null;
  material: string | null;
  stockStatus: StockStatus;
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface ProductFilters {
  search?: string;
  categorySlug?: string;
  sport?: string;
  brand?: string;
  gender?: string;
  size?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc";

export function isAvailable(product: Product): boolean {
  return product.stockStatus !== "out_of_stock";
}

export function discountPercent(product: Product): number | null {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return null;
  return Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100);
}
