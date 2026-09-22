import React, { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  Tags,
  CreditCard,
  Warehouse,
  Users,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  User,
  Settings,
  ShoppingBag,
} from "lucide-react";

import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [search, setSearch] = useState("");

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  /* =====================================================
     ADMIN DATA
  ===================================================== */

  const adminName = "Administrator";
  const adminEmail = "admin@ananyatrading.com";

  /* =====================================================
     NAVIGATION
  ===================================================== */

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },

    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },

    {
      name: "Categories",
      path: "/admin/categories",
      icon: Tags,
    },

    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingBag,
    },

    {
      name: "Payments",
      path: "/admin/payments",
      icon: CreditCard,
    },

    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: Warehouse,
    },

    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
  ];

  /* =====================================================
     CLOSE DROPDOWNS OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =====================================================
     CLOSE MOBILE SIDEBAR ON ROUTE CLICK
  ===================================================== */

  const handleNavigation = () => {
    setSidebarOpen(false);
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const handleSearch = (e) => {
    e.preventDefault();

    const value = search.trim();

    if (!value) return;

    console.log("Admin search:", value);

    /*
      Yahan future me global search functionality
      add kar sakte ho.
    */
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("currentUser");

    setProfileOpen(false);

    navigate("/admin/login");
  };

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const notifications = [
    {
      id: 1,
      title: "New order received",
      text: "Order #ORD-1006 has been placed.",
      time: "2 min ago",
      type: "order",
    },

    {
      id: 2,
      title: "Payment received",
      text: "Payment received for #ORD-1005.",
      time: "18 min ago",
      type: "payment",
    },

    {
      id: 3,
      title: "New customer",
      text: "A new customer registered.",
      time: "1 hour ago",
      type: "user",
    },
  ];

  return (
    <div className="admin-layout">

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "sidebar-open"
            : ""
        }`}
      >

        {/* BRAND */}

        <div className="admin-brand">

          <div className="brand-logo">
            A
          </div>

          <div className="brand-text">

            <strong>
              ANANYA
            </strong>

            <span>
              TRADING COMPANY
            </span>

          </div>

          <button
            className="mobile-close-sidebar"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            <X size={20} />
          </button>

        </div>

        {/* SIDEBAR LABEL */}

        <div className="sidebar-label">
          MAIN MENU
        </div>

        {/* NAVIGATION */}

        <nav className="admin-nav">

          {menuItems.map(
            (item) => {

              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={
                    item.path ===
                    "/admin"
                  }
                  onClick={
                    handleNavigation
                  }
                  className={({ isActive }) =>
                    `admin-nav-link ${
                      isActive
                        ? "active"
                        : ""
                    }`
                  }
                >

                  <Icon
                    size={18}
                    strokeWidth={1.8}
                  />

                  <span>
                    {item.name}
                  </span>

                </NavLink>
              );
            }
          )}

        </nav>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="admin-mini-profile">

            <div className="admin-avatar">
              A
            </div>

            <div>

              <strong>
                Admin
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

          <button
            className="sidebar-logout"
            onClick={
              handleLogout
            }
          >
            <LogOut size={17} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div className="admin-main">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="admin-topbar">

          {/* MOBILE MENU */}

          <button
            className="mobile-menu-btn"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={21} />
          </button>

          {/* SEARCH */}

          <form
            className={`admin-search ${
              searchOpen
                ? "search-mobile-open"
                : ""
            }`}
            onSubmit={handleSearch}
          >

            <Search
              size={18}
              className="search-icon"
            />

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search products, orders, users..."
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() =>
                  setSearch("")
                }
              >
                <X size={15} />
              </button>
            )}

          </form>

          {/* MOBILE SEARCH */}

          <button
            className="mobile-search-btn"
            onClick={() =>
              setSearchOpen(
                !searchOpen
              )
            }
          >
            <Search size={20} />
          </button>

          {/* RIGHT SIDE */}

          <div className="topbar-right">

            {/* NOTIFICATION */}

            <div
              className="topbar-dropdown"
              ref={
                notificationRef
              }
            >

              <button
                className={`topbar-icon-btn ${
                  notificationOpen
                    ? "opened"
                    : ""
                }`}
                onClick={() => {
                  setNotificationOpen(
                    !notificationOpen
                  );

                  setProfileOpen(
                    false
                  );
                }}
                aria-label="Notifications"
              >

                <Bell size={19} />

                <span className="notification-dot">
                  3
                </span>

              </button>

              {notificationOpen && (

                <div className="notification-dropdown">

                  <div className="dropdown-header">

                    <div>
                      <h3>
                        Notifications
                      </h3>

                      <span>
                        You have 3 new notifications
                      </span>
                    </div>

                    <button>
                      Mark all read
                    </button>

                  </div>

                  <div className="notification-list">

                    {notifications.map(
                      (notification) => (

                        <div
                          className="notification-item"
                          key={
                            notification.id
                          }
                        >

                          <div className="notification-icon">
                            {notification.type ===
                              "order" && (
                              <ShoppingBag
                                size={16}
                              />
                            )}

                            {notification.type ===
                              "payment" && (
                              <CreditCard
                                size={16}
                              />
                            )}

                            {notification.type ===
                              "user" && (
                              <User
                                size={16}
                              />
                            )}
                          </div>

                          <div className="notification-content">

                            <strong>
                              {
                                notification.title
                              }
                            </strong>

                            <p>
                              {
                                notification.text
                              }
                            </p>

                            <small>
                              {
                                notification.time
                              }
                            </small>

                          </div>

                          <span className="notification-unread" />

                        </div>
                      )
                    )}

                  </div>

                  <button
                    className="view-notifications"
                    onClick={() => {
                      setNotificationOpen(
                        false
                      );

                      navigate(
                        "/admin/orders"
                      );
                    }}
                  >
                    View all notifications
                  </button>

                </div>

              )}

            </div>

            {/* DIVIDER */}

            <div className="topbar-divider" />

            {/* PROFILE */}

            <div
              className="topbar-dropdown"
              ref={profileRef}
            >

              <button
                className={`admin-profile-btn ${
                  profileOpen
                    ? "opened"
                    : ""
                }`}
                onClick={() => {
                  setProfileOpen(
                    !profileOpen
                  );

                  setNotificationOpen(
                    false
                  );
                }}
              >

                <div className="topbar-avatar">
                  A
                </div>

                <div className="topbar-user">

                  <strong>
                    {adminName}
                  </strong>

                  <span>
                    Administrator
                  </span>

                </div>

                <ChevronDown
                  size={16}
                  className={
                    profileOpen
                      ? "rotate"
                      : ""
                  }
                />

              </button>

              {profileOpen && (

                <div className="profile-dropdown">

                  <div className="profile-dropdown-head">

                    <div className="profile-large-avatar">
                      A
                    </div>

                    <div>

                      <strong>
                        {adminName}
                      </strong>

                      <span>
                        {adminEmail}
                      </span>

                    </div>

                  </div>

                  <div className="profile-menu">

                    <button
                      onClick={() => {
                        setProfileOpen(
                          false
                        );

                        navigate(
                          "/admin"
                        );
                      }}
                    >
                      <User size={17} />

                      My Dashboard
                    </button>

                    <button>
                      <Settings
                        size={17}
                      />

                      Settings
                    </button>

                    <div className="profile-menu-divider" />

                    <button
                      className="logout-menu"
                      onClick={
                        handleLogout
                      }
                    >
                      <LogOut size={17} />

                      Logout
                    </button>

                  </div>

                </div>

              )}

            </div>

          </div>

        </header>

        {/* =================================================
            PAGE CONTENT
        ================================================= */}

        <main className="admin-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AdminLayout;