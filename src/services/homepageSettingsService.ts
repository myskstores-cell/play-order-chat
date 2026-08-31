import { useState, useEffect } from "react";

export interface BestSellersConfig {
  eyebrow: string;
  title: string;
  description: string;
  productIds: string[]; // up to 4 primary product IDs or slugs
}

export interface KitPresetConfig {
  id: string;
  name: string;
  sport: string;
  categorySlug: string;
  headline: string;
  description: string;
  requiredProductSlugs: string[]; // product slugs or IDs included in this kit
}

export const DEFAULT_BEST_SELLERS_CONFIG: BestSellersConfig = {
  eyebrow: "POPULAR EQUIPMENT",
  title: "BEST SELLERS",
  description: "Popular picks from SK Sport Store.",
  productIds: [],
};

export const DEFAULT_KIT_PRESETS: KitPresetConfig[] = [
  {
    id: "cricket",
    name: "Cricket Match Kit",
    sport: "Cricket",
    categorySlug: "cricket",
    headline: "BUILD YOUR CRICKET KIT",
    description: "Complete batting & matchday combo from willow to protective gear.",
    requiredProductSlugs: [
      "professional-english-willow-cricket-bat",
      "cricket-batting-gloves-pro",
      "cricket-batting-pads-lightweight",
      "cricket-helmet-with-grille",
    ],
  },
  {
    id: "badminton",
    name: "Badminton Kit",
    sport: "Badminton",
    categorySlug: "badminton",
    headline: "BUILD YOUR BADMINTON KIT",
    description: "High-speed court combo: full-carbon racket, shuttles and grip setup.",
    requiredProductSlugs: [
      "carbon-badminton-racket",
      "nylon-shuttlecocks-pack-of-6",
      "all-court-sports-shoes",
    ],
  },
  {
    id: "football",
    name: "Football Training Kit",
    sport: "Football",
    categorySlug: "football",
    headline: "BUILD YOUR FOOTBALL KIT",
    description: "Matchball, firm-ground boots, shin guards and performance training gear.",
    requiredProductSlugs: [
      "match-football-size-5",
      "firm-ground-football-boots",
      "shin-guards-with-ankle-sleeve",
      "dry-fit-training-t-shirt",
    ],
  },
  {
    id: "fitness",
    name: "Home Fitness Kit",
    sport: "Fitness",
    categorySlug: "fitness-gym",
    headline: "BUILD YOUR FITNESS KIT",
    description: "Essential home strength and conditioning setup with mats, bands & dumbbells.",
    requiredProductSlugs: [
      "pvc-dumbbell-set-pair",
      "anti-slip-yoga-mat-6mm",
      "resistance-band-set-5-levels",
      "adjustable-skipping-rope",
    ],
  },
  {
    id: "running",
    name: "Running Kit",
    sport: "Running",
    categorySlug: "running",
    headline: "BUILD YOUR RUNNING KIT",
    description: "Daily road running combo with cushioned shoes, hydration & stretch belt.",
    requiredProductSlugs: [
      "lightweight-running-shoes",
      "running-waist-belt",
      "stainless-steel-sports-bottle-750ml",
      "cotton-sports-socks-pack-of-3",
    ],
  },
];

const BEST_SELLERS_STORAGE_KEY = "skstore_best_sellers_config";
const KIT_PRESETS_STORAGE_KEY = "skstore_kit_presets_config";
const SETTINGS_EVENT = "skstore_homepage_settings_updated";

function isBrowser(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export const homepageSettingsService = {
  getBestSellersConfig(): BestSellersConfig {
    if (!isBrowser()) return DEFAULT_BEST_SELLERS_CONFIG;
    try {
      const raw = window.localStorage.getItem(BEST_SELLERS_STORAGE_KEY);
      if (!raw) return DEFAULT_BEST_SELLERS_CONFIG;
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_BEST_SELLERS_CONFIG,
        ...parsed,
      };
    } catch {
      return DEFAULT_BEST_SELLERS_CONFIG;
    }
  },

  saveBestSellersConfig(config: BestSellersConfig): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(BEST_SELLERS_STORAGE_KEY, JSON.stringify(config));
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { type: "best_sellers" } }));
    } catch (e) {
      console.error("Failed to save best sellers config:", e);
    }
  },

  resetBestSellersConfig(): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(BEST_SELLERS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { type: "best_sellers" } }));
    } catch (e) {
      console.error("Failed to reset best sellers config:", e);
    }
  },

  getKitPresets(): KitPresetConfig[] {
    if (!isBrowser()) return DEFAULT_KIT_PRESETS;
    try {
      const raw = window.localStorage.getItem(KIT_PRESETS_STORAGE_KEY);
      if (!raw) return DEFAULT_KIT_PRESETS;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return DEFAULT_KIT_PRESETS;
    } catch {
      return DEFAULT_KIT_PRESETS;
    }
  },

  saveKitPresets(presets: KitPresetConfig[]): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.setItem(KIT_PRESETS_STORAGE_KEY, JSON.stringify(presets));
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { type: "kit_presets" } }));
    } catch (e) {
      console.error("Failed to save kit presets:", e);
    }
  },

  resetKitPresets(): void {
    if (!isBrowser()) return;
    try {
      window.localStorage.removeItem(KIT_PRESETS_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT, { detail: { type: "kit_presets" } }));
    } catch (e) {
      console.error("Failed to reset kit presets:", e);
    }
  },
};

export function useBestSellersConfig(): BestSellersConfig {
  const [config, setConfig] = useState<BestSellersConfig>(() =>
    homepageSettingsService.getBestSellersConfig(),
  );

  useEffect(() => {
    function handleChange() {
      setConfig(homepageSettingsService.getBestSellersConfig());
    }

    window.addEventListener(SETTINGS_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  return config;
}

export function useKitPresets(): KitPresetConfig[] {
  const [presets, setPresets] = useState<KitPresetConfig[]>(() =>
    homepageSettingsService.getKitPresets(),
  );

  useEffect(() => {
    function handleChange() {
      setPresets(homepageSettingsService.getKitPresets());
    }

    window.addEventListener(SETTINGS_EVENT, handleChange);
    window.addEventListener("storage", handleChange);

    return () => {
      window.removeEventListener(SETTINGS_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  return presets;
}
