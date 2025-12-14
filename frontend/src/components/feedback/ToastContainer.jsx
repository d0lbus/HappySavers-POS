import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Lightweight local toasts (no external libs).
 * Usage:
 * const { toasts, pushToast, removeToast } = useToasts();
 * <ToastContainer toasts={toasts} onDismiss={removeToast} />
 */
export function useToasts() {
  const [toasts, setToasts] = React.useState([]);

  const pushToast = React.useCallback((toast) => {
    const id = toast.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const t = {
      id,
      type: toast.type || "info", // success | error | info | warning
      title: toast.title || "",
      message: toast.message || "",
      duration: toast.duration ?? 3500,
    };

    setToasts((prev) => [t, ...prev]);

    if (t.duration && t.duration > 0) {
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== id));
      }, t.duration);
    }

    return id;
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  return { toasts, pushToast, removeToast };
}

function typeStyles(type) {
  if (type === "success") return "border-emerald-200 bg-emerald-50 text-emerald-900";
  if (type === "error") return "border-rose-200 bg-rose-50 text-rose-900";
  if (type === "warning") return "border-amber-200 bg-amber-50 text-amber-900";
  return "border-slate-200 bg-white text-slate-900";
}

export default function ToastContainer({ toasts = [], onDismiss }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed right-4 top-4 z-[9999] flex w-full max-w-sm flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "rounded-xl border px-4 py-3 shadow-lg",
            typeStyles(t.type)
          )}
          role="status"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {t.title ? (
                <div className="text-sm font-semibold truncate">{t.title}</div>
              ) : null}
              {t.message ? (
                <div className="text-sm opacity-90 break-words">{t.message}</div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => onDismiss?.(t.id)}
              className="text-xs px-2 py-1 rounded-lg border border-black/10 hover:bg-black/5"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
