import React from "react";

const OrderCard = ({ order, onTrack }) => {

  return (
    <div className="order-card">

      <div className="order-top">

        <div>
          <span>Order ID</span>
          <strong>{order.id}</strong>
        </div>

        <div>
          <span>Order Date</span>
          <strong>{order.date}</strong>
        </div>

        <div>
          <span>Total</span>
          <strong>₹{order.total}</strong>
        </div>

      </div>

      <div className="order-products">

        {order.items.map((item) => (

          <div
            className="order-product"
            key={item.id}
          >

            <img
              src={item.image}
              alt={item.name}
            />

            <div className="order-product-info">

              <h3>{item.name}</h3>

              <p>
                Quantity: {item.quantity}
              </p>

              <strong>
                ₹{item.price}
              </strong>

            </div>

          </div>

        ))}

      </div>

      <div className="order-bottom">

        <div>

          <span className="status-label">
            Current Status
          </span>

          <strong
            className={`order-status ${order.status
              .toLowerCase()
              .replaceAll(" ", "-")}`}
          >
            {order.status}
          </strong>

        </div>

        <button
          className="track-order-btn"
          onClick={() => onTrack(order)}
        >
          Track Order
        </button>

      </div>

    </div>
  );
};

export default OrderCard;