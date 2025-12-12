import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "bg-white border border-slate-200 rounded-xl shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("px-5 py-4 border-b border-slate-200", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={cn("text-sm font-semibold text-slate-900", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardSubtitle({ className, children, ...props }) {
  return (
    <p className={cn("text-xs text-slate-500 mt-0.5", className)} {...props}>
      {children}
    </p>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("px-5 py-4 border-t border-slate-200", className)} {...props}>
      {children}
    </div>
  );
}
