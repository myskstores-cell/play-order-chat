/**
 * Central application configuration.
 * Nothing store-specific should be hardcoded inside components.
 */

const env = import.meta.env as Record<string, string | undefined>;

export const config = {
  store: {
    name: "SK Sport Store",
    shortName: "SK SPORT",
    tagline: "Equip your game.",
    description:
      "Sports equipment, footwear, apparel and accessories. Browse online and place your order directly on WhatsApp.",
    email: env["VITE_STORE_EMAIL"] ?? "hello@sksportstore.com",
    phone: env["VITE_STORE_PHONE"] ?? "+91 90000 00000",
    address: env["VITE_STORE_ADDRESS"] ?? "SK Sport Store, Main Market Road",
    hours: env["VITE_STORE_HOURS"] ?? "Monday to Saturday, 10:00 AM – 9:00 PM",
    mapQuery: env["VITE_STORE_MAP_QUERY"] ?? "SK Sport Store",
  },
  whatsapp: {
    /** Digits only, including country code. Configure with VITE_WHATSAPP_NUMBER. */
    number: env["VITE_WHATSAPP_NUMBER"] ?? "919000000000",
    baseUrl: "https://wa.me",
  },
  currency: {
    code: "INR",
    symbol: "₹",
    locale: "en-IN",
  },
  announcements: [
    "Order directly on WhatsApp — no online payment needed",
    "New arrivals in stock every week",
    "Local delivery available — ask us on WhatsApp",
  ],
  cart: {
    storageKey: "cart",
  },
} as const;

export type AppConfig = typeof config;
