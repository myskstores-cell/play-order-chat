import { useMemo, useState, useRef, useEffect } from "react";

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Pencil,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  LogOut,
  Star,
  Layers,
  ArrowUp,
  ArrowDown,
  Sparkles,
  RefreshCw,
  Check,
  Search,
  MessageCircle,
  Package,
  Tag,
  Percent,
} from "lucide-react";

import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { adminApi, type CategoryInput, type ProductInput } from "@/api/adminApi";
import { slugify } from "@/services/adminService";
import { storageService } from "@/services/storageService";
import {
  homepageSettingsService,
  type BestSellersConfig,
  type KitPresetConfig,
  DEFAULT_BEST_SELLERS_CONFIG,
  DEFAULT_KIT_PRESETS,
} from "@/services/homepageSettingsService";
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

const fieldLabel = "block text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const selectClass =
  "w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none";

interface ImageUploadProps {
  label: string;
  value: string | null | undefined;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
}

function ImageUpload({ label, value, onChange, folder = "products", hint }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file (PNG, JPG, WEBP, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size should be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${folder}/${Date.now()}_${cleanName}`;
      const url = await storageService.uploadImage(file, path);
      onChange(url);
      toast.success("Photo uploaded successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-primary hover:underline font-medium"
        >
          {showUrlInput ? "Hide Direct Link" : "Or Enter Direct Link / URL"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start rounded-sm border border-border/80 bg-background/60 p-3.5">
        {value ? (
          <div className="relative group h-24 w-24 shrink-0 overflow-hidden rounded-xs border border-border bg-surface">
            <img
              src={value}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 rounded-full bg-destructive/90 text-destructive-foreground p-1 opacity-90 group-hover:opacity-100 hover:bg-destructive transition-all"
              title="Remove photo"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xs border border-dashed border-border bg-surface/50 text-muted-foreground">
            <ImageIcon className="h-8 w-8 stroke-1 opacity-40" />
          </div>
        )}

        <div className="flex-1 space-y-2 w-full">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />

          <div className="flex flex-wrap gap-2 items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="text-xs h-9 font-bold"
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Uploading…
                </>
              ) : (
                <>
                  <Upload className="mr-1.5 h-3.5 w-3.5 text-primary" />
                  {value ? "Change Photo" : "Upload Photo File"}
                </>
              )}
            </Button>

            {value && (
              <span className="text-[11px] font-semibold text-success">✓ Photo uploaded</span>
            )}
          </div>

          <p className="text-[11px] text-muted-foreground">
            {hint ||
              "Upload PNG, JPG or WEBP (up to 5MB). Photo is stored directly in Supabase Storage."}
          </p>

          {showUrlInput && (
            <div className="pt-1">
              <input
                type="text"
                placeholder="https://... or /images/..."
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xs border border-input bg-surface px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface MultiImageUploadProps {
  label: string;
  value: string | null | undefined;
  onChange: (value: string) => void;
  maxPhotos?: number;
}

function MultiImageUpload({ label, value, onChange, maxPhotos = 6 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse existing photos from comma-separated or JSON string
  const photos: string[] = useMemo(() => {
    if (!value) return [];
    const trimmed = value.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.filter((u): u is string => typeof u === "string" && !!u.trim());
        }
      } catch {
        return [trimmed];
      }
    }
    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [trimmed];
  }, [value]);

  function updatePhotos(newPhotos: string[]) {
    if (newPhotos.length === 0) {
      onChange("");
    } else if (newPhotos.length === 1) {
      onChange(newPhotos[0] ?? "");
    } else {
      onChange(JSON.stringify(newPhotos));
    }
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum of ${maxPhotos} photos allowed.`);
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      toast.info(`Uploading first ${remainingSlots} photos (max limit is ${maxPhotos}).`);
    }

    setUploading(true);
    try {
      const uploadedUrls: string[] = [];
      for (const file of filesToUpload) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image file.`);
          continue;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} exceeds 5MB limit.`);
          continue;
        }
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const path = `products/${Date.now()}_${cleanName}`;
        const url = await storageService.uploadImage(file, path);
        uploadedUrls.push(url);
      }

      if (uploadedUrls.length > 0) {
        updatePhotos([...photos, ...uploadedUrls]);
        toast.success(
          `Uploaded ${uploadedUrls.length} photo${uploadedUrls.length > 1 ? "s" : ""}!`,
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload photos.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleAddUrl() {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (photos.length >= maxPhotos) {
      toast.error(`Maximum of ${maxPhotos} photos allowed.`);
      return;
    }
    updatePhotos([...photos, trimmed]);
    setUrlInput("");
    setShowUrlInput(false);
    toast.success("Photo URL added!");
  }

  function handleRemove(index: number) {
    const next = photos.filter((_, i) => i !== index);
    updatePhotos(next);
  }

  function handleSetPrimary(index: number) {
    if (index === 0) return;
    const selected = photos[index];
    if (!selected) return;
    const rest = photos.filter((_, i) => i !== index);
    updatePhotos([selected, ...rest]);
    toast.success("Set as primary photo!");
  }

  return (
    <div className="space-y-3 rounded-sm border border-border/80 bg-background/60 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              {label}
            </span>
            <span className="rounded-2xs bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-black">
              {photos.length} / {maxPhotos} PHOTOS
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Add up to {maxPhotos} product photos. The first photo is the primary display image.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            multiple
            onChange={handleFiles}
            className="hidden"
            disabled={photos.length >= maxPhotos || uploading}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={photos.length >= maxPhotos || uploading}
            onClick={() => fileInputRef.current?.click()}
            className="h-8 text-xs font-bold"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Uploading…
              </>
            ) : (
              <>
                <Upload className="mr-1.5 h-3.5 w-3.5 text-primary" />
                Upload Photos ({maxPhotos - photos.length} left)
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={photos.length >= maxPhotos}
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="h-8 text-xs font-medium text-primary hover:text-primary"
          >
            + Link URL
          </Button>
        </div>
      </div>

      {showUrlInput && (
        <div className="flex gap-2 p-2 rounded-xs bg-surface border border-border">
          <input
            type="text"
            placeholder="Paste image URL (https://... or /images/...)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 rounded-xs border border-input bg-background px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddUrl();
              }
            }}
          />
          <Button type="button" size="sm" onClick={handleAddUrl} className="h-8 text-xs">
            Add Link
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowUrlInput(false)}
            className="h-8 text-xs"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Photos Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
        {photos.map((photoUrl, idx) => (
          <div
            key={`${photoUrl}-${idx}`}
            className={`group relative aspect-square rounded-xs overflow-hidden border-2 bg-surface transition-all ${
              idx === 0
                ? "border-primary shadow-md shadow-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <img
              src={photoUrl}
              alt={`Product photo ${idx + 1}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />

            {/* Badge */}
            <span
              className={`absolute top-1 left-1 rounded-2xs px-1.5 py-0.5 text-[9px] font-black ${
                idx === 0
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface/90 text-muted-foreground border border-border"
              }`}
            >
              {idx === 0 ? "★ PRIMARY" : `#${idx + 1}`}
            </span>

            {/* Actions overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="self-end rounded-full bg-destructive text-destructive-foreground p-1 hover:brightness-110 transition-all"
                title="Delete photo"
              >
                <X className="h-3 w-3" />
              </button>

              {idx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetPrimary(idx)}
                  className="w-full rounded-2xs bg-primary/90 text-primary-foreground py-1 text-[9px] font-bold uppercase tracking-wider hover:bg-primary transition-all"
                >
                  Set Primary
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Empty placeholder slots up to 6 */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center aspect-square rounded-xs border-2 border-dashed border-border/80 hover:border-primary/60 bg-surface/30 hover:bg-surface/60 text-muted-foreground hover:text-primary transition-all"
          >
            <Plus className="h-5 w-5 stroke-2 mb-1" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Photo {photos.length + 1}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

function AdminPage() {
  return <AdminDashboard />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<
    "products" | "categories" | "best_sellers" | "kit_builder" | "homepage"
  >("products");

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      <div>
        <p className="eyebrow">Staff area</p>
        <h1 className="display-title mt-1 text-2xl sm:text-4xl">Catalog admin</h1>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Add, edit and remove products, categories, homepage best sellers and sport kit bundles. Changes appear on the
          storefront immediately.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 flex gap-1.5 sm:gap-2 border-b border-border overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-3 px-3 sm:mx-0 sm:px-0">
        {[
          { key: "products", label: "Products" },
          { key: "categories", label: "Categories" },
          { key: "best_sellers", label: 'Best Sellers ("POPULAR EQUIPMENT")' },
          { key: "kit_builder", label: 'Kit Builder ("Cricket & Sports Kits")' },
          { key: "homepage", label: 'Featured 3 Sports ("Choose Your Game")' },
        ].map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() =>
              setTab(
                key as "products" | "categories" | "best_sellers" | "kit_builder" | "homepage",
              )
            }
            className={`-mb-px border-b-2 px-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wide whitespace-nowrap transition-colors rounded-t-xs ${
              tab === key
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-5 sm:mt-6">
        {tab === "products" ? (
          <ProductsPanel />
        ) : tab === "categories" ? (
          <CategoriesPanel />
        ) : tab === "best_sellers" ? (
          <BestSellersAdminPanel />
        ) : tab === "kit_builder" ? (
          <KitBuilderAdminPanel />
        ) : (
          <HomepageFeaturedPanel />
        )}
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
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return products.data ?? [];
    return (products.data ?? []).filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        (p.sport && p.sport.toLowerCase().includes(term)) ||
        (p.brand && p.brand.toLowerCase().includes(term)) ||
        categoryName(p.category_id).toLowerCase().includes(term),
    );
  }, [products.data, searchTerm, categoryName]);

  if (products.isLoading) return <LoadingState label="Loading products…" />;
  if (products.error) return <p className="text-sm text-destructive">Could not load products.</p>;

  if (editing) {
    return (
      <ProductForm
        product={editing === "new" ? null : editing}
        categories={categories.data ?? []}
        saving={save.isPending}
        onCancel={() => setEditing(null)}
        onSave={(data) => save.mutate(editing === "new" ? { data } : { id: editing.id, data })}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Bar: Count, Search & New Product Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <p className="text-xs sm:text-sm font-semibold text-muted-foreground">
            {products.data?.length ?? 0} products in catalog
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search products, SKU…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xs border border-input bg-background pl-8 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <Button onClick={() => setEditing("new")} className="w-full sm:w-auto h-9 font-bold text-xs">
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" /> New Product
          </Button>
        </div>
      </div>

      {/* Mobile Card List (Visible on mobile screens < md) */}
      <div className="block md:hidden space-y-3">
        {filteredProducts.map((p) => {
          const hasDiscount =
            p.compare_at_price && Number(p.compare_at_price) > Number(p.price);
          const discountPct = hasDiscount
            ? Math.round(
                ((Number(p.compare_at_price) - Number(p.price)) /
                  Number(p.compare_at_price)) *
                  100,
              )
            : 0;

          return (
            <div key={p.id} className="surface-panel rounded-sm border border-border p-3.5 space-y-3 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xs border border-border bg-surface relative">
                  {p.image_url ? (
                    <img
                      src={
                        p.image_url.startsWith("[")
                          ? JSON.parse(p.image_url)[0]
                          : p.image_url.split(",")[0]
                      }
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                      No photo
                    </div>
                  )}
                  {hasDiscount && (
                    <span className="absolute top-0.5 right-0.5 rounded-2xs bg-emerald-500 text-black px-1 py-0.2 text-[8px] font-black">
                      {discountPct}% OFF
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">{p.name}</h4>
                  <p className="text-[11px] text-muted-foreground font-mono mt-0.5">{p.sku}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {categoryName(p.category_id)} {p.sport ? `• ${p.sport}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-foreground">
                    {formatPrice(Number(p.price))}
                  </span>
                  {hasDiscount && (
                    <span className="text-[11px] text-muted-foreground line-through">
                      {formatPrice(Number(p.compare_at_price))}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-2xs font-bold ${
                      p.stock_status === "in_stock"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : p.stock_status === "low_stock"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-destructive/20 text-destructive border border-destructive/30"
                    }`}
                  >
                    {p.stock_status.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-2xs font-bold ${
                      p.is_active
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(p)}
                  className="w-full text-xs font-bold h-9"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={remove.isPending}
                  onClick={() => {
                    if (confirm(`Delete "${p.name}"? This cannot be undone.`))
                      remove.mutate(p.id);
                  }}
                  className="w-full text-xs font-bold text-destructive hover:bg-destructive/10 h-9"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (Visible on screens >= md) */}
      <div className="hidden md:block surface-panel overflow-x-auto rounded-sm">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-surface-strong/30">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              const hasDiscount =
                p.compare_at_price && Number(p.compare_at_price) > Number(p.price);
              const discountPct = hasDiscount
                ? Math.round(
                    ((Number(p.compare_at_price) - Number(p.price)) /
                      Number(p.compare_at_price)) *
                      100,
                  )
                : 0;

              return (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xs border border-border bg-surface">
                        {p.image_url ? (
                          <img
                            src={
                              p.image_url.startsWith("[")
                                ? JSON.parse(p.image_url)[0]
                                : p.image_url.split(",")[0]
                            }
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div>
                        <span className="font-semibold text-foreground block">{p.name}</span>
                        <span className="block text-xs text-muted-foreground font-mono">{p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{categoryName(p.category_id)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground">
                        {formatPrice(Number(p.price))}
                      </span>
                      {hasDiscount && (
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground line-through">
                            {formatPrice(Number(p.compare_at_price))}
                          </span>
                          <span className="text-[9px] text-emerald-400 font-bold">
                            ({discountPct}% OFF)
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span
                      className={`text-xs font-semibold ${
                        p.stock_status === "in_stock"
                          ? "text-emerald-400"
                          : p.stock_status === "low_stock"
                          ? "text-amber-400"
                          : "text-destructive"
                      }`}
                    >
                      {p.stock_status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={p.is_active ? "text-success font-medium" : "text-muted-foreground"}>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function generateAutoSku(name?: string): string {
  const clean = (name ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 4);
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `SK-${clean || "PROD"}-${randomSuffix}`;
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
  const [form, setForm] = useState<ProductInput>(() =>
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
      : { ...emptyProduct, sku: generateAutoSku() },
  );

  const set = (patch: ProductInput) => setForm((f) => ({ ...f, ...patch }));

  // Track percentage offer state
  const initialDiscount =
    product && Number(product.compare_at_price) > Number(product.price)
      ? Math.round(
          ((Number(product.compare_at_price) - Number(product.price)) /
            Number(product.compare_at_price)) *
            100,
        )
      : 0;

  const [offerPercentInput, setOfferPercentInput] = useState<number>(initialDiscount);

  const priceNum = Number(form.price) || 0;
  const compareNum = Number(form.compare_at_price) || 0;
  const hasDiscount = compareNum > priceNum && priceNum > 0;
  const calculatedDiscountPercent = hasDiscount
    ? Math.round(((compareNum - priceNum) / compareNum) * 100)
    : 0;
  const savingsAmount = hasDiscount ? compareNum - priceNum : 0;

  function applyQuickPercent(pct: number) {
    setOfferPercentInput(pct);
    const mrp = Number(form.compare_at_price) || 0;
    const currentPrice = Number(form.price) || 0;
    if (mrp > 0) {
      set({ price: Math.round(mrp * (1 - pct / 100)) });
    } else if (currentPrice > 0) {
      const calculatedMrp = Math.round(currentPrice / (1 - pct / 100));
      set({ compare_at_price: calculatedMrp });
    } else {
      toast.info("Please enter a Price or MRP first to apply discount.");
    }
  }

  function clearOffer() {
    setOfferPercentInput(0);
    set({ compare_at_price: null });
    toast.info("Offer cleared (Standard price only).");
  }

  function handleNameChange(newName: string) {
    setForm((f) => {
      const updated: ProductInput = {
        ...f,
        name: newName,
      };
      if (!product) {
        updated.slug = slugify(newName);
        if (!f.sku || f.sku.startsWith("SK-")) {
          updated.sku = generateAutoSku(newName);
        }
      }
      return updated;
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = (form.name ?? "").trim();
    if (!name) {
      toast.error("Name is required");
      return;
    }

    const finalSlug = (form.slug ?? "").trim() || slugify(name);
    const finalSku = (form.sku ?? "").trim() || generateAutoSku(name);

    onSave({
      ...form,
      name,
      slug: finalSlug,
      sku: finalSku,
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
      <h2 className="display-title text-2xl">{product ? `Edit ${product.name}` : "New product"}</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input
            label="Product Name"
            placeholder="e.g. English Willow Cricket Bat"
            required
            value={form.name ?? ""}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        <Input
          label="Product ID / SKU (Auto-Generated)"
          value={form.sku ?? ""}
          readOnly
          disabled
          hint="Automatically assigned unique ID · Cannot be edited manually"
          className="border-dashed"
        />

        <Input
          label="URL Slug (Auto-Generated)"
          value={form.slug ?? (form.name ? slugify(form.name) : "")}
          readOnly
          disabled
          hint="Automatically generated from name · Cannot be edited manually"
          className="border-dashed"
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

        {/* Pricing & Percentage Offer Calculator Box */}
        <div className="sm:col-span-2 rounded-xs border border-primary/40 bg-surface/60 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="rounded-2xs bg-primary/20 text-primary border border-primary/30 p-1 text-xs">
                <Percent className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                Pricing & Percentage Offer (% OFF)
              </span>
            </div>
            {hasDiscount ? (
              <span className="inline-flex items-center gap-1 rounded-2xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold animate-in fade-in duration-200">
                <Sparkles className="h-3 w-3" />
                {calculatedDiscountPercent}% OFF · Customer saves {formatPrice(savingsAmount)}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground">Standard pricing (No discount active)</span>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* 1. Original MRP / Compare-at Price */}
            <div>
              <Input
                label="Original Price / MRP (₹)"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 2999"
                value={form.compare_at_price === null ? "" : String(form.compare_at_price ?? "")}
                onChange={(e) => {
                  const mrp = e.target.value === "" ? null : Number(e.target.value);
                  setForm((prev) => {
                    const next = { ...prev, compare_at_price: mrp };
                    if (mrp && offerPercentInput > 0) {
                      next.price = Math.round(mrp * (1 - offerPercentInput / 100));
                    }
                    return next;
                  });
                }}
                hint="Original retail MRP before discount"
              />
            </div>

            {/* 2. Percentage Offer Input (% OFF) */}
            <div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Offer / Discount (% OFF)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={99}
                    step="1"
                    placeholder="e.g. 25"
                    value={offerPercentInput === 0 ? "" : String(offerPercentInput)}
                    onChange={(e) => {
                      const pct = Math.max(0, Math.min(99, Number(e.target.value) || 0));
                      setOfferPercentInput(pct);
                      if (pct > 0) {
                        const mrp = Number(form.compare_at_price) || 0;
                        if (mrp > 0) {
                          set({ price: Math.round(mrp * (1 - pct / 100)) });
                        } else if (Number(form.price) > 0) {
                          const currentPrice = Number(form.price);
                          const calculatedMrp = Math.round(currentPrice / (1 - pct / 100));
                          set({ compare_at_price: calculatedMrp });
                        }
                      }
                    }}
                    className="w-full rounded-sm border border-input bg-background px-3 py-2.5 text-sm font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none pr-8"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Sets selling price from MRP automatically</p>
              </div>
            </div>

            {/* 3. Final Selling / Offer Price */}
            <div>
              <Input
                label="Selling / Offer Price (₹)"
                type="number"
                min={0}
                step="1"
                required
                placeholder="e.g. 1999"
                value={String(form.price ?? 0)}
                onChange={(e) => {
                  const newPrice = Number(e.target.value);
                  set({ price: newPrice });
                  const mrp = Number(form.compare_at_price) || 0;
                  if (mrp > newPrice && mrp > 0) {
                    const pct = Math.round(((mrp - newPrice) / mrp) * 100);
                    setOfferPercentInput(pct);
                  } else {
                    setOfferPercentInput(0);
                  }
                }}
                hint="Final customer checkout price"
              />
            </div>
          </div>

          {/* Quick Preset Discount Chips */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
              Quick Discount Presets:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {[10, 15, 20, 25, 30, 40, 50, 60, 70].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => applyQuickPercent(pct)}
                  className={`rounded-2xs px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all ${
                    offerPercentInput === pct
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border/80 bg-surface hover:border-primary/50 text-foreground"
                  }`}
                >
                  {pct}% OFF
                </button>
              ))}
              <button
                type="button"
                onClick={clearOffer}
                className="rounded-2xs border border-border/80 bg-surface px-2.5 py-1 text-[11px] font-bold text-destructive hover:bg-destructive/10"
              >
                Clear Offer
              </button>
            </div>
          </div>
        </div>
        <div className="sm:col-span-2">
          <MultiImageUpload
            label="Product Photos"
            value={form.image_url ?? ""}
            onChange={(val) => set({ image_url: val })}
            maxPhotos={6}
          />
        </div>

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
        label="Description"
        placeholder="Enter detailed product specifications, features, materials, and benefits..."
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

      <div className="flex flex-col-reverse sm:flex-row gap-2.5 pt-2">
        <Button type="submit" disabled={saving} className="w-full sm:w-auto font-bold">
          {saving ? "Saving…" : "Save product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
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
  const [categorySearch, setCategorySearch] = useState("");

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

  const sortedCategories = useMemo(() => {
    const list = [...(categories.data ?? [])].sort(
      (a, b) =>
        (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || a.name.localeCompare(b.name),
    );
    const term = categorySearch.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term),
    );
  }, [categories.data, categorySearch]);

  if (categories.isLoading) return <LoadingState label="Loading categories…" />;
  if (categories.error)
    return <p className="text-sm text-destructive">Could not load categories.</p>;

  if (editing) {
    return (
      <CategoryForm
        category={editing === "new" ? null : editing}
        saving={save.isPending}
        onCancel={() => setEditing(null)}
        onSave={(data) => save.mutate(editing === "new" ? { data } : { id: editing.id, data })}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-foreground">
            {categories.data?.length ?? 0} total categories
          </p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Top 3 active categories with Sort Order (1, 2, 3) appear in{" "}
            <strong className="text-primary">"CHOOSE YOUR GAME"</strong>.
          </p>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="relative flex-1 sm:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter categories…"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full rounded-xs border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <Button onClick={() => setEditing("new")} className="w-full sm:w-auto font-bold text-xs h-9">
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" /> New Category
          </Button>
        </div>
      </div>

      {/* Mobile Cards View (screens < md) */}
      <div className="block md:hidden space-y-3">
        {sortedCategories.map((c, idx) => {
          const isTop3 = idx < 3 && c.is_active;
          return (
            <div key={c.id} className="surface-panel rounded-sm border border-border p-3.5 space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xs border border-border bg-surface relative">
                  {c.image_url ? (
                    <img src={c.image_url} alt={c.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                      No icon
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-foreground line-clamp-1">{c.name}</h4>
                  <p className="text-[11px] text-muted-foreground font-mono">{c.slug}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Sort Order: <span className="font-bold text-foreground">{c.sort_order}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border/60 pt-2.5">
                <div>
                  {isTop3 ? (
                    <span className="inline-flex items-center gap-1 rounded-2xs bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                      ★ #{idx + 1} Homepage
                    </span>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">All Categories page</span>
                  )}
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-2xs font-bold ${
                    c.is_active
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {c.is_active ? "Active" : "Hidden"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditing(c)}
                  className="w-full text-xs font-bold h-9"
                >
                  <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={remove.isPending}
                  onClick={() => {
                    if (confirm(`Delete "${c.name}"? Products in it will lose their category.`))
                      remove.mutate(c.id);
                  }}
                  className="w-full text-xs font-bold text-destructive hover:bg-destructive/10 h-9"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (screens >= md) */}
      <div className="hidden md:block surface-panel overflow-x-auto rounded-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wider text-muted-foreground border-b border-border bg-surface-strong/30">
            <tr>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Homepage Feature</th>
              <th className="px-4 py-3">Sort Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((c, idx) => {
              const isTop3 = idx < 3 && c.is_active;
              return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-xs border border-border bg-surface">
                        {c.image_url ? (
                          <img src={c.image_url} alt={c.name} className="h-full w-full object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{c.name}</div>
                        <div className="text-xs text-muted-foreground font-mono">{c.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {isTop3 ? (
                      <span className="inline-flex items-center gap-1 rounded-2xs bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                        ★ #{idx + 1} on Homepage
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        All Categories page only
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground font-semibold">
                    {c.sort_order}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={c.is_active ? "text-success font-medium" : "text-muted-foreground"}
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
                            confirm(`Delete "${c.name}"? Products in it will lose their category.`)
                          )
                            remove.mutate(c.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
      : { name: "", slug: "", is_active: true, sort_order: 1 },
  );

  const set = (patch: CategoryInput) => setForm((f) => ({ ...f, ...patch }));

  function handleCategoryNameChange(newName: string) {
    setForm((f) => ({
      ...f,
      name: newName,
      ...(category ? {} : { slug: slugify(newName) }),
    }));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const name = (form.name ?? "").trim();
    if (!name) {
      toast.error("Name is required");
      return;
    }

    const finalSlug = (form.slug ?? "").trim() || slugify(name);

    onSave({
      ...form,
      name,
      slug: finalSlug,
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
          label="Category Name"
          placeholder="e.g. Cricket"
          required
          value={form.name ?? ""}
          onChange={(e) => handleCategoryNameChange(e.target.value)}
        />
        <Input
          label="Category Slug / ID (Auto-Generated)"
          value={form.slug ?? (form.name ? slugify(form.name) : "")}
          readOnly
          disabled
          hint="Automatically generated from name · Cannot be edited manually"
          className="border-dashed"
        />

        <div className="sm:col-span-2">
          <ImageUpload
            label="Category Photo / Banner"
            value={form.image_url ?? ""}
            onChange={(url) => set({ image_url: url })}
            folder="categories"
            hint="Upload a sport category banner or image."
          />
        </div>

        <Input
          label="Sort order"

          type="number"
          min={1}
          value={String(form.sort_order ?? 1)}
          onChange={(e) => set({ sort_order: Number(e.target.value) })}
          hint="Priority order for category listings"
        />
      </div>

      <Textarea
        label="Description"
        placeholder="Brief description of this sport category..."
        value={form.description ?? ""}
        onChange={(e) => set({ description: e.target.value })}
      />
      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={!!form.is_active}
          onChange={(e) => set({ is_active: e.target.checked })}
        />
        Visible on the storefront (active)
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

/* ------------------------------- homepage featured -------------------------------- */

function HomepageFeaturedPanel() {
  const queryClient = useQueryClient();
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminApi.categories,
  });

  const categories = categoriesQuery.data ?? [];
  const activeCategories = useMemo(
    () =>
      [...categories]
        .filter((c) => c.is_active)
        .sort((a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0)),
    [categories],
  );

  const [slot1, setSlot1] = useState<string>("");
  const [slot2, setSlot2] = useState<string>("");
  const [slot3, setSlot3] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeCategories.length > 0) {
      setSlot1(activeCategories[0]?.id ?? "");
      setSlot2(activeCategories[1]?.id ?? "");
      setSlot3(activeCategories[2]?.id ?? "");
    }
  }, [activeCategories]);

  async function handleSave() {
    if (!slot1 || !slot2 || !slot3) {
      toast.error("Please select all 3 categories for the homepage.");
      return;
    }
    if (slot1 === slot2 || slot1 === slot3 || slot2 === slot3) {
      toast.error("Please select 3 different categories (no duplicates).");
      return;
    }

    setSaving(true);
    try {
      const updates = categories.map((c) => {
        let newSort = 10;
        if (c.id === slot1) newSort = 1;
        else if (c.id === slot2) newSort = 2;
        else if (c.id === slot3) newSort = 3;
        else newSort = Math.max(10, Number(c.sort_order) || 10);

        if (newSort !== c.sort_order) {
          return adminApi.updateCategory(c.id, {
            name: c.name,
            slug: c.slug,
            sort_order: newSort,
            is_active: c.is_active,
            image_url: c.image_url,
            description: c.description,
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updates);
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Homepage 'CHOOSE YOUR GAME' categories updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update homepage categories");
    } finally {
      setSaving(false);
    }
  }

  const cat1 = categories.find((c) => c.id === slot1);
  const cat2 = categories.find((c) => c.id === slot2);
  const cat3 = categories.find((c) => c.id === slot3);

  if (categoriesQuery.isLoading) return <LoadingState label="Loading categories…" />;

  return (
    <div className="space-y-6">
      <div className="surface-panel rounded-sm p-5 sm:p-6 border border-border">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-4">
          <div>
            <span className="eyebrow text-primary">HOMEPAGE 3 SPORTS</span>
            <h2 className="display-title mt-1 text-2xl sm:text-3xl">
              CHOOSE YOUR GAME (Featured 3 Categories)
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Select the 3 sports categories to display on the storefront homepage under{" "}
              <strong>"CHOOSE YOUR GAME"</strong>.
            </p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="font-bold w-full sm:w-auto">
            {saving ? "Saving…" : "Save & Apply to Homepage"}
          </Button>
        </div>

        {/* 3 Slots Grid */}
        <div className="mt-6 grid gap-4 md:grid-cols-3 sm:gap-6">
          {/* SLOT 1 */}
          <div className="rounded-sm border-2 border-primary/60 bg-surface/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-2xs bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                ★ Position #1
              </span>
              <span className="text-[11px] text-muted-foreground font-semibold">Left Card</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Select Category #1
              </label>
              <select
                value={slot1}
                onChange={(e) => setSlot1(e.target.value)}
                className="w-full rounded-xs border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {cat1 && (
              <div className="aspect-video w-full overflow-hidden rounded-xs border border-border bg-surface-strong relative">
                {cat1.image_url ? (
                  <img
                    src={cat1.image_url}
                    alt={cat1.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-bold">
                    No image
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded-2xs bg-background/90 px-2 py-0.5 text-xs font-bold text-foreground">
                  {cat1.name}
                </span>
              </div>
            )}
          </div>

          {/* SLOT 2 */}
          <div className="rounded-sm border-2 border-primary/60 bg-surface/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-2xs bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                ★ Position #2
              </span>
              <span className="text-[11px] text-muted-foreground font-semibold">Center Card</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Select Category #2
              </label>
              <select
                value={slot2}
                onChange={(e) => setSlot2(e.target.value)}
                className="w-full rounded-xs border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {cat2 && (
              <div className="aspect-video w-full overflow-hidden rounded-xs border border-border bg-surface-strong relative">
                {cat2.image_url ? (
                  <img
                    src={cat2.image_url}
                    alt={cat2.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-bold">
                    No image
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded-2xs bg-background/90 px-2 py-0.5 text-xs font-bold text-foreground">
                  {cat2.name}
                </span>
              </div>
            )}
          </div>

          {/* SLOT 3 */}
          <div className="rounded-sm border-2 border-primary/60 bg-surface/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="rounded-2xs bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                ★ Position #3
              </span>
              <span className="text-[11px] text-muted-foreground font-semibold">Right Card</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-foreground">
                Select Category #3
              </label>
              <select
                value={slot3}
                onChange={(e) => setSlot3(e.target.value)}
                className="w-full rounded-xs border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {cat3 && (
              <div className="aspect-video w-full overflow-hidden rounded-xs border border-border bg-surface-strong relative">
                {cat3.image_url ? (
                  <img
                    src={cat3.image_url}
                    alt={cat3.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground font-bold">
                    No image
                  </div>
                )}
                <span className="absolute bottom-2 left-2 rounded-2xs bg-background/90 px-2 py-0.5 text-xs font-bold text-foreground">
                  {cat3.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- best sellers admin panel ------------------------ */

function BestSellersAdminPanel() {
  const queryClient = useQueryClient();
  const productsQuery = useQuery({ queryKey: ["admin", "products"], queryFn: adminApi.products });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminApi.categories,
  });

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const categoryNameMap = useMemo(() => {
    return new Map(categories.map((c) => [c.id, c.name]));
  }, [categories]);

  // Section copy state
  const [eyebrow, setEyebrow] = useState<string>("POPULAR EQUIPMENT");
  const [title, setTitle] = useState<string>("BEST SELLERS");
  const [description, setDescription] = useState<string>("Popular picks from SK Sport Store.");

  // 4 Slot selection state
  const [slot1, setSlot1] = useState<string>("");
  const [slot2, setSlot2] = useState<string>("");
  const [slot3, setSlot3] = useState<string>("");
  const [slot4, setSlot4] = useState<string>("");

  const [saving, setSaving] = useState(false);
  const [catalogSearch, setCatalogSearch] = useState("");

  // Load existing config on mount / when products arrive
  useEffect(() => {
    const cfg = homepageSettingsService.getBestSellersConfig();
    if (cfg.eyebrow) setEyebrow(cfg.eyebrow);
    if (cfg.title) setTitle(cfg.title);
    if (cfg.description) setDescription(cfg.description);

    if (products.length > 0) {
      if (cfg.productIds && cfg.productIds.length > 0) {
        const p1 = products.find(
          (p) => p.id === cfg.productIds[0] || p.slug === cfg.productIds[0],
        );
        const p2 = products.find(
          (p) => p.id === cfg.productIds[1] || p.slug === cfg.productIds[1],
        );
        const p3 = products.find(
          (p) => p.id === cfg.productIds[2] || p.slug === cfg.productIds[2],
        );
        const p4 = products.find(
          (p) => p.id === cfg.productIds[3] || p.slug === cfg.productIds[3],
        );
        if (p1) setSlot1(p1.id);
        if (p2) setSlot2(p2.id);
        if (p3) setSlot3(p3.id);
        if (p4) setSlot4(p4.id);
      } else {
        // Fallback to featured products in DB
        const featured = products.filter((p) => p.is_featured);
        setSlot1(featured[0]?.id ?? products[0]?.id ?? "");
        setSlot2(featured[1]?.id ?? products[1]?.id ?? "");
        setSlot3(featured[2]?.id ?? products[2]?.id ?? "");
        setSlot4(featured[3]?.id ?? products[3]?.id ?? "");
      }
    }
  }, [products]);

  const p1 = products.find((p) => p.id === slot1);
  const p2 = products.find((p) => p.id === slot2);
  const p3 = products.find((p) => p.id === slot3);
  const p4 = products.find((p) => p.id === slot4);

  const selectedSlotIds = useMemo(
    () => [slot1, slot2, slot3, slot4].filter(Boolean),
    [slot1, slot2, slot3, slot4],
  );

  async function handleSave() {
    if (!slot1 && !slot2 && !slot3 && !slot4) {
      toast.error("Please select at least 1 product for the Best Sellers section.");
      return;
    }

    setSaving(true);
    try {
      // 1. Save copy & product slot IDs to homepageSettingsService
      homepageSettingsService.saveBestSellersConfig({
        eyebrow: eyebrow.trim() || "POPULAR EQUIPMENT",
        title: title.trim() || "BEST SELLERS",
        description: description.trim() || "Popular picks from SK Sport Store.",
        productIds: selectedSlotIds,
      });

      // 2. Also sync is_featured & sort_order to Supabase product rows for the slots
      const updates = products.map((p) => {
        const slotIdx = selectedSlotIds.indexOf(p.id);
        const shouldBeFeatured = slotIdx !== -1;
        const newSort = shouldBeFeatured ? slotIdx + 1 : Math.max(10, Number(p.sort_order) || 10);

        if (p.is_featured !== shouldBeFeatured || (shouldBeFeatured && p.sort_order !== newSort)) {
          return adminApi.updateProduct(p.id, {
            is_featured: shouldBeFeatured,
            sort_order: newSort,
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updates);
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Best Sellers ('POPULAR EQUIPMENT') section updated!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update best sellers");
    } finally {
      setSaving(false);
    }
  }

  function handleQuickToggleFeatured(p: ProductRow) {
    const isCurrentlySelected = selectedSlotIds.includes(p.id);
    if (isCurrentlySelected) {
      // Remove from slot
      if (slot1 === p.id) setSlot1("");
      else if (slot2 === p.id) setSlot2("");
      else if (slot3 === p.id) setSlot3("");
      else if (slot4 === p.id) setSlot4("");
      toast.info(`Removed "${p.name}" from best sellers slots.`);
    } else {
      // Add to first available slot
      if (!slot1) setSlot1(p.id);
      else if (!slot2) setSlot2(p.id);
      else if (!slot3) setSlot3(p.id);
      else if (!slot4) setSlot4(p.id);
      else {
        setSlot4(p.id);
        toast.info(`Replaced Slot #4 with "${p.name}".`);
        return;
      }
      toast.success(`Assigned "${p.name}" to best sellers slots.`);
    }
  }

  function handleResetDefaults() {
    if (confirm("Reset Best Sellers section copy and presets to defaults?")) {
      setEyebrow("POPULAR EQUIPMENT");
      setTitle("BEST SELLERS");
      setDescription("Popular picks from SK Sport Store.");
      homepageSettingsService.resetBestSellersConfig();
      toast.success("Reset to defaults. Click Save & Apply when ready.");
    }
  }

  const filteredProducts = useMemo(() => {
    const term = catalogSearch.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        (p.sport && p.sport.toLowerCase().includes(term)) ||
        (p.brand && p.brand.toLowerCase().includes(term)),
    );
  }, [products, catalogSearch]);

  if (productsQuery.isLoading) return <LoadingState label="Loading products…" />;

  const slots = [
    { num: 1, label: "★ Slot #1 (Primary)", val: slot1, set: setSlot1, prod: p1 },
    { num: 2, label: "★ Slot #2", val: slot2, set: setSlot2, prod: p2 },
    { num: 3, label: "★ Slot #3", val: slot3, set: setSlot3, prod: p3 },
    { num: 4, label: "★ Slot #4", val: slot4, set: setSlot4, prod: p4 },
  ];

  return (
    <div className="space-y-8">
      {/* Top Header Card */}
      <div className="surface-panel rounded-sm p-5 sm:p-6 border border-border">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span>HOMEPAGE FEATURED PRODUCTS</span>
            </div>
            <h2 className="display-title mt-1 text-2xl sm:text-3xl">
              POPULAR EQUIPMENT (BEST SELLERS)
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Select the 4 showcase products to display under <strong>"POPULAR EQUIPMENT / BEST SELLERS"</strong>{" "}
              on the homepage and customize the section text.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleResetDefaults} disabled={saving} className="text-xs">
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Reset Defaults
            </Button>
            <Button onClick={handleSave} disabled={saving} className="font-bold">
              {saving ? "Saving…" : "Save & Apply Best Sellers"}
            </Button>
          </div>
        </div>

        {/* Section Text Customizer */}
        <div className="mt-6 rounded-xs border border-border/70 bg-background/50 p-4 sm:p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Section Headers & Copy
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={fieldLabel}>Eyebrow Text</label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="POPULAR EQUIPMENT"
                className="mt-1 w-full rounded-xs border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className={fieldLabel}>Section Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="BEST SELLERS"
                className="mt-1 w-full rounded-xs border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={fieldLabel}>Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Popular picks from SK Sport Store."
                className="mt-1 w-full rounded-xs border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4 Best Seller Slots */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
              4 Best Seller Showcase Slots
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {selectedSlotIds.length} of 4 slots configured
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {slots.map(({ num, label, val, set, prod }) => (
              <div
                key={num}
                className={`rounded-sm border-2 p-4 space-y-3 transition-colors ${
                  prod ? "border-primary/60 bg-surface/70" : "border-dashed border-border bg-surface/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-2xs bg-primary text-primary-foreground px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                    {label}
                  </span>
                  {val && (
                    <button
                      type="button"
                      onClick={() => set("")}
                      className="text-[10px] text-destructive hover:underline font-semibold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <select
                    value={val}
                    onChange={(e) => set(e.target.value)}
                    className="w-full rounded-xs border border-input bg-background px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatPrice(Number(p.price))})
                      </option>
                    ))}
                  </select>
                </div>

                {prod ? (
                  <div className="space-y-2">
                    <div className="relative aspect-square w-full overflow-hidden rounded-xs border border-border bg-surface">
                      {prod.image_url ? (
                        <img
                          src={
                            prod.image_url.startsWith("[")
                              ? JSON.parse(prod.image_url)[0]
                              : prod.image_url.split(",")[0]
                          }
                          alt={prod.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          No photo
                        </div>
                      )}
                      <span className="absolute bottom-1.5 left-1.5 rounded-2xs bg-background/90 px-1.5 py-0.5 text-[10px] font-bold text-foreground">
                        {formatPrice(Number(prod.price))}
                      </span>
                    </div>
                    <div>
                      <p className="line-clamp-1 text-xs font-bold text-foreground">{prod.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {categoryNameMap.get(prod.category_id ?? "") ?? "No category"} • {prod.sku}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center aspect-square rounded-xs border border-dashed border-border/70 text-center p-3 text-muted-foreground">
                    <Package className="h-6 w-6 opacity-30 mb-1" />
                    <span className="text-[11px] font-semibold">Slot Empty</span>
                    <span className="text-[9px]">Select a product above</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Quick Feature Table */}
      <div className="surface-panel rounded-sm p-5 sm:p-6 border border-border space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
              Catalog Quick-Slot Manager
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Click the star button to quickly assign or remove products from the Best Sellers showcase slots.
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter products…"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              className="w-full rounded-xs border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile Quick Slot Cards (< md) */}
        <div className="block md:hidden space-y-2.5">
          {filteredProducts.map((p) => {
            const slotIndex = selectedSlotIds.indexOf(p.id);
            const isSelected = slotIndex !== -1;
            return (
              <div
                key={p.id}
                className="surface-panel rounded-xs border border-border/80 p-3 flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xs border border-border bg-surface">
                    {p.image_url ? (
                      <img
                        src={
                          p.image_url.startsWith("[")
                            ? JSON.parse(p.image_url)[0]
                            : p.image_url.split(",")[0]
                        }
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-foreground block truncate">{p.name}</span>
                    <span className="text-[10px] text-muted-foreground block">
                      {formatPrice(Number(p.price))} · {categoryNameMap.get(p.category_id ?? "") ?? "No category"}
                    </span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant={isSelected ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleQuickToggleFeatured(p)}
                  className="text-[11px] h-8 px-2.5 shrink-0 font-bold"
                >
                  <Star className={`mr-1 h-3 w-3 ${isSelected ? "fill-current" : ""}`} />
                  {isSelected ? `Slot #${slotIndex + 1}` : "Assign"}
                </Button>
              </div>
            );
          })}
        </div>

        {/* Desktop Quick Slot Table (>= md) */}
        <div className="hidden md:block overflow-x-auto rounded-xs border border-border">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead className="border-b border-border bg-surface-strong/40 uppercase tracking-wider text-muted-foreground font-semibold">
              <tr>
                <th className="px-3 py-2.5">Product</th>
                <th className="px-3 py-2.5">Category</th>
                <th className="px-3 py-2.5">Sport</th>
                <th className="px-3 py-2.5">Price</th>
                <th className="px-3 py-2.5">Slot Status</th>
                <th className="px-3 py-2.5 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                const slotIndex = selectedSlotIds.indexOf(p.id);
                const isSelected = slotIndex !== -1;
                return (
                  <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-surface/50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-xs border border-border bg-surface">
                          {p.image_url ? (
                            <img
                              src={
                                p.image_url.startsWith("[")
                                  ? JSON.parse(p.image_url)[0]
                                  : p.image_url.split(",")[0]
                              }
                              alt={p.name}
                              className="h-full w-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div>
                          <span className="font-bold text-foreground block line-clamp-1">{p.name}</span>
                          <span className="text-[10px] text-muted-foreground">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">
                      {categoryNameMap.get(p.category_id ?? "") ?? "—"}
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground">{p.sport || "—"}</td>
                    <td className="px-3 py-2.5 font-semibold text-foreground">
                      {formatPrice(Number(p.price))}
                    </td>
                    <td className="px-3 py-2.5">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 rounded-2xs bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 text-[10px] font-bold">
                          <Check className="h-3 w-3" /> Slot #{slotIndex + 1}
                        </span>
                      ) : p.is_featured ? (
                        <span className="text-[10px] text-muted-foreground font-medium">
                          Featured (Catalog)
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60">Standard</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <Button
                        type="button"
                        variant={isSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleQuickToggleFeatured(p)}
                        className="text-[11px] h-7 px-2.5"
                      >
                        <Star className={`mr-1 h-3 w-3 ${isSelected ? "fill-current" : ""}`} />
                        {isSelected ? `Slot #${slotIndex + 1}` : "Assign Slot"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- kit builder admin panel ------------------------- */

function KitBuilderAdminPanel() {
  const queryClient = useQueryClient();
  const productsQuery = useQuery({ queryKey: ["admin", "products"], queryFn: adminApi.products });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: adminApi.categories,
  });

  const products = productsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];

  const [presets, setPresets] = useState<KitPresetConfig[]>(() =>
    homepageSettingsService.getKitPresets(),
  );
  const [selectedKitId, setSelectedKitId] = useState<string>("cricket");
  const [productToAdd, setProductToAdd] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Active kit preset
  const activeKit = presets.find((k) => k.id === selectedKitId) ?? presets[0];

  function updateActiveKit(patch: Partial<KitPresetConfig>) {
    if (!activeKit) return;
    setPresets((prev) =>
      prev.map((k) => (k.id === activeKit.id ? { ...k, ...patch } : k)),
    );
  }

  function handleAddProductToActiveKit() {
    if (!activeKit || !productToAdd) return;
    const currentSlugs = activeKit.requiredProductSlugs || [];
    if (currentSlugs.includes(productToAdd)) {
      toast.error("This product is already in this kit.");
      return;
    }
    updateActiveKit({
      requiredProductSlugs: [...currentSlugs, productToAdd],
    });
    setProductToAdd("");
    toast.success("Product added to kit combo!");
  }

  function handleRemoveProductFromKit(slugOrId: string) {
    if (!activeKit) return;
    updateActiveKit({
      requiredProductSlugs: (activeKit.requiredProductSlugs || []).filter((s) => s !== slugOrId),
    });
    toast.info("Product removed from kit combo.");
  }

  function handleMoveProduct(index: number, direction: "up" | "down") {
    if (!activeKit) return;
    const slugs = [...(activeKit.requiredProductSlugs || [])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slugs.length) return;
    const itemA = slugs[index];
    const itemB = slugs[targetIdx];
    if (itemA !== undefined && itemB !== undefined) {
      slugs[index] = itemB;
      slugs[targetIdx] = itemA;
      updateActiveKit({ requiredProductSlugs: slugs });
    }
  }

  function handleAddNewKit() {
    const newSport = prompt(
      "Enter Sport Name for the new kit (e.g. Tennis, Basketball, Swimming):",
      "Tennis",
    );
    if (!newSport || !newSport.trim()) return;

    const cleanSport = newSport.trim();
    const newId = slugify(cleanSport);
    if (presets.some((p) => p.id === newId)) {
      toast.error(`A kit for "${cleanSport}" already exists.`);
      return;
    }

    const newPreset: KitPresetConfig = {
      id: newId,
      name: `${cleanSport} Kit`,
      sport: cleanSport,
      categorySlug: newId,
      headline: `BUILD YOUR ${cleanSport.toUpperCase()} KIT`,
      description: `Complete ${cleanSport.toLowerCase()} equipment bundle from SK Sport Store.`,
      requiredProductSlugs: [],
    };

    const next = [...presets, newPreset];
    setPresets(next);
    setSelectedKitId(newId);
    toast.success(`Created new "${cleanSport}" kit preset!`);
  }

  function handleDeleteActiveKit() {
    if (!activeKit) return;
    if (presets.length <= 1) {
      toast.error("You must keep at least one kit preset.");
      return;
    }
    if (confirm(`Delete the "${activeKit.name}" (${activeKit.sport} Kit) preset?`)) {
      const next = presets.filter((p) => p.id !== activeKit.id);
      setPresets(next);
      setSelectedKitId(next[0]?.id ?? "");
      homepageSettingsService.saveKitPresets(next);
      toast.success("Kit preset deleted.");
    }
  }

  function handleResetDefaultKits() {
    if (
      confirm(
        "Reset all sport kits to default SK Sport presets? Any custom kits will be replaced with defaults.",
      )
    ) {
      homepageSettingsService.resetKitPresets();
      setPresets(DEFAULT_KIT_PRESETS);
      setSelectedKitId("cricket");
      toast.success("Kit presets reset to defaults!");
    }
  }

  function handleSaveAll() {
    setSaving(true);
    try {
      homepageSettingsService.saveKitPresets(presets);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Kit Builder & Sport Bundles saved successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save kits");
    } finally {
      setSaving(false);
    }
  }

  // Calculate products in active kit
  const activeKitProducts = useMemo(() => {
    if (!activeKit) return [];
    return (activeKit.requiredProductSlugs || [])
      .map((slugOrId) => products.find((p) => p.slug === slugOrId || p.id === slugOrId))
      .filter((p): p is ProductRow => !!p);
  }, [activeKit, products]);

  const activeKitSubtotal = activeKitProducts.reduce((sum, p) => sum + Number(p.price || 0), 0);

  if (productsQuery.isLoading) return <LoadingState label="Loading products…" />;
  if (!activeKit) return null;

  return (
    <div className="space-y-6">
      {/* Kit Presets Tabs / Selector Card */}
      <div className="surface-panel rounded-sm p-5 sm:p-6 border border-border">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <Layers className="h-3.5 w-3.5 text-primary" />
              <span>BUILD YOUR KIT / SPORT COMBO BUNDLES</span>
            </div>
            <h2 className="display-title mt-1 text-2xl sm:text-3xl">
              Kit Builder Presets (Cricket Bundle & Sports)
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Customize the bundle headlines (e.g. <strong>"BUILD YOUR CRICKET KIT"</strong>), descriptions,
              and select products that compose each matchday sport kit.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={handleResetDefaultKits}
              disabled={saving}
              className="text-xs w-full sm:w-auto"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              Reset Default Kits
            </Button>
            <Button onClick={handleSaveAll} disabled={saving} className="font-bold w-full sm:w-auto">
              {saving ? "Saving…" : "Save All Kits & Apply"}
            </Button>
          </div>
        </div>

        {/* Sport Kit Selection Tabs */}
        <div className="mt-5 sm:mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
          {presets.map((k) => {
            const isActive = k.id === activeKit.id;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => setSelectedKitId(k.id)}
                className={`rounded-xs px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "border border-border/80 bg-surface text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <span>{k.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded-2xs ${
                    isActive ? "bg-background/20 text-white" : "bg-surface-strong text-muted-foreground"
                  }`}
                >
                  {k.requiredProductSlugs?.length || 0} items
                </span>
              </button>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddNewKit}
            className="text-xs font-bold h-9 shrink-0 whitespace-nowrap"
          >
            <Plus className="mr-1 h-3.5 w-3.5" />
            Add Sport Kit
          </Button>
        </div>
      </div>

      {/* Selected Kit Editor Card */}
      <div className="surface-panel rounded-sm p-5 sm:p-6 border border-border space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-2xs bg-primary/20 text-primary border border-primary/40 px-2 py-0.5 text-xs font-bold uppercase tracking-wider">
              {activeKit.sport} BUNDLE
            </span>
            <h3 className="text-lg font-bold text-foreground">Editing: {activeKit.name}</h3>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDeleteActiveKit}
            className="text-destructive hover:bg-destructive/10 text-xs"
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5 text-destructive" />
            Delete This Kit Preset
          </Button>
        </div>

        {/* Preset Form Fields */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={fieldLabel}>Sport Name (Badge Title)</label>
            <input
              type="text"
              value={activeKit.sport}
              onChange={(e) => updateActiveKit({ sport: e.target.value })}
              placeholder="Cricket"
              className="mt-1 w-full rounded-xs border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Renders as <strong>"{activeKit.sport || "SPORT"} BUNDLE"</strong>
            </p>
          </div>

          <div>
            <label className={fieldLabel}>Kit Tab Name</label>
            <input
              type="text"
              value={activeKit.name}
              onChange={(e) => updateActiveKit({ name: e.target.value })}
              placeholder="Cricket Match Kit"
              className="mt-1 w-full rounded-xs border border-input bg-background px-3 py-2 text-xs font-semibold text-foreground focus:border-primary focus:outline-none"
            />
            <p className="text-[10px] text-muted-foreground mt-1">Label shown on the kit selector tab</p>
          </div>

          <div>
            <label className={fieldLabel}>Linked Category Slug</label>
            <select
              value={activeKit.categorySlug}
              onChange={(e) => updateActiveKit({ categorySlug: e.target.value })}
              className="mt-1 w-full rounded-xs border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">-- Choose Category --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-muted-foreground mt-1">
              Links the "Explore Sport" button to this category
            </p>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className={fieldLabel}>Section Headline</label>
            <input
              type="text"
              value={activeKit.headline}
              onChange={(e) => updateActiveKit({ headline: e.target.value })}
              placeholder="BUILD YOUR CRICKET KIT"
              className="mt-1 w-full rounded-xs border border-input bg-background px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
            />
            <p className="text-[10px] text-muted-foreground mt-1">
              Large display headline shown inside the kit box
            </p>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className={fieldLabel}>Section Description</label>
            <textarea
              value={activeKit.description}
              onChange={(e) => updateActiveKit({ description: e.target.value })}
              rows={2}
              placeholder="Complete batting & matchday combo from willow to protective gear."
              className="mt-1 w-full rounded-xs border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Bundled Kit Products Section */}
        <div className="border-t border-border/60 pt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Kit Bundled Products ({activeKitProducts.length} Items)
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Products bundled into this kit. Customers can inquire on WhatsApp for this full package.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Est. Subtotal:
              </span>
              <span className="text-base font-bold text-foreground">
                {formatPrice(activeKitSubtotal)}
              </span>
            </div>
          </div>

          {/* Add Product to Kit Selector */}
          <div className="rounded-xs border border-border/70 bg-background/50 p-3.5 flex flex-col sm:flex-row gap-2.5 items-center">
            <select
              value={productToAdd}
              onChange={(e) => setProductToAdd(e.target.value)}
              className="w-full sm:flex-1 rounded-xs border border-input bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">-- Select Product from Inventory to Add to Bundle --</option>
              {products.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.name} ({formatPrice(Number(p.price))}) [{p.sport || "Sport"}]
                </option>
              ))}
            </select>
            <Button
              type="button"
              onClick={handleAddProductToActiveKit}
              disabled={!productToAdd}
              className="w-full sm:w-auto text-xs font-bold shrink-0"
            >
              <Plus className="mr-1 h-3.5 w-3.5" />
              Add to Kit
            </Button>
          </div>

          {/* Items Grid */}
          {activeKitProducts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {activeKitProducts.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-xs border border-border bg-surface-strong/40 p-3 flex flex-col justify-between space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-2xs bg-primary/20 text-primary border border-primary/30 px-1.5 py-0.5 text-[9px] font-bold">
                      Part {idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveProduct(idx, "up")}
                        className="p-1 rounded-2xs hover:bg-surface text-muted-foreground hover:text-foreground disabled:opacity-30"
                        title="Move left"
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === activeKitProducts.length - 1}
                        onClick={() => handleMoveProduct(idx, "down")}
                        className="p-1 rounded-2xs hover:bg-surface text-muted-foreground hover:text-foreground disabled:opacity-30"
                        title="Move right"
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveProductFromKit(item.slug || item.id)}
                        className="p-1 rounded-2xs hover:bg-destructive/20 text-destructive"
                        title="Remove from kit"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="relative aspect-video w-full overflow-hidden rounded-xs border border-border/70 bg-surface">
                    {item.image_url ? (
                      <img
                        src={
                          item.image_url.startsWith("[")
                            ? JSON.parse(item.image_url)[0]
                            : item.image_url.split(",")[0]
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>

                  <div>
                    {item.brand && (
                      <p className="text-[9px] font-bold text-muted-foreground">{item.brand}</p>
                    )}
                    <h5 className="line-clamp-2 text-xs font-bold text-foreground">{item.name}</h5>
                    <p className="mt-1 text-xs font-bold text-primary">
                      {formatPrice(Number(item.price))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 rounded-xs border border-dashed border-border bg-surface/30 text-center">
              <Package className="h-8 w-8 text-muted-foreground opacity-40 mb-2" />
              <p className="text-xs font-bold text-foreground">No Products in this Kit Yet</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Use the dropdown above to add products to the {activeKit.name} bundle.
              </p>
            </div>
          )}

          {/* WhatsApp Inquiry Message Preview */}
          <div className="mt-6 rounded-xs border border-border/70 bg-surface/50 p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-whatsapp">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp Inquiry Preview for Customers</span>
            </div>
            <div className="rounded-xs bg-background/80 p-3 font-mono text-[11px] text-muted-foreground leading-relaxed whitespace-pre-wrap border border-border/40">
              {`Hi SK Sport Store 👋\n\nI'm interested in building a ${activeKit.sport} Kit with:\n${
                activeKitProducts.length > 0
                  ? activeKitProducts
                      .map((p) => `- ${p.name} (${formatPrice(Number(p.price))})`)
                      .join("\n")
                  : "- (Select items above)"
              }\n\nCould you please share availability and bundle pricing?`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
