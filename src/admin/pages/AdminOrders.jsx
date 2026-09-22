import React, { useEffect, useState } from "react";
import "./AdminOrders.css";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

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

  const loadOrders = () => {
    try {
      const savedOrders =
        localStorage.getItem("ananyaOrders");

      const parsedOrders = savedOrders
        ? JSON.parse(savedOrders)
        : [];

      setOrders(
        Array.isArray(parsedOrders)
          ? parsedOrders
          : []
      );
    } catch (error) {
      console.error(
        "Orders loading error:",
        error
      );

      setOrders([]);
    }
  };

  const getStatusClass = (status) => {
    return String(status || "Pending")
      .toLowerCase()
      .replace(/\s+/g, "-");
  };

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString(
      "en-IN"
    );
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
                  (order) =>
                    String(
                      order.status
                    ).toLowerCase() ===
                    "pending"
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

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}