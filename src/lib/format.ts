import { config } from "@/config/config";

export function formatPrice(value: number): string {
  return `${config.currency.symbol}${new Intl.NumberFormat(config.currency.locale, {
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)}`;
}

export function stockLabel(status: string): string {
  switch (status) {
    case "in_stock":
      return "In stock";
    case "low_stock":
      return "Low stock";
    case "out_of_stock":
      return "Out of stock";
    default:
      return status;
  }
}
