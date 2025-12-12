import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const VARIANTS = {
  primary:
    "bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-600/60",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-900/60",
  outline:
    "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 disabled:opacity-60",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 disabled:opacity-60",
  danger:
    "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-600/60",
};

const SIZES = {
  sm: "h-8 px-3 text-sm rounded-lg",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-11 px-5 text-base rounded-xl",
};

export default React.forwardRef(function Button(
  {
    variant = "primary",
    size = "md",
    className,
    leftIcon,
    rightIcon,
    children,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-200",
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        "disabled:cursor-not-allowed",
        className
      )}
      {...props}
    >
      {leftIcon ? <span className="inline-flex">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="inline-flex">{rightIcon}</span> : null}
    </button>
  );
});
