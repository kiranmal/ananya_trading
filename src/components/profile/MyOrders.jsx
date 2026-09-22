import React from "react";
import OrderCard from "./OrderCard";

const MyOrders = ({ orders, onTrack }) => {

  return (
    <div className="orders-section">

      <div className="section-heading">

        <div>
          <p>Shopping History</p>
          <h2>My Orders</h2>
        </div>

        <span>
          {orders.length} Orders
        </span>

      </div>

      {orders.length === 0 ? (

        <div className="empty-orders">
          <div className="empty-icon">📦</div>

          <h3>No orders yet</h3>

          <p>
            Your placed orders will appear here.
          </p>
        </div>

      ) : (

        <div className="orders-list">

          {orders.map((order) => (

            <OrderCard
              key={order.id}
              order={order}
              onTrack={onTrack}
            />

          ))}

        </div>

      )}

    </div>
  );
};

export default MyOrders;