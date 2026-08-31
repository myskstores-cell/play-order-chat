import { useState, useEffect } from "react";

export interface BrandConfig {
  id: string;
  name: string;
  sport?: string | undefined;
  logoUrl?: string | undefined;
  description?: string | undefined;
  isFeatured?: boolean | undefined;
}

const STORAGE_KEY = "sk_store_brands_config";
const BRANDS_UPDATE_EVENT = "sk_store_brands_updated";

export const DEFAULT_BRANDS: BrandConfig[] = [
  { id: "sk-pro", name: "SK Pro", sport: "Cricket & Multi-Sport", isFeatured: true },
  { id: "ss", name: "SS (Sunridges)", sport: "Cricket", isFeatured: true },
  { id: "sg", name: "SG (Sanspareils Greenlands)", sport: "Cricket", isFeatured: true },
  { id: "kookaburra", name: "Kookaburra", sport: "Cricket", isFeatured: true },
  { id: "mrf", name: "MRF", sport: "Cricket", isFeatured: true },
  { id: "yonex", name: "Yonex", sport: "Badminton & Tennis", isFeatured: true },
  { id: "cosco", name: "Cosco", sport: "Football & Basketball", isFeatured: true },
  { id: "nivia", name: "Nivia", sport: "Football & Running", isFeatured: true },
  { id: "nike", name: "Nike", sport: "Footwear & Apparel", isFeatured: true },
  { id: "adidas", name: "Adidas", sport: "Footwear & Football", isFeatured: true },
  { id: "puma", name: "Puma", sport: "Footwear & Running", isFeatured: true },
  { id: "featherline", name: "Featherline", sport: "Badminton", isFeatured: false },
  { id: "strikeline", name: "Strikeline", sport: "Football", isFeatured: false },
  { id: "baseline", name: "Baseline", sport: "Tennis", isFeatured: false },
  { id: "rimline", name: "Rimline", sport: "Basketball", isFeatured: false },
  { id: "pacer", name: "Pacer", sport: "Running", isFeatured: false },
  { id: "ironcore", name: "IronCore", sport: "Fitness & Gym", isFeatured: false },
];

function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(BRANDS_UPDATE_EVENT));
  }
}

export const brandService = {
  getBrands(): BrandConfig[] {
    if (typeof window === "undefined") return DEFAULT_BRANDS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_BRANDS;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // ignore JSON parse errors
    }
    return DEFAULT_BRANDS;
  },

  saveBrands(brands: BrandConfig[]): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(brands));
      notifyUpdate();
    } catch (e) {
      console.error("Failed to save brands in localStorage", e);
    }
  },

  addBrand(newBrand: Omit<BrandConfig, "id"> & { id?: string | undefined }): BrandConfig {
    const brands = this.getBrands();
    const cleanId =
      newBrand.id ||
      newBrand.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const created: BrandConfig = {
      id: cleanId,
      name: newBrand.name.trim(),
      sport: newBrand.sport?.trim() || undefined,
      logoUrl: newBrand.logoUrl?.trim() || undefined,
      description: newBrand.description?.trim() || undefined,
      isFeatured: newBrand.isFeatured ?? true,
    };

    const existingIndex = brands.findIndex((b) => b.id === created.id || b.name.toLowerCase() === created.name.toLowerCase());
    let next: BrandConfig[];
    if (existingIndex >= 0) {
      next = [...brands];
      next[existingIndex] = created;
    } else {
      next = [created, ...brands];
    }

    this.saveBrands(next);
    return created;
  },

  deleteBrand(idOrName: string): void {
    const brands = this.getBrands();
    const next = brands.filter(
      (b) => b.id !== idOrName && b.name.toLowerCase() !== idOrName.toLowerCase(),
    );
    this.saveBrands(next);
  },

  resetDefaultBrands(): void {
    this.saveBrands(DEFAULT_BRANDS);
  },
};

export function useBrands(): BrandConfig[] {
  const [brands, setBrands] = useState<BrandConfig[]>(() => brandService.getBrands());

  useEffect(() => {
    function handleUpdate() {
      setBrands(brandService.getBrands());
    }

    window.addEventListener(BRANDS_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(BRANDS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return brands;
}
