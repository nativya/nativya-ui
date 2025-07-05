import * as React from "react";
import { cn } from "@/app/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost" | "danger";
}

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const variantClasses = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100",
  ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, size = "md", variant = "default", disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        disabled={disabled}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
