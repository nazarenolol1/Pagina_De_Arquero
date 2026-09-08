import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm text-foreground/70">
        {label}
      </label>
      <input
        id={id}
        className={`bg-surface border border-border px-4 py-2.5 outline-none focus:border-accent-secondary ${className}`}
        {...props}
      />
    </div>
  );
}
