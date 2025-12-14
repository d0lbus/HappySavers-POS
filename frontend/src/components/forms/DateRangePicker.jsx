import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DateRangePicker({
  label,
  startLabel = "Start",
  endLabel = "End",
  startName = "start_date",
  endName = "end_date",
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  disabled = false,
  required = false,
  helperText,
  error,
  className,
}) {
  const hasError = Boolean(error);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <div className="text-sm font-medium text-slate-800">
          {label} {required ? <span className="text-rose-600">*</span> : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-slate-600">{startLabel}</label>
          <div
            className={cn(
              "rounded-xl border bg-white px-3 py-2 shadow-sm",
              hasError ? "border-rose-400" : "border-slate-200",
              disabled ? "bg-slate-50 opacity-80" : ""
            )}
          >
            <input
              type="date"
              name={startName}
              value={startValue || ""}
              onChange={onStartChange}
              disabled={disabled}
              required={required}
              className="w-full bg-transparent text-sm text-slate-900 outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-slate-600">{endLabel}</label>
          <div
            className={cn(
              "rounded-xl border bg-white px-3 py-2 shadow-sm",
              hasError ? "border-rose-400" : "border-slate-200",
              disabled ? "bg-slate-50 opacity-80" : ""
            )}
          >
            <input
              type="date"
              name={endName}
              value={endValue || ""}
              onChange={onEndChange}
              disabled={disabled}
              required={required}
              className="w-full bg-transparent text-sm text-slate-900 outline-none"
            />
          </div>
        </div>
      </div>

      {hasError ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
