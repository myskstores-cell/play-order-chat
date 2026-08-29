import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 active:brightness-95",
  secondary: "bg-surface-strong text-foreground hover:bg-surface",
  outline: "border border-border text-foreground hover:bg-surface",
  ghost: "text-foreground hover:bg-surface",
  whatsapp:
    "bg-whatsapp text-whatsapp-foreground hover:brightness-110 active:brightness-95",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-semibold uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  );
}
