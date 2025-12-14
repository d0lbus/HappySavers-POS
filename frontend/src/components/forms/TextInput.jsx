import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function TextInput({
  label,
  value,
  defaultValue,
  onChange,
  name,
  id,
  placeholder,
  type = "text",
  autoComplete,
  disabled = false,
  required = false,
  readOnly = false,
  helperText,
  error,
  leftSlot,
  rightSlot,
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
          "flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm",
          hasError ? "border-rose-400" : "border-slate-200",
          disabled ? "bg-slate-50 opacity-80" : ""
        )}
      >
        {leftSlot ? <div className="shrink-0">{leftSlot}</div> : null}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          className={cn(
            "w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none",
            inputClassName
          )}
          {...props}
        />

        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>

      {hasError ? (
        <p className="text-xs text-rose-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
}
