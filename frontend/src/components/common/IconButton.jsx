import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VARIANTS = {
  default:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
  danger: "bg-red-50 text-red-700 border border-red-200 hover:bg-red-100",
  emerald:
    "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100",
};

const SIZES = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-9 w-9 rounded-lg",
  lg: "h-10 w-10 rounded-xl",
};

export default React.forwardRef(function IconButton(
  { variant = "default", size = "md", className, children, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center transition focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed",
        VARIANTS[variant] || VARIANTS.default,
        SIZES[size] || SIZES.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
