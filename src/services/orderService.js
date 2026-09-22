import defaultOrders from "../data/orders";

export const getOrders = () => {
  const savedOrders = localStorage.getItem("orders");

  if (savedOrders) {
    try {
      return JSON.parse(savedOrders);
    } catch (error) {
      console.error("Invalid orders data");
    }
  }

  localStorage.setItem(
    "orders",
    JSON.stringify(defaultOrders)
  );

  return defaultOrders;
};

export const getOrderById = (orderId) => {
  const orders = getOrders();

  return orders.find(
    (order) => order.id === orderId
  );
};

export const saveOrder = (order) => {
  const orders = getOrders();

  const updatedOrders = [
    order,
    ...orders,
  ];

  localStorage.setItem(
    "orders",
    JSON.stringify(updatedOrders)
  );

  return updatedOrders;
};