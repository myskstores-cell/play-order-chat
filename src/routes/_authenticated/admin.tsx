import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { claimFirstAdmin } from "@/lib/admin.functions";
import { adminApi, type CategoryInput, type ProductInput } from "@/api/adminApi";
import { slugify } from "@/services/adminService";
import type { CategoryRow, ProductRow } from "@/db/types";
import { Button } from "@/components/common/Button";
import { Input, Textarea } from "@/components/common/Input";
import { LoadingState } from "@/components/common/States";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Catalog Admin | SK Sport Store" },
      {
        name: "description",
        content: "Manage SK Sport Store products and categories.",
      },
      { property: "og:title", content: "Catalog Admin | SK Sport Store" },
      { property: "og:description", content: "Internal catalog management." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const fieldLabel =
  "block text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const selectClass =
  "w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none";

function useIsAdmin() {
  return useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      if (!userId) return false;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (error) throw error;
      return !!data;
    },
  });
}

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: isAdmin, isLoading } = useIsAdmin();

  const claim = useMutation({
    mutationFn: () => claimFirstAdmin(),
    onSuccess: (result) => {
      if (result.granted) {
        toast.success("You are now an admin.");
        queryClient.invalidateQueries({ queryKey: ["is-admin"] });
      } else {
        toast.error(result.reason ?? "Could not grant admin access.");
      }
    },
    onError: () => toast.error("Could not grant admin access."),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading) return <LoadingState label="Checking access…" />;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="display-title text-3xl">No admin access</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your account is signed in but does not have the admin role. If you are setting
          the store up for the first time, you can claim admin access below.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Button onClick={() => claim.mutate()} disabled={claim.isPending}>
            {claim.isPending ? "Working…" : "Claim admin access"}
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <AdminDashboard onSignOut={signOut} />;
}

