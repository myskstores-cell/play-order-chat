import type { Customer } from "./Customer";

export interface OrderLine {
  productId: string;
  name: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderDraft {
  customer: Customer;
  lines: OrderLine[];
  subtotal: number;
  createdAt: string;
}
