// src/config/navConfig.js

export const navConfig = {
  /* ===============================
     ADMIN NAVIGATION
  =============================== */
  Admin: [
    {
      section: "Dashboard",
      items: [
        {
          label: "Dashboard",
          to: "/admin",
          icon: "dashboard",
        },
      ],
    },

    {
      section: "Users",
      items: [
        { label: "All Users", to: "/admin/users", icon: "users" },
        { label: "Audit Logs", to: "/admin/audit", icon: "audit" },
      ],
    },

    {
      section: "Products",
      items: [
        { label: "Products", to: "/admin/products", icon: "products" },
        { label: "Add Product", to: "/admin/products/create", icon: "add" },
        { label: "Promotions", to: "/admin/products/promotions", icon: "promo" },
      ],
    },

    {
      section: "Inventory",
      items: [
        { label: "Inventory", to: "/admin/inventory", icon: "inventory" },
        { label: "Adjust Stock", to: "/admin/inventory/adjust", icon: "adjust" },
        { label: "Movement Log", to: "/admin/inventory/movement", icon: "movement" },
        { label: "Low Stock", to: "/admin/inventory/low-stock", icon: "lowstock" },
      ],
    },

    {
      section: "Transactions",
      items: [
        { label: "All Transactions", to: "/admin/transactions", icon: "transactions" },
      ],
    },

    {
      section: "Reports",
      items: [
        { label: "Sales Report", to: "/admin/reports/sales", icon: "report" },
        { label: "Product Report", to: "/admin/reports/products", icon: "report" },
        { label: "Category Report", to: "/admin/reports/categories", icon: "report" },
        { label: "Cashier Report", to: "/admin/reports/cashiers", icon: "report" },
        { label: "Shift Performance", to: "/admin/reports/shifts", icon: "shift" },
        { label: "Promotion Performance", to: "/admin/reports/promotions", icon: "promo" },
      ],
    },

    {
      section: "Refunds",
      items: [
        { label: "Refunds", to: "/admin/refunds", icon: "refund" },
        { label: "Void History", to: "/admin/refunds/void-history", icon: "void" },
      ],
    },

    {
      section: "Shifts",
      items: [
        { label: "Shifts", to: "/admin/shifts", icon: "shift" },
      ],
    },

    {
      section: "ROI",
      items: [
        { label: "ROI Dashboard", to: "/admin/roi", icon: "roi" },
        { label: "Product ROI", to: "/admin/roi/products", icon: "roi" },
        { label: "Category ROI", to: "/admin/roi/categories", icon: "roi" },
        { label: "Promotion ROI", to: "/admin/roi/promotions", icon: "roi" },
      ],
    },

    {
      section: "Settings",
      items: [
        { label: "General Settings", to: "/admin/settings", icon: "settings" },
        { label: "Tax Settings", to: "/admin/settings/tax", icon: "tax" },
        { label: "Receipt Settings", to: "/admin/settings/receipt", icon: "receipt" },
        { label: "Payment Settings", to: "/admin/settings/payment", icon: "payment" },
      ],
    },
  ],

  /* ===============================
     MANAGER NAVIGATION
  =============================== */
  Manager: [
    {
      section: "Dashboard",
      items: [
        { label: "Dashboard", to: "/manager", icon: "dashboard" },
      ],
    },

    {
      section: "Reports",
      items: [
        { label: "Sales Report", to: "/manager/reports/sales", icon: "report" },
        { label: "Product Report", to: "/manager/reports/products", icon: "report" },
        { label: "Cashier Report", to: "/manager/reports/cashiers", icon: "report" },
        { label: "Category Report", to: "/manager/reports/categories", icon: "report" },
        { label: "Shift Performance", to: "/manager/reports/shifts", icon: "shift" },
      ],
    },

    {
      section: "Inventory",
      items: [
        { label: "Low Stock", to: "/manager/inventory/low-stock", icon: "lowstock" },
        { label: "Inventory Movement", to: "/manager/inventory/movement", icon: "movement" },
      ],
    },

    {
      section: "Transactions",
      items: [
        { label: "Transactions", to: "/manager/transactions", icon: "transactions" },
      ],
    },

    {
      section: "Shifts",
      items: [
        { label: "Shifts", to: "/manager/shifts", icon: "shift" },
      ],
    },
  ],

  /* ===============================
     CASHIER NAVIGATION
  =============================== */
  Cashier: [
    {
      section: "POS",
      items: [
        { label: "Open Shift", to: "/cashier/shift-open", icon: "shift" },
        { label: "POS Terminal", to: "/cashier/pos", icon: "pos" },
        { label: "Reprint Receipt", to: "/cashier/receipt-reprint", icon: "receipt" },
      ],
    },

    {
      section: "Shift",
      items: [
        { label: "Shift Summary", to: "/cashier/shift-summary", icon: "summary" },
        { label: "Close Shift", to: "/cashier/shift-close", icon: "shift" },
      ],
    },
  ],
};
