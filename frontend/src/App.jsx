// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthLayout from "./components/layout/AuthLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ManagerLayout from "./components/layout/ManagerLayout";
import CashierLayout from "./components/layout/CashierLayout";

// Auth logic
import ProtectedRoute from "./components/ProtectedRoute";

// Auth Pages
import LoginPage from "./pages/Auth/LoginPage";

// Dashboard (Role-Based Wrapper)
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import ManagerDashboard from "./pages/Dashboard/ManagerDashboard";
import CashierDashboard from "./pages/Dashboard/CashierDashboard";

// Shared Pages
import NotFoundPage from "./pages/Shared/NotFoundPage";
import NotAuthorizedPage from "./pages/Shared/NotAuthorizedPage";
import ProfilePage from "./pages/Shared/ProfilePage";
import POSPage from "./pages/Shared/POSPage";

/* -----------------------------
   ADMIN ROUTES
------------------------------ */

// Admin – Users
import UsersPage from "./pages/Admin/Users/UsersPage";

// Admin – Audit
import AuditLogPage from "./pages/Admin/Audit/AuditLogPage";

// Admin – Products
import ProductsPage from "./pages/Admin/Products/ProductsPage";
import ProductCreatePage from "./pages/Admin/Products/ProductCreatePage";
import ProductEditPage from "./pages/Admin/Products/ProductEditPage";
import PromotionsPage from "./pages/Admin/Products/PromotionsPage";

// Admin – Inventory
import InventoryPage from "./pages/Admin/Inventory/InventoryPage";
import InventoryAdjustPage from "./pages/Admin/Inventory/InventoryAdjustPage";
import InventoryMovementPage from "./pages/Admin/Inventory/InventoryMovementPage";
import LowStockPage from "./pages/Admin/Inventory/LowStockPage";

// Admin – Transactions
import TransactionListPage from "./pages/Admin/Transactions/TransactionListPage";
import TransactionDetailsPage from "./pages/Admin/Transactions/TransactionDetailsPage";

// Admin – Reports
import AdminSalesReportPage from "./pages/Admin/Reports/SalesReportPage";
import AdminProductReportPage from "./pages/Admin/Reports/ProductReportPage";
import AdminCategoryReportPage from "./pages/Admin/Reports/CategoryReportPage";
import AdminCashierReportPage from "./pages/Admin/Reports/CashierReportPage";
import AdminShiftPerformanceReportPage from "./pages/Admin/Reports/ShiftPerformanceReportPage";
import AdminPromotionPerformancePage from "./pages/Admin/Reports/PromotionPerformancePage";

// Admin – Refunds
import RefundsPage from "./pages/Admin/Refunds/RefundsPage";
import VoidHistoryPage from "./pages/Admin/Refunds/VoidHistoryPage";

// Admin – Shifts
import ShiftListPage from "./pages/Admin/Shifts/ShiftListPage";
import ShiftDetailsPage from "./pages/Admin/Shifts/ShiftDetailsPage";

// Admin – ROI
import ROIMainPage from "./pages/Admin/ROI/ROIMainPage";
import ProductROIPage from "./pages/Admin/ROI/ProductROIPage";
import CategoryROIPage from "./pages/Admin/ROI/CategoryROIPage";
import PromotionROIPage from "./pages/Admin/ROI/PromotionROIPage";

// Admin – Settings
import SettingsPage from "./pages/Admin/Settings/SettingsPage";
import TaxSettingsPage from "./pages/Admin/Settings/TaxSettingsPage";
import ReceiptSettingsPage from "./pages/Admin/Settings/ReceiptSettingsPage";
import PaymentSettingsPage from "./pages/Admin/Settings/PaymentSettingsPage";

/* -----------------------------
   MANAGER ROUTES
------------------------------ */

// Manager – Reports
import ManagerSalesReportPage from "./pages/Manager/Reports/SalesReportPage";
import ManagerProductReportPage from "./pages/Manager/Reports/ProductReportPage";
import ManagerCashierReportPage from "./pages/Manager/Reports/CashierReportPage";
import ManagerCategoryReportPage from "./pages/Manager/Reports/CategoryReportPage";
import ManagerShiftPerformanceReportPage from "./pages/Manager/Reports/ShiftPerformanceReportPage";

// Manager – Inventory
import ManagerLowStockPage from "./pages/Manager/Inventory/ManagerLowStockPage";
import ManagerInventoryMovementPage from "./pages/Manager/Inventory/ManagerInventoryMovementPage";