function AdminDashboard({ onSignOut }: { onSignOut: () => void }) {
  const [tab, setTab] = useState<"products" | "categories">("products");

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Staff area</p>
          <h1 className="display-title mt-1 text-3xl sm:text-4xl">Catalog admin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add, edit and remove products and categories. Changes appear on the storefront
            immediately.
          </p>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 flex gap-2 border-b border-border">
        {(["products", "categories"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-semibold uppercase tracking-wide ${
              tab === key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "products" ? <ProductsPanel /> : <CategoriesPanel />}
      </div>
    </div>
  );
}

/* ------------------------------- products -------------------------------- */

const emptyProduct: ProductInput = {
  name: "",
  slug: "",
  sku: "",
  price: 0,
  stock_status: "in_stock",
  is_active: true,
  is_featured: false,
  sort_order: 0,
};

function ProductsPanel() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<ProductRow | "new" | null>(null);

  const products = useQuery({ queryKey: ["admin", "products"], queryFn: adminApi.products });
  const categories = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminApi.categories,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const save = useMutation({
    mutationFn: ({ id, data }: { id?: string; data: ProductInput }) =>
      id ? adminApi.updateProduct(id, data) : adminApi.createProduct(data),
    onSuccess: () => {
      toast.success("Product saved");
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message || "Could not save the product"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteProduct(id),
    onSuccess: () => {
      toast.success("Product deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message || "Could not delete the product"),
  });

  const categoryName = useMemo(() => {
    const map = new Map((categories.data ?? []).map((c) => [c.id, c.name]));
    return (id: string | null) => (id ? (map.get(id) ?? "—") : "—");
  }, [categories.data]);

  if (products.isLoading) return <LoadingState label="Loading products…" />;
  if (products.error)
    return <p className="text-sm text-destructive">Could not load products.</p>;

  if (editing) {
    return (
      <ProductForm
        product={editing === "new" ? null : editing}
        categories={categories.data ?? []}
        saving={save.isPending}
        onCancel={() => setEditing(null)}
        onSave={(data) =>
          save.mutate(editing === "new" ? { data } : { id: editing.id, data })
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {products.data?.length ?? 0} products
        </p>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" aria-hidden="true" /> New product
        </Button>
      </div>

      <div className="surface-panel mt-4 overflow-x-auto rounded-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(products.data ?? []).map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <span className="font-semibold text-foreground">{p.name}</span>
                  <span className="block text-xs text-muted-foreground">{p.sku}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {categoryName(p.category_id)}
                </td>
                <td className="px-4 py-3">{formatPrice(Number(p.price))}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.stock_status.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={p.is_active ? "text-success" : "text-muted-foreground"}
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Edit ${p.name}`}
                      onClick={() => setEditing(p)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Delete ${p.name}`}
                      disabled={remove.isPending}
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"? This cannot be undone.`))
                          remove.mutate(p.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  categories,
  saving,
  onSave,
  onCancel,
}: {
  product: ProductRow | null;
  categories: CategoryRow[];
  saving: boolean;
  onSave: (data: ProductInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ProductInput>(
    product
      ? {
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          category_id: product.category_id,
          description: product.description,
          short_description: product.short_description,
          price: Number(product.price),
          compare_at_price:
            product.compare_at_price === null ? null : Number(product.compare_at_price),
          image_url: product.image_url,
          size: product.size,
          brand: product.brand,
          sport: product.sport,
          gender: product.gender,
          material: product.material,
          stock_status: product.stock_status,
          is_featured: product.is_featured,
          is_active: product.is_active,
          sort_order: product.sort_order,
        }
      : { ...emptyProduct },
  );

  const set = (patch: ProductInput) => setForm((f) => ({ ...f, ...patch }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = (form.name ?? "").trim();
    if (!name) return toast.error("Name is required");
    onSave({
      ...form,
      name,
      slug: (form.slug ?? "").trim() || slugify(name),
      sku: (form.sku ?? "").trim() || slugify(name).toUpperCase().slice(0, 20),
      price: Number(form.price) || 0,
      compare_at_price:
        form.compare_at_price === null || form.compare_at_price === undefined
          ? null
          : Number(form.compare_at_price) || null,
      category_id: form.category_id || null,
      sort_order: Number(form.sort_order) || 0,
    });
  }

  return (
    <form onSubmit={submit} className="surface-panel space-y-5 rounded-sm p-5">
      <h2 className="display-title text-2xl">
        {product ? `Edit ${product.name}` : "New product"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          required
          value={form.name ?? ""}
          onChange={(e) => set({ name: e.target.value })}
        />
        <Input
          label="Slug"
          hint="Leave blank to generate from the name"
          value={form.slug ?? ""}
          onChange={(e) => set({ slug: e.target.value })}
        />
        <Input
          label="SKU"
          value={form.sku ?? ""}
          onChange={(e) => set({ sku: e.target.value })}
        />
        <div className="space-y-1.5">
          <label className={fieldLabel} htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className={selectClass}
            value={form.category_id ?? ""}
            onChange={(e) => set({ category_id: e.target.value || null })}
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Price"
          type="number"
          min={0}
          step="0.01"
          value={String(form.price ?? 0)}
          onChange={(e) => set({ price: Number(e.target.value) })}
        />
        <Input
          label="Compare-at price"
          type="number"
          min={0}
          step="0.01"
          value={form.compare_at_price === null ? "" : String(form.compare_at_price ?? "")}
          onChange={(e) =>
            set({ compare_at_price: e.target.value === "" ? null : Number(e.target.value) })
          }
        />
        <Input
          label="Image URL"
          value={form.image_url ?? ""}
          onChange={(e) => set({ image_url: e.target.value })}
        />
        <Input
          label="Brand"
          value={form.brand ?? ""}
          onChange={(e) => set({ brand: e.target.value })}
        />
        <Input
          label="Sport"
          value={form.sport ?? ""}
          onChange={(e) => set({ sport: e.target.value })}
        />
        <Input
          label="Gender"
          value={form.gender ?? ""}
          onChange={(e) => set({ gender: e.target.value })}
        />
        <Input
          label="Size"
          value={form.size ?? ""}
          onChange={(e) => set({ size: e.target.value })}
        />
        <Input
          label="Material"
          value={form.material ?? ""}
          onChange={(e) => set({ material: e.target.value })}
        />
        <div className="space-y-1.5">
          <label className={fieldLabel} htmlFor="stock">
            Stock status
          </label>
          <select
            id="stock"
            className={selectClass}
            value={form.stock_status ?? "in_stock"}
            onChange={(e) => set({ stock_status: e.target.value })}
          >
            <option value="in_stock">In stock</option>
            <option value="low_stock">Low stock</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </div>
        <Input
          label="Sort order"
          type="number"
          value={String(form.sort_order ?? 0)}
          onChange={(e) => set({ sort_order: Number(e.target.value) })}
        />
      </div>

      <Textarea
        label="Short description"
        value={form.short_description ?? ""}
        onChange={(e) => set({ short_description: e.target.value })}
      />
      <Textarea
        label="Description"
        value={form.description ?? ""}
        onChange={(e) => set({ description: e.target.value })}
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.is_active}
            onChange={(e) => set({ is_active: e.target.checked })}
          />
          Visible on the storefront
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!form.is_featured}
            onChange={(e) => set({ is_featured: e.target.checked })}
          />
          Featured
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

/* ------------------------------ categories ------------------------------- */

function CategoriesPanel() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<CategoryRow | "new" | null>(null);

  const categories = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminApi.categories,
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const save = useMutation({
    mutationFn: ({ id, data }: { id?: string; data: CategoryInput }) =>
      id ? adminApi.updateCategory(id, data) : adminApi.createCategory(data),
    onSuccess: () => {
      toast.success("Category saved");
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message || "Could not save the category"),
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message || "Could not delete the category"),
  });

  if (categories.isLoading) return <LoadingState label="Loading categories…" />;
  if (categories.error)
    return <p className="text-sm text-destructive">Could not load categories.</p>;

  if (editing) {
    return (
      <CategoryForm
        category={editing === "new" ? null : editing}
        saving={save.isPending}
        onCancel={() => setEditing(null)}
        onSave={(data) =>
          save.mutate(editing === "new" ? { data } : { id: editing.id, data })
        }
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {categories.data?.length ?? 0} categories
        </p>
        <Button onClick={() => setEditing("new")}>
          <Plus className="h-4 w-4" aria-hidden="true" /> New category
        </Button>
      </div>

      <div className="surface-panel mt-4 overflow-x-auto rounded-sm">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground">
            <tr className="border-b border-border">
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(categories.data ?? []).map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-semibold text-foreground">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className={c.is_active ? "text-success" : "text-muted-foreground"}
                  >
                    {c.is_active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Edit ${c.name}`}
                      onClick={() => setEditing(c)}
                    >
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      aria-label={`Delete ${c.name}`}
                      disabled={remove.isPending}
                      onClick={() => {
                        if (
                          confirm(
                            `Delete "${c.name}"? Products in it will lose their category.`,
                          )
                        )
                          remove.mutate(c.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryForm({
  category,
  saving,
  onSave,
  onCancel,
}: {
  category: CategoryRow | null;
  saving: boolean;
  onSave: (data: CategoryInput) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<CategoryInput>(
    category
      ? {
          name: category.name,
          slug: category.slug,
          description: category.description,
          image_url: category.image_url,
          is_active: category.is_active,
          sort_order: category.sort_order,
        }
      : { name: "", slug: "", is_active: true, sort_order: 0 },
  );

  const set = (patch: CategoryInput) => setForm((f) => ({ ...f, ...patch }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = (form.name ?? "").trim();
    if (!name) return toast.error("Name is required");
    onSave({
      ...form,
      name,
      slug: (form.slug ?? "").trim() || slugify(name),
      sort_order: Number(form.sort_order) || 0,
    });
  }

  return (
    <form onSubmit={submit} className="surface-panel space-y-5 rounded-sm p-5">
      <h2 className="display-title text-2xl">
        {category ? `Edit ${category.name}` : "New category"}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          required
          value={form.name ?? ""}
          onChange={(e) => set({ name: e.target.value })}
        />
        <Input
          label="Slug"
          hint="Leave blank to generate from the name"
          value={form.slug ?? ""}
          onChange={(e) => set({ slug: e.target.value })}
        />
        <Input
          label="Image URL"
          value={form.image_url ?? ""}
          onChange={(e) => set({ image_url: e.target.value })}
        />
        <Input
          label="Sort order"
          type="number"
          value={String(form.sort_order ?? 0)}
          onChange={(e) => set({ sort_order: Number(e.target.value) })}
        />
      </div>
      <Textarea
        label="Description"
        value={form.description ?? ""}
        onChange={(e) => set({ description: e.target.value })}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!form.is_active}
          onChange={(e) => set({ is_active: e.target.checked })}
        />
        Visible on the storefront
      </label>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save category"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
