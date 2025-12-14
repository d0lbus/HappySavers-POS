import React from "react";
import Button from "../common/Button";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function ConfirmDialog({
  open,
  title = "Confirm",
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary", // Button variant for confirm
  disabled = false,
  loading = false,
  onConfirm,
  onCancel,
  children,
  className,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !disabled && !loading && onCancel?.()}
      />

      <div
        className={cn(
          "relative w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>

          {description ? (
            <p className="text-sm text-slate-600">{description}</p>
          ) : null}

          {children ? <div className="pt-2">{children}</div> : null}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={disabled || loading}
          >
            {cancelText}
          </Button>

          <Button
            variant={variant}
            onClick={onConfirm}
            disabled={disabled || loading}
          >
            {loading ? "Working…" : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
