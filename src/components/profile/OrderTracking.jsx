import React from "react";

const OrderTracking = ({ order }) => {

  if (!order) {
    return (
      <div className="profile-card">
        <h2>Select an order to track</h2>
      </div>
    );
  }

  const steps = [
    {
      key: "ordered",
      title: "Order Placed",
      icon: "✓",
    },
    {
      key: "processing",
      title: "Processing",
      icon: "⚙",
    },
    {
      key: "shipped",
      title: "Shipped",
      icon: "📦",
    },
    {
      key: "outForDelivery",
      title: "Out for Delivery",
      icon: "🚚",
    },
    {
      key: "delivered",
      title: "Delivered",
      icon: "✓",
    },
  ];

  return (
    <div className="profile-card tracking-card">

      <div className="tracking-header">

        <div>
          <p>Order Tracking</p>

          <h2>
            {order.id}
          </h2>
        </div>

        <div className="tracking-status">
          {order.status}
        </div>

      </div>

      <div className="tracking-product">

        <img
          src={order.items[0]?.image}
          alt={order.items[0]?.name}
        />

        <div>

          <h3>
            {order.items[0]?.name}
          </h3>

          <p>
            Expected delivery:{" "}
            <strong>
              {order.deliveryDate}
            </strong>
          </p>

        </div>

      </div>

      <div className="tracking-timeline">

        {steps.map((step, index) => {

          const completed =
            order.tracking?.[step.key];

          return (
            <div
              className={`tracking-step ${
                completed ? "completed" : ""
              }`}
              key={step.key}
            >

              <div className="tracking-dot">
                {completed
                  ? step.icon
                  : index + 1}
              </div>

              <div className="tracking-step-content">

                <strong>
                  {step.title}
                </strong>

                <span>
                  {completed
                    ? "Completed"
                    : "Pending"}
                </span>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
};

export default OrderTracking;