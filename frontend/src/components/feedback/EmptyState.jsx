import React from "react";
import Button from "../common/Button";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function EmptyState({
  title = "Nothing here yet",
  description = "No data found.",
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center",
        className
      )}
    >
      <div className="mx-auto max-w-md space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>

        {actionLabel ? (
          <div className="pt-3">
            <Button variant="primary" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
