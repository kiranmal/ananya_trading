import React from "react";
import { Routes, Route } from "react-router-dom";

// Admin Layout & Login
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";

// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminPayments from "./pages/AdminPayments";
import AdminInventory from "./pages/AdminInventory";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminDelivery from "./pages/AdminDelivery";

// Product Pages
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

export default function AdminApp() {
  return (
    <Routes>

      {/* =====================================================
          ADMIN LOGIN
      ===================================================== */}

      <Route
        path="login"
        element={<AdminLogin />}
      />


      {/* =====================================================
          ADMIN PANEL
          All pages below use AdminLayout
      ===================================================== */}

      <Route
        element={<AdminLayout />}
      >

        {/* =================================================
            DASHBOARD
            URL: /admin
        ================================================= */}

        <Route
          index
          element={<AdminDashboard />}
        />


        {/* =================================================
            PRODUCTS
            URL: /admin/products
        ================================================= */}

        <Route
          path="products"
          element={<AdminProducts />}
        />


        {/* =================================================
            ADD PRODUCT
            URL: /admin/products/add
        ================================================= */}

        <Route
          path="products/add"
          element={<AddProduct />}
        />


        {/* =================================================
            EDIT PRODUCT
            URL: /admin/products/edit/:id
        ================================================= */}

        <Route
          path="products/edit/:id"
          element={<EditProduct />}
        />


        {/* =================================================
            CATEGORIES
            URL: /admin/categories
        ================================================= */}

        <Route
          path="categories"
          element={<AdminCategories />}
        />


        {/* =================================================
            ORDERS
            URL: /admin/orders
        ================================================= */}

        <Route
          path="orders"
          element={<AdminOrders />}
        />


        {/* =================================================
            PAYMENTS
            URL: /admin/payments
        ================================================= */}

        <Route
          path="payments"
          element={<AdminPayments />}
        />


        {/* =================================================
            INVENTORY
            URL: /admin/inventory
        ================================================= */}

        <Route
          path="inventory"
          element={<AdminInventory />}
        />


        {/* =================================================
            USERS
            URL: /admin/users
        ================================================= */}

        <Route
          path="users"
          element={<AdminUsers />}
        />


        {/* =================================================
            DELIVERY MANAGEMENT
            URL: /admin/delivery
        ================================================= */}

        <Route
          path="delivery"
          element={<AdminDelivery />}
        />

      </Route>

    </Routes>
  );
}