import React from "react";
import {
  Routes,
  Route,
} from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./components/AdminLayout";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminCategories from "./pages/AdminCategories";
import AdminPayments from "./pages/AdminPayments";
import AdminInventory from "./pages/AdminInventory";
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";

import AddProduct from "./pages/AddProduct";


export default function AdminApp() {

  return (

    <Routes>

      {/* =========================================
          ADMIN LOGIN
      ========================================= */}

      <Route
        path="login"
        element={
          <AdminLogin />
        }
      />


      {/* =========================================
          ADMIN PANEL
      ========================================= */}

      <Route
        element={
          <AdminLayout />
        }
      >

        {/* ================= DASHBOARD ================= */}

        <Route
          index
          element={
            <AdminDashboard />
          }
        />


        {/* ================= PRODUCTS ================= */}

        <Route
          path="products"
          element={
            <AdminProducts />
          }
        />


        <Route
          path="products/add"
          element={
            <AddProduct />
          }
        />


        {/* ================= CATEGORIES ================= */}

        <Route
          path="categories"
          element={
            <AdminCategories />
          }
        />


        {/* ================= ORDERS ================= */}

        <Route
          path="orders"
          element={
            <AdminOrders />
          }
        />


        {/* ================= PAYMENTS ================= */}

        <Route
          path="payments"
          element={
            <AdminPayments />
          }
        />


        {/* ================= INVENTORY ================= */}

        <Route
          path="inventory"
          element={
            <AdminInventory />
          }
        />


        {/* ================= USERS ================= */}

        <Route
          path="users"
          element={
            <AdminUsers />
          }
        />

      </Route>

    </Routes>

  );
}