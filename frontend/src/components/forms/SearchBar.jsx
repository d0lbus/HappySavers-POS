import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function SearchIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={cn("h-4 w-4 text-slate-500", props.className)}
      aria-hidden="true"
    >
      <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export default function SearchBar({
  value,
  defaultValue,
  onChange,
  onClear,
  placeholder = "Search…",
  disabled = false,
  className,
  inputClassName,
  ...props
}) {
  const showClear = Boolean(value) && typeof onClear === "function";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm",
        disabled ? "bg-slate-50 opacity-80" : "",
        className
      )}
    >
      <SearchIcon />

      <input
        type="text"
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none",
          inputClassName
        )}
        {...props}
      />

      {showClear ? (
        <button
          type="button"
          onClick={onClear}
          className="text-xs px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50"
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
