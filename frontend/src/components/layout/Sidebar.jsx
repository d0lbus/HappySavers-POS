// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

// React Icons
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiSettings,
  FiArchive,
  FiBox,
  FiLayers,
  FiTrendingUp,
  FiActivity,
  FiFileText,
  FiLogOut,
  FiShoppingCart,
  FiList,
  FiRefreshCw,
  FiTag,
  FiBarChart2,
  FiAlertTriangle,
  FiRepeat,
  FiDollarSign,
  FiClipboard,
  FiFolder,
  FiPieChart,
  FiClock,
  FiTrash,
} from "react-icons/fi";
import { HiOutlineReceiptRefund } from "react-icons/hi2";
import { MdOutlinePointOfSale } from "react-icons/md";

// ----------------------------------------------------
// ICON MAP — store COMPONENTS, not JSX elements
// ----------------------------------------------------
const ICONS = {
  dashboard: FiHome,
  users: FiUsers,
  add: FiUserPlus,
  audit: FiActivity,

  products: FiBox,
  promo: FiTag,

  inventory: FiArchive,
  adjust: FiRepeat,
  movement: FiRefreshCw,
  lowstock: FiAlertTriangle,

  transactions: FiList,

  report: FiBarChart2,

  refund: HiOutlineReceiptRefund,
  void: FiTrash,

  shift: FiClock,

  roi: FiPieChart,

  settings: FiSettings,
  tax: FiDollarSign,
  receipt: FiFileText,
  payment: FiDollarSign,

  pos: MdOutlinePointOfSale,
  summary: FiClipboard,

  default: FiFolder,
};

function getIconComponent(name) {
  return ICONS[name] || ICONS.default;
}

export default function Sidebar({ role, user, navItems, isOpen, onClose }) {
  const location = useLocation();

  const initials = user?.username
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("")
    ?.toUpperCase()
    ?.slice(0, 2);

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-black/30 transition-opacity sm:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 shadow-xl
          transform transition-transform duration-200
          sm:static sm:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}
        `}
      >
        {/* User Header */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
            {initials || "U"}
          </div>

          <div className="leading-tight">
            <p className="font-semibold text-sm text-slate-800">
              {user?.username}
            </p>
            <p className="text-[11px] uppercase text-emerald-600 tracking-wide">
              {role}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {navItems.map((section) => (
            <div key={section.section} className="mb-6">
              <p className="text-[11px] uppercase font-semibold text-slate-400 px-2 mb-2 tracking-wide">
                {section.section}
              </p>

              <div className="flex flex-col gap-1">
                {section.items.map((item) => {
                  const Icon = getIconComponent(item.icon);

                  // exact match so /admin/users does NOT also light up /admin/users/create
                  const isActive = location.pathname === item.to;

                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                        ${
                          isActive
                            ? "bg-emerald-100 text-emerald-700 font-medium border border-emerald-200"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }
                      `}
                    >
                      <Icon
                        className={`
                          w-5 h-5
                          ${isActive ? "text-emerald-700" : "text-slate-500"}
                        `}
                      />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
