import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Toggle({
  label,
  checked,
  defaultChecked,
  onChange,
  name,
  id,
  disabled = false,
  helperText,
  error,
  className,
}) {
  const toggleId = id || name || React.useId();
  const hasError = Boolean(error);

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        {label ? (
          <label htmlFor={toggleId} className="text-sm font-medium text-slate-800">
            {label}
          </label>
        ) : (
          <span />
        )}

        <label
          className={cn(
            "relative inline-flex items-center",
            disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          )}
        >
          <input
            id={toggleId}
            name={name}
            type="checkbox"
            className="sr-only"
            checked={checked}
            defaultChecked={defaultChecked}
            onChange={(e) => onChange?.(e)}
            disabled={disabled}
          />
          <span
            className={cn(
              "h-6 w-11 rounded-full border transition",
              hasError ? "border-rose-400" : "border-slate-200",
              "bg-slate-200",
              // visual state when controlled/uncontrolled
              (checked ?? defaultChecked) ? "data-[on=true]:bg-emerald-500" : ""
            )}
            data-on={Boolean(checked)}
          />
          <span
            className={cn(
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition",
              Boolean(checked) ? "translate-x-5" : "translate-x-0"
            )}
          />
        </label>
      </div>

      {hasError ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
