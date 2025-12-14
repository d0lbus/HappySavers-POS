import React from "react";
import Button from "../common/Button";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SlideOverPanel({
  open,
  title,
  subtitle,
  children,
  onClose,
  footer,
  widthClass = "max-w-lg",
  className,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999]">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={cn(
          "absolute right-0 top-0 h-full w-full bg-white shadow-xl border-l border-slate-200 flex flex-col",
          widthClass,
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="px-5 py-4 border-b border-slate-200 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? (
              <h2 className="text-base font-semibold text-slate-900 truncate">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
            ) : null}
          </div>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>

        <div className="flex-1 overflow-auto px-5 py-4">{children}</div>

        {footer ? (
          <div className="px-5 py-4 border-t border-slate-200">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}
