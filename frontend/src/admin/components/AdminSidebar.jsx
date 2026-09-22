import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/admin/login");
  };

  return (
    <aside className="admin-sidebar">

      {/* LOGO */}

      <div className="admin-logo">

        <div className="admin-logo-icon">
          A
        </div>

        <div>
          <h2>Ananya</h2>
          <span>Admin Panel</span>
        </div>

      </div>


      {/* MENU */}

      <nav className="admin-menu">

        <NavLink
          to="/admin"
          end
          className="admin-menu-item"
        >
          📊 Dashboard
        </NavLink>


        <NavLink
          to="/admin/products"
          className="admin-menu-item"
        >
          📦 Products
        </NavLink>


        <NavLink
          to="/admin/categories"
          className="admin-menu-item"
        >
          🗂️ Categories
        </NavLink>


        <NavLink
          to="/admin/orders"
          className="admin-menu-item"
        >
          🛒 Orders
        </NavLink>


        <NavLink
          to="/admin/users"
          className="admin-menu-item"
        >
          👥 Users
        </NavLink>


        <NavLink
          to="/admin/payments"
          className="admin-menu-item"
        >
          💳 Payments
        </NavLink>


        <NavLink
          to="/admin/inventory"
          className="admin-menu-item"
        >
          🏭 Inventory
        </NavLink>


        <NavLink
          to="/admin/coupons"
          className="admin-menu-item"
        >
          🎟️ Coupons
        </NavLink>


        <NavLink
          to="/admin/reviews"
          className="admin-menu-item"
        >
          ⭐ Reviews
        </NavLink>


        <NavLink
          to="/admin/settings"
          className="admin-menu-item"
        >
          ⚙️ Settings
        </NavLink>

      </nav>


      {/* LOGOUT */}

      <button
        className="logout-btn"
        onClick={handleLogout}
      >
        🚪 Logout
      </button>

    </aside>
  );
}