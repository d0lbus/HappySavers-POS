import React from "react";
import { Link } from "react-router-dom";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * items: [{ label: "Users", to: "/admin/users" }, { label: "Edit", to: null }]
 */
export default function Breadcrumbs({ items = [], className }) {
  if (!items.length) return null;

  return (
    <nav className={cn("flex items-center gap-2 text-xs text-slate-500", className)}>
      {items.map((item, idx) => {
        const last = idx === items.length - 1;

        return (
          <React.Fragment key={`${item.label}-${idx}`}>
            {item.to && !last ? (
              <Link to={item.to} className="hover:text-slate-700">
                {item.label}
              </Link>
            ) : (
              <span className={cn(last ? "text-slate-700 font-medium" : "")}>
                {item.label}
              </span>
            )}

            {!last ? <span className="opacity-60">/</span> : null}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
