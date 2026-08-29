export interface Customer {
  name: string;
  phone: string;
  address: string;
  notes?: string;
}

export type CustomerErrors = Partial<Record<keyof Customer, string>>;

export function validateCustomer(customer: Customer): CustomerErrors {
  const errors: CustomerErrors = {};
  if (!customer.name.trim()) errors.name = "Please enter your name.";
  const digits = customer.phone.replace(/\D/g, "");
  if (!customer.phone.trim()) errors.phone = "Please enter your phone number.";
  else if (digits.length < 10) errors.phone = "Enter a valid phone number (10+ digits).";
  if (!customer.address.trim()) errors.address = "Please enter your delivery address.";
  else if (customer.address.trim().length < 10)
    errors.address = "Please enter a complete delivery address.";
  return errors;
}
