import { useEffect, useState } from "react";
import { Eye, X, Palette } from "lucide-react";
import {
  fetchAllOrders,
  updateOrderStatusRemote,
} from "../../services/orderApi";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] =
    useState(null);

  useEffect(() => {
    loadOrders();

    const handleOrdersUpdate = () => {
      loadOrders();
    };

    window.addEventListener(
      "ananyaOrdersUpdated",
      handleOrdersUpdate
    );

    window.addEventListener(
      "storage",
      handleOrdersUpdate
    );

    return () => {
      window.removeEventListener(
        "ananyaOrdersUpdated",
        handleOrdersUpdate
      );

      window.removeEventListener(
        "storage",
        handleOrdersUpdate
      );
    };
  }, []);

  async function loadOrders() {
    let localOrders = [];

    try {
      const savedOrders =
        localStorage.getItem("ananyaOrders");

      const parsedOrders = savedOrders
        ? JSON.parse(savedOrders)
        : [];

      localOrders = Array.isArray(parsedOrders)
        ? parsedOrders
        : [];
    } catch (error) {
      console.error(
        "Orders loading error:",
        error
      );
    }

    /* Server = source of truth.
       localStorage sirf tab jab API unreachable ho */
    const remoteOrders = await fetchAllOrders();

    setOrders(remoteOrders || localOrders);
  }

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const isPendingOrder = (order) => {
    const status = String(order?.status || "").toLowerCase();
    return ["new", "pending", "payment pending"].includes(status);
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
  };

  const updateOrderStatus = async (order, status) => {
    const orderId = order.orderId || order.id || order.orderNumber;

    /* DB update pehle — fail ho toh bhi local update */
    updateOrderStatusRemote(
      order.orderNumber || orderId,
      status
    );

    const updatedOrders = orders.map((item) => {
      const itemId = item.orderId || item.id || item.orderNumber;

      return String(itemId) === String(orderId)
        ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          }
        : item;
    });

    setOrders(updatedOrders);

    /* Sirf local-originated orders update karo —
       remote (sabhi customers ke) orders ko ananyaOrders
       cache mein mat likho */
    try {
      const savedLocal = JSON.parse(
        localStorage.getItem("ananyaOrders") || "[]"
      );

      if (Array.isArray(savedLocal)) {
        const updatedLocal = savedLocal.map((item) => {
          const itemId =
            item.orderId || item.id || item.orderNumber;

          return String(itemId) === String(orderId)
            ? {
                ...item,
                status,
                updatedAt: new Date().toISOString(),
              }
            : item;
        });

        localStorage.setItem(
          "ananyaOrders",
          JSON.stringify(updatedLocal)
        );
      }
    } catch {
      /* local cache optional */
    }

    window.dispatchEvent(new Event("ananyaOrdersUpdated"));
    window.dispatchEvent(new Event("ordersUpdated"));
  };

  return (
    <div className="admin-orders-page">

      {/* ================= HEADER ================= */}

      <div className="page-heading orders-heading">

        <div>
          <span className="orders-label">
            ORDER MANAGEMENT
          </span>

          <h2>
            Orders
          </h2>

          <p>
            Manage and track all customer orders
          </p>
        </div>

        <div className="orders-count-card">
          <span>
            Total Orders
          </span>

          <strong>
            {orders.length}
          </strong>
        </div>

      </div>


      {/* ================= STATS ================= */}

      <div className="order-stats">

        <div className="order-stat">
          <span className="stat-icon">
            📦
          </span>

          <div>
            <small>
              Total Orders
            </small>

            <strong>
              {orders.length}
            </strong>
          </div>
        </div>


        <div className="order-stat">
          <span className="stat-icon">
            ⏳
          </span>

          <div>
            <small>
              Pending
            </small>

            <strong>
              {
                orders.filter(
                  isPendingOrder
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="order-stat">
          <span className="stat-icon">
            🚚
          </span>

          <div>
            <small>
              Shipped
            </small>

            <strong>
              {
                orders.filter(
                  (order) =>
                    String(
                      order.status
                    ).toLowerCase() ===
                    "shipped"
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="order-stat">
          <span className="stat-icon">
            ✓
          </span>

          <div>
            <small>
              Delivered
            </small>

            <strong>
              {
                orders.filter(
                  (order) =>
                    String(
                      order.status
                    ).toLowerCase() ===
                    "delivered"
                ).length
              }
            </strong>
          </div>
        </div>

      </div>


      {/* ================= ORDERS TABLE ================= */}

      <section className="panel orders-panel">

        <div className="panel-head">

          <div>
            <h3>
              All Orders
            </h3>

            <p>
              Customer order history
            </p>
          </div>

          <button
            className="refresh-orders"
            onClick={loadOrders}
          >
            ↻ Refresh
          </button>

        </div>


        {orders.length === 0 ? (

          <div className="empty-orders">

            <div className="empty-orders-icon">
              📦
            </div>

            <h3>
              No Orders Yet
            </h3>

            <p>
              Customer orders will appear
              here after checkout.
            </p>

          </div>

        ) : (

          <div className="table-wrap">

            <table className="admin-table orders-table">

              <thead>
                <tr>

                  <th>
                    Order ID
                  </th>

                  <th>
                    Customer
                  </th>

                  <th>
                    Products
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Payment
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Manage Status
                  </th>

                  <th>
                    View
                  </th>

                </tr>
              </thead>


              <tbody>

                {orders.map(
                  (order, index) => {

                    const orderItems =
                      Array.isArray(
                        order.cart
                      )
                        ? order.cart
                        : Array.isArray(
                            order.items
                          )
                        ? order.items
                        : [];

                    return (

                      <tr
                        key={
                          order.id ||
                          order.orderId ||
                          index
                        }
                      >

                        {/* ORDER ID */}

                        <td>

                          <strong className="order-id">
                            {order.orderId ||
                              order.id ||
                              `#ORD-${1000 + index}`}
                          </strong>

                        </td>


                        {/* CUSTOMER */}

                        <td>

                          <div className="customer-cell">

                            <div className="customer-avatar">
                              {(
                                order.name ||
                                order.customerName ||
                                order.userName ||
                                "C"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <strong>
                                {order.name ||
                                  order.customerName ||
                                  order.userName ||
                                  "Customer"}
                              </strong>

                              <small>
                                {order.email ||
                                  order.customerEmail ||
                                  "No email"}
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* PRODUCTS */}

                        <td>

                          <span className="products-count">

                            {orderItems.length ||
                              order.totalProducts ||
                              0}

                            {" "}
                            product
                            {
                              (
                                orderItems.length ||
                                order.totalProducts ||
                                0
                              ) !== 1
                                ? "s"
                                : ""
                            }

                          </span>

                        </td>


                        {/* AMOUNT */}

                        <td>

                          <strong className="order-amount">

                            ₹
                            {formatPrice(
                              order.totalPrice ||
                                order.amount
                            )}

                          </strong>

                        </td>


                        {/* PAYMENT */}

                        <td>

                          <span
                            className={`payment-status ${
                              String(
                                order.paymentStatus ||
                                  "Pending"
                              ).toLowerCase()
                            }`}
                          >
                            {order.paymentStatus ||
                              "Pending"}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <span
                            className={`status ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status ||
                              "Pending"}
                          </span>

                        </td>


                        {/* DATE */}

                        <td>

                          <span className="order-date">

                            {order.createdAt
                              ? new Date(
                                  order.createdAt
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "—"}

                          </span>

                        </td>

                        <td>
                          <select
                            className="order-status-select"
                            value={order.status || "New"}
                            onChange={(event) =>
                              updateOrderStatus(
                                order,
                                event.target.value
                              )
                            }
                            aria-label={`Update status for ${order.orderId || order.id}`}
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* VIEW DETAILS */}

                        <td>
                          <button
                            className="order-view-btn"
                            title="View order details"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >
                            <Eye size={16} />
                          </button>
                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

      {/* ================= ORDER DETAIL DRAWER ================= */}

      {selectedOrder && (
        <OrderDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

    </div>
  );
}

/* =====================================================
   ORDER DETAIL DRAWER — customer kya customize kiya
===================================================== */

function OrderDrawer({ order, onClose }) {
  const [lightbox, setLightbox] = useState(null);

  const items = Array.isArray(order.cart)
    ? order.cart
    : Array.isArray(order.items)
    ? order.items
    : [];

  const formatPrice = (price) =>
    Number(price || 0).toLocaleString("en-IN");

  const ZoomableImg = ({ src, className }) =>
    src ? (
      <img
        src={src}
        alt=""
        className={`${className} od-zoomable`}
        title="Click to enlarge"
        onClick={() => setLightbox(src)}
      />
    ) : null;

  const renderElement = (el, side) => {
    if (el.hidden) return null;

    if (el.type === "image") {
      return (
        <div key={el.id} className="od-el">
          <span className="od-el-side">{side}</span>
          <span className="od-el-label">
            {el.label || "Logo / Image"}
          </span>
          {el.src && (
            <ZoomableImg
              src={el.src}
              className="od-el-img"
            />
          )}
        </div>
      );
    }

    if (el.type !== "text") return null;

    return (
      <div key={el.id} className="od-el">
        <span className="od-el-side">{side}</span>
        <span className="od-el-label">
          {el.label || "Text"}
        </span>
        <span
          className="od-el-text"
          style={{
            fontFamily: el.fontFamily,
            fontWeight: el.bold ? 700 : 400,
            fontStyle: el.italic ? "italic" : "normal",
            textDecoration: el.underline
              ? "underline"
              : "none",
            color: el.color,
          }}
        >
          {el.text}
        </span>
        <small className="od-el-meta">
          {el.fontFamily} · {el.fontSize}px ·{" "}
          {el.color}
        </small>
      </div>
    );
  };

  return (
    <div className="od-overlay" onClick={onClose}>
      <div
        className="od-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEAD */}
        <div className="od-head">
          <div>
            <h3>
              {order.orderId || order.id || "Order"}
            </h3>
            <span className="od-date">
              {order.createdAt
                ? new Date(
                    order.createdAt
                  ).toLocaleString("en-IN")
                : ""}
            </span>
          </div>

          <button
            className="od-close"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>

        {/* CUSTOMER */}
        <div className="od-section">
          <h4>Customer</h4>
          <div className="od-row">
            <span>Name</span>
            <strong>
              {order.name ||
                order.customerName ||
                order.userName ||
                "Customer"}
            </strong>
          </div>
          <div className="od-row">
            <span>Email</span>
            <strong>
              {order.email ||
                order.customerEmail ||
                "—"}
            </strong>
          </div>
          <div className="od-row">
            <span>Phone</span>
            <strong>
              {order.phone ||
                order.customerPhone ||
                "—"}
            </strong>
          </div>
          {(order.address ||
            order.shippingAddress) && (
            <div className="od-row">
              <span>Address</span>
              <strong>
                {order.address ||
                  order.shippingAddress}
              </strong>
            </div>
          )}
        </div>

        {/* ITEMS + CUSTOMIZATION */}
        {items.map((item, idx) => {
          const front = item.designs?.front || [];
          const back = item.designs?.back || [];
          const hasDesign =
            front.length > 0 || back.length > 0;

          return (
            <div
              className="od-section"
              key={item.id || idx}
            >
              <h4>
                <Palette size={14} />{" "}
                {item.name || "Product"}
              </h4>

              <div className="od-item-head">
                {item.image && (
                  <ZoomableImg
                    src={item.image}
                    className="od-item-img"
                  />
                )}
                <div className="od-item-meta">
                  {item.size && (
                    <span>Size: {item.size}</span>
                  )}
                  {item.paperType && (
                    <span>
                      Paper: {item.paperType}
                    </span>
                  )}
                  {item.color && (
                    <span>
                      Color: {item.color}
                    </span>
                  )}
                  <span>
                    Qty: {item.quantity || 1}
                  </span>
                  <span>
                    ₹
                    {formatPrice(
                      item.totalPrice || item.price
                    )}
                  </span>
                </div>
              </div>

              {hasDesign ? (
                <div className="od-design">
                  <div className="od-design-tag">
                    CUSTOMIZED DESIGN
                  </div>
                  {front.map((el) =>
                    renderElement(el, "Front")
                  )}
                  {back.map((el) =>
                    renderElement(el, "Back")
                  )}
                </div>
              ) : (
                <p className="od-no-design">
                  No customization — standard
                  product.
                </p>
              )}

              {item.customerDescription && (
                <div className="od-note">
                  <small>
                    Customer Description
                  </small>
                  <p>
                    {item.customerDescription}
                  </p>
                </div>
              )}

              {(item.customerNote ||
                item.specialNote) && (
                <div className="od-note">
                  <small>
                    Special Instructions
                  </small>
                  <p>
                    {item.customerNote ||
                      item.specialNote}
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {/* TOTAL */}
        <div className="od-section od-total">
          <div className="od-row">
            <span>Items</span>
            <strong>{items.length}</strong>
          </div>
          {order.customizationCharges >
            0 && (
            <div className="od-row">
              <span>
                Customization Charges
              </span>
              <strong>
                ₹
                {formatPrice(
                  order.customizationCharges
                )}
              </strong>
            </div>
          )}
          <div className="od-row od-grand">
            <span>Total</span>
            <strong>
              ₹
              {formatPrice(
                order.totalPrice ||
                  order.amount
              )}
            </strong>
          </div>
        </div>

        {/* LIGHTBOX — full-size image */}
        {lightbox && (
          <div
            className="od-lightbox"
            onClick={() => setLightbox(null)}
          >
            <img src={lightbox} alt="" />
            <span className="od-lightbox-hint">
              Click anywhere to close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}