import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function SelectInput({
  label,
  value,
  defaultValue,
  onChange,
  name,
  id,
  disabled = false,
  required = false,
  helperText,
  error,
  placeholder = "Select…",
  options = [],
  className,
  selectClassName,
  ...props
}) {
  const selectId = id || name || React.useId();
  const hasError = Boolean(error);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-slate-800"
        >
          {label} {required ? <span className="text-rose-600">*</span> : null}
        </label>
      ) : null}

      <div
        className={cn(
          "rounded-xl border bg-white px-3 py-2 shadow-sm",
          hasError ? "border-rose-400" : "border-slate-200",
          disabled ? "bg-slate-50 opacity-80" : ""
        )}
      >
        <select
          id={selectId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={cn(
            "w-full bg-transparent text-sm text-slate-900 outline-none",
            selectClassName
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const lab = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={String(val)} value={val}>
                {lab}
              </option>
            );
          })}
        </select>
      </div>

      {hasError ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
