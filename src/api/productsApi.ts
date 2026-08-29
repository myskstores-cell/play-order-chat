import type { Product, ProductFilters, ProductSort } from "@/models/Product";
import { productService } from "@/services/productService";

/** UI-facing product API. Components call this, never the database. */
export const productsApi = {
  list: (): Promise<Product[]> => productService.getProducts(),
  byId: (id: string) => productService.getProductById(id),
  bySlug: (slug: string) => productService.getProductBySlug(slug),
  featured: (limit?: number) => productService.getFeaturedProducts(limit),
  newArrivals: (limit?: number) => productService.getNewArrivals(limit),
  byCategory: (slug: string) => productService.getProductsByCategory(slug),
  search: (term: string) => productService.searchProducts(term),
  filter: (filters: ProductFilters, sort?: ProductSort) =>
    productService.filterProducts(filters, sort),
  related: (product: Product, limit?: number) =>
    productService.getRelatedProducts(product, limit),
};
