import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { API_URL } from "../../services/apiConfig";

import {
  LayoutDashboard,
  LayoutTemplate,
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
  MessageSquare,
  Star,
  MailQuestion,
  TicketPercent,
} from "lucide-react";

import "./AdminLayout.css";

function AdminLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] =
    useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  const [search, setSearch] = useState("");
  const [inquiryCount, setInquiryCount] =
    useState(0);
  const [notifications, setNotifications] =
    useState([]);

  /* read-state is device-local (no notifications table) —
     badge/dot counts only unread items */
  const [readIds, setReadIds] = useState(() => {
    try {
      return new Set(
        JSON.parse(
          localStorage.getItem("adminReadNotifications") ||
            "[]"
        )
      );
    } catch {
      return new Set();
    }
  });

  const markRead = (ids) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      localStorage.setItem(
        "adminReadNotifications",
        JSON.stringify([...next].slice(-500))
      );
      return next;
    });
  };

  const openNotification = (n) => {
    markRead([n.id]);
    setNotificationOpen(false);
    navigate(
      n.type === "inquiry"
        ? "/admin/inquiries"
        : "/admin/orders"
    );
  };

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
      name: "Templates",
      path: "/admin/templates",
      icon: LayoutTemplate,
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
      name: "Coupons",
      path: "/admin/coupons",
      icon: TicketPercent,
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

    {
      name: "Customer Reviews",
      path: "/admin/reviews",
      icon: Star,
    },

    {
      name: "Inquiries",
      path: "/admin/inquiries",
      icon: MailQuestion,
      badge: "inquiries",
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

  useEffect(() => {
    const controller = new AbortController();

    const clearAdminSession = () => {
      localStorage.removeItem("adminLoggedIn");
      localStorage.removeItem("authToken");
      localStorage.removeItem("currentUser");
      localStorage.removeItem("ananyaUser");
      localStorage.removeItem("rememberMe");
    };

    const verifyAdmin = async () => {
      const token = localStorage.getItem("authToken");
      const savedUser = localStorage.getItem("currentUser");
      const currentUser = (() => {
        try {
          return savedUser ? JSON.parse(savedUser) : null;
        } catch {
          return null;
        }
      })();

      if (!token || currentUser?.role !== "admin") {
        clearAdminSession();
        navigate("/admin/login", { replace: true });
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok || data.user?.role !== "admin") {
          clearAdminSession();
          navigate("/admin/login", { replace: true });
          return;
        }

        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(data.user));
        localStorage.setItem("ananyaUser", JSON.stringify(data.user));
        setAuthChecking(false);
      } catch (error) {
        if (error.name !== "AbortError") {
          clearAdminSession();
          navigate("/admin/login", { replace: true });
        }
      }
    };

    verifyAdmin();

    return () => controller.abort();
  }, [navigate]);

  /* =====================================================
     NEW INQUIRY COUNT (sidebar badge)
  ===================================================== */

  useEffect(() => {
    if (authChecking) return;

    const loadCount = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const items = [];

      try {
        const [ordersRes, inquiriesRes] =
          await Promise.all([
            fetch(`${API_URL}/admin/orders`, {
              headers,
            }),
            fetch(
              `${API_URL}/contact-inquiries?status=new`,
              { headers }
            ),
          ]);

        const ordersData = await ordersRes
          .json()
          .catch(() => ({}));
        const inquiriesData = await inquiriesRes
          .json()
          .catch(() => ({}));

        if (
          ordersRes.ok &&
          Array.isArray(ordersData.orders)
        ) {
          ordersData.orders
            .slice(0, 5)
            .forEach((order) => {
              items.push({
                id: `order-${
                  order.orderNumber ||
                  order.orderId ||
                  order.id
                }`,
                title: "New order received",
                text: `${
                  order.customerName ||
                  order.name ||
                  "Customer"
                } placed order ${
                  order.orderNumber ||
                  order.orderId ||
                  order.id
                }.`,
                time: order.createdAt,
                type: "order",
              });
            });
        }

        if (
          inquiriesRes.ok &&
          Array.isArray(inquiriesData.inquiries)
        ) {
          setInquiryCount(
            inquiriesData.inquiries.length
          );

          inquiriesData.inquiries
            .slice(0, 5)
            .forEach((inquiry) => {
              items.push({
                id: `inquiry-${inquiry.id}`,
                title: "New inquiry",
                text: `${
                  inquiry.name || "Customer"
                }: ${String(
                  inquiry.subject ||
                    inquiry.message ||
                    ""
                ).slice(0, 60)}`,
                time:
                  inquiry.created_at ||
                  inquiry.createdAt,
                type: "inquiry",
              });
            });
        }

        items.sort(
          (a, b) =>
            new Date(b.time) - new Date(a.time)
        );

        /* saare new/unread — sirf 6 tak limited nahi */
        setNotifications(items.slice(0, 30));
      } catch {
        /* badge optional — ignore */
      }
    };

    loadCount();

    const interval = setInterval(loadCount, 60000);
    return () => clearInterval(interval);
  }, [authChecking]);

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
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("ananyaUser");
    localStorage.removeItem("rememberMe");

    setProfileOpen(false);

    navigate("/admin/login", { replace: true });
  };

  /* =====================================================
     NOTIFICATIONS — DB se real orders + inquiries
  ===================================================== */

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();

    if (Number.isNaN(diff) || diff < 0) {
      return "";
    }

    const mins = Math.floor(diff / 60000);

    if (mins < 1) {
      return "Just now";
    }

    if (mins < 60) {
      return `${mins} min ago`;
    }

    const hrs = Math.floor(mins / 60);

    if (hrs < 24) {
      return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const unreadCount = notifications.filter(
    (n) => !readIds.has(n.id)
  ).length;

  if (authChecking) {
    return (
      <div className="admin-layout" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        Verifying admin access...
      </div>
    );
  }

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

              if (item.children) {
                return (
                  <div key={item.name}>
                    <NavLink
                      to={item.path}
                      end
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

                    <div style={{ paddingLeft: "18px" }}>
                      {item.children.map(
                        (child) => {
                          const ChildIcon = child.icon;
                          return (
                            <NavLink
                              key={child.name}
                              to={child.path}
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
                              style={{
                                fontSize: "13px",
                                padding: "8px 12px",
                              }}
                            >
                              <ChildIcon
                                size={15}
                                strokeWidth={1.8}
                              />
                              <span>
                                {child.name}
                              </span>
                            </NavLink>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              }

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

                  {item.badge === "inquiries" &&
                    inquiryCount > 0 && (
                      <span className="nav-inquiry-badge">
                        {inquiryCount}
                      </span>
                    )}

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

                {unreadCount > 0 && (
                  <span className="notification-dot">
                    {unreadCount}
                  </span>
                )}

              </button>

              {notificationOpen && (

                <div className="notification-dropdown">

                  <div className="dropdown-header">

                    <div>
                      <h3>
                        Notifications
                      </h3>

                      <span>
                        You have {unreadCount} unread
                        notification
                        {unreadCount === 1 ? "" : "s"}
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        markRead(
                          notifications.map((n) => n.id)
                        )
                      }
                    >
                      Mark all read
                    </button>

                  </div>

                  <div className="notification-list">

                    {notifications.length === 0 && (
                      <p
                        style={{
                          padding: "18px",
                          fontSize: "12px",
                          color: "#6b7280",
                          textAlign: "center",
                          margin: 0,
                        }}
                      >
                        No new notifications
                      </p>
                    )}

                    {notifications.map(
                      (notification) => (

                        <div
                          className={`notification-item ${
                            readIds.has(notification.id)
                              ? "read"
                              : ""
                          }`}
                          key={
                            notification.id
                          }
                          onClick={() =>
                            openNotification(notification)
                          }
                          role="button"
                          style={{ cursor: "pointer" }}
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

                            {notification.type ===
                              "inquiry" && (
                              <MailQuestion
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
                              {timeAgo(
                                notification.time
                              )}
                            </small>

                          </div>

                          {!readIds.has(
                            notification.id
                          ) && (
                            <span className="notification-unread" />
                          )}

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