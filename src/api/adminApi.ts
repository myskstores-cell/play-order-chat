import { adminService, type CategoryInput, type ProductInput } from "@/services/adminService";

/** UI-facing admin API. Admin screens call this, never the database. */
export const adminApi = {
  products: () => adminService.listProducts(),
  categories: () => adminService.listCategories(),
  createProduct: (data: ProductInput) => adminService.createProduct(data),
  updateProduct: (id: string, data: ProductInput) => adminService.updateProduct(id, data),
  deleteProduct: (id: string) => adminService.deleteProduct(id),
  createCategory: (data: CategoryInput) => adminService.createCategory(data),
  updateCategory: (id: string, data: CategoryInput) => adminService.updateCategory(id, data),
  deleteCategory: (id: string) => adminService.deleteCategory(id),
};

export type { CategoryInput, ProductInput };