// Manager – Transactions
import ManagerTransactionListPage from "./pages/Manager/Transactions/ManagerTransactionListPage";
import ManagerTransactionDetailsPage from "./pages/Manager/Transactions/ManagerTransactionDetailsPage";

// Manager – Shifts
import ManagerShiftListPage from "./pages/Manager/Shifts/ManagerShiftListPage";

/* -----------------------------
   CASHIER ROUTES
------------------------------ */

import ShiftOpenPage from "./pages/Cashier/ShiftOpenPage";
import ShiftClosePage from "./pages/Cashier/ShiftClosePage";
import ShiftSummaryPage from "./pages/Cashier/ShiftSummaryPage";
import ReceiptReprintPage from "./pages/Cashier/ReceiptReprintPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* -------------------------
           AUTH ROUTES
        -------------------------- */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />


        {/* -------------------------
           ADMIN ROUTES
        -------------------------- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />

          {/* Users */}
          <Route path="users" element={<UsersPage />} />

          {/* Audit */}
          <Route path="audit" element={<AuditLogPage />} />

          {/* Products */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/create" element={<ProductCreatePage />} />
          <Route path="products/:id/edit" element={<ProductEditPage />} />
          <Route path="products/promotions" element={<PromotionsPage />} />

          {/* Inventory */}
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="inventory/adjust" element={<InventoryAdjustPage />} />
          <Route path="inventory/movement" element={<InventoryMovementPage />} />
          <Route path="inventory/low-stock" element={<LowStockPage />} />

          {/* Transactions */}
          <Route path="transactions" element={<TransactionListPage />} />
          <Route path="transactions/:id" element={<TransactionDetailsPage />} />

          {/* Reports */}
          <Route path="reports/sales" element={<AdminSalesReportPage />} />
          <Route path="reports/products" element={<AdminProductReportPage />} />
          <Route path="reports/categories" element={<AdminCategoryReportPage />} />
          <Route path="reports/cashiers" element={<AdminCashierReportPage />} />
          <Route path="reports/shifts" element={<AdminShiftPerformanceReportPage />} />
          <Route path="reports/promotions" element={<AdminPromotionPerformancePage />} />

          {/* Refunds */}
          <Route path="refunds" element={<RefundsPage />} />
          <Route path="refunds/void-history" element={<VoidHistoryPage />} />

          {/* Shifts */}
          <Route path="shifts" element={<ShiftListPage />} />
          <Route path="shifts/:id" element={<ShiftDetailsPage />} />

          {/* ROI */}
          <Route path="roi" element={<ROIMainPage />} />
          <Route path="roi/products" element={<ProductROIPage />} />
          <Route path="roi/categories" element={<CategoryROIPage />} />
          <Route path="roi/promotions" element={<PromotionROIPage />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="settings/tax" element={<TaxSettingsPage />} />
          <Route path="settings/receipt" element={<ReceiptSettingsPage />} />
          <Route path="settings/payment" element={<PaymentSettingsPage />} />
        </Route>

        {/* -------------------------
           MANAGER ROUTES
        -------------------------- */}
        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["Manager"]}>
              <ManagerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ManagerDashboard />} />

          {/* Reports */}
          <Route path="reports/sales" element={<ManagerSalesReportPage />} />
          <Route path="reports/products" element={<ManagerProductReportPage />} />
          <Route path="reports/cashiers" element={<ManagerCashierReportPage />} />
          <Route path="reports/categories" element={<ManagerCategoryReportPage />} />
          <Route path="reports/shifts" element={<ManagerShiftPerformanceReportPage />} />

          {/* Inventory */}
          <Route path="inventory/low-stock" element={<ManagerLowStockPage />} />
          <Route path="inventory/movement" element={<ManagerInventoryMovementPage />} />

          {/* Transactions */}
          <Route path="transactions" element={<ManagerTransactionListPage />} />
          <Route path="transactions/:id" element={<ManagerTransactionDetailsPage />} />

          {/* Shifts */}
          <Route path="shifts" element={<ManagerShiftListPage />} />
        </Route>

        {/* -------------------------
           CASHIER ROUTES
        -------------------------- */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute roles={["Cashier"]}>
              <CashierLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CashierDashboard />} />
          <Route path="shift-open" element={<ShiftOpenPage />} />
          <Route path="shift-close" element={<ShiftClosePage />} />
          <Route path="shift-summary" element={<ShiftSummaryPage />} />
          <Route path="receipt-reprint" element={<ReceiptReprintPage />} />
          <Route path="pos" element={<POSPage />} />
        </Route>

        {/* -------------------------
           SHARED FALLBACK
        -------------------------- */}
        <Route path="/not-authorized" element={<NotAuthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
