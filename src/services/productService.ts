import { getDatabase } from "@/db/database";
import { TABLES, type CategoryRow, type ProductRow } from "@/db/types";
import type {
  Product,
  ProductFilters,
  ProductSort,
  StockStatus,
} from "@/models/Product";
import { storageService } from "./storageService";

function toNumber(value: number | string | null): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : null;
}

function toProduct(row: ProductRow, categories: Map<string, CategoryRow>): Product {
  const category = row.category_id ? categories.get(row.category_id) : undefined;
  return {
    id: row.id,
    categoryId: row.category_id,
    categoryName: category?.name ?? null,
    categorySlug: category?.slug ?? null,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    description: row.description,
    shortDescription: row.short_description,
    price: toNumber(row.price) ?? 0,
    compareAtPrice: toNumber(row.compare_at_price),
    imageUrl: storageService.getImageUrl(row.image_url) || null,
    size: row.size,
    brand: row.brand,
    sport: row.sport,
    gender: row.gender,
    material: row.material,
    stockStatus: (row.stock_status as StockStatus) ?? "in_stock",
    isFeatured: row.is_featured,
    isActive: row.is_active,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

async function loadAll(): Promise<Product[]> {
  const db = getDatabase();
  const [productRows, categoryRows] = await Promise.all([
    db.find<ProductRow>(
      TABLES.products,
      { is_active: true },
      { orderBy: [{ column: "sort_order" }, { column: "name" }] },
    ),
    db.find<CategoryRow>(TABLES.categories, { is_active: true }),
  ]);
  const categories = new Map(categoryRows.map((c) => [c.id, c]));
  return productRows.map((row) => toProduct(row, categories));
}

function matches(product: Product, filters: ProductFilters): boolean {
  const term = filters.search?.trim().toLowerCase();
  if (term) {
    const haystack = [
      product.name,
      product.brand,
      product.sku,
      product.sport,
      product.categoryName,
      product.shortDescription,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(term)) return false;
  }
  if (filters.categorySlug && product.categorySlug !== filters.categorySlug) return false;
  if (filters.sport && product.sport !== filters.sport) return false;
  if (filters.brand && product.brand !== filters.brand) return false;
  if (filters.gender && product.gender !== filters.gender) return false;
  if (filters.size && product.size !== filters.size) return false;
  if (filters.minPrice !== undefined && product.price < filters.minPrice) return false;
  if (filters.maxPrice !== undefined && product.price > filters.maxPrice) return false;
  if (filters.inStockOnly && product.stockStatus === "out_of_stock") return false;
  return true;
}

export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name-asc":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "featured":
    default:
      return list.sort(
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) || a.sortOrder - b.sortOrder,
      );
  }
}

export const productService = {
  getProducts: loadAll,

  async getProductById(id: string): Promise<Product | null> {
    const all = await loadAll();
    return all.find((p) => p.id === id) ?? null;
  },

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    if (ids.length === 0) return [];
    const all = await loadAll();
    return all.filter((p) => ids.includes(p.id));
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    const all = await loadAll();
    return all.find((p) => p.slug === slug) ?? null;
  },

  async getFeaturedProducts(limit = 8): Promise<Product[]> {
    const all = await loadAll();
    return all.filter((p) => p.isFeatured).slice(0, limit);
  },

  async getNewArrivals(limit = 8): Promise<Product[]> {
    const all = await loadAll();
    return sortProducts(all, "newest").slice(0, limit);
  },

  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const all = await loadAll();
    return all.filter((p) => p.categorySlug === categorySlug);
  },

  async searchProducts(term: string): Promise<Product[]> {
    const all = await loadAll();
    return all.filter((p) => matches(p, { search: term }));
  },

  async filterProducts(
    filters: ProductFilters,
    sort: ProductSort = "featured",
  ): Promise<Product[]> {
    const all = await loadAll();
    return sortProducts(
      all.filter((p) => matches(p, filters)),
      sort,
    );
  },

  async getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
    const all = await loadAll();
    return all
      .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
      .slice(0, limit);
  },
};

export { matches as productMatchesFilters };
