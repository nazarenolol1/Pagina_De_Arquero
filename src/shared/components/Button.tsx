import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "px-6 py-3 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-foreground text-background hover:bg-accent-secondary",
    secondary:
      "bg-transparent border border-foreground text-foreground hover:bg-foreground hover:text-background",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
}
