import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NumberInput({
  label,
  value,
  defaultValue,
  onChange,
  name,
  id,
  placeholder,
  disabled = false,
  required = false,
  readOnly = false,
  helperText,
  error,
  min,
  max,
  step = "any",
  inputMode = "decimal",
  className,
  inputClassName,
  ...props
}) {
  const inputId = id || name || React.useId();
  const hasError = Boolean(error);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? (
        <label
          htmlFor={inputId}
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
        <input
          id={inputId}
          name={name}
          type="number"
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          min={min}
          max={max}
          step={step}
          inputMode={inputMode}
          className={cn(
            "w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none",
            inputClassName
          )}
          {...props}
        />
      </div>

      {hasError ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
