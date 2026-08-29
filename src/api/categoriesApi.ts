import { categoryService } from "@/services/categoryService";

/** UI-facing category API. */
export const categoriesApi = {
  list: () => categoryService.getCategories(),
  bySlug: (slug: string) => categoryService.getCategoryBySlug(slug),
  products: (slug: string) => categoryService.getCategoryProducts(slug),
};
