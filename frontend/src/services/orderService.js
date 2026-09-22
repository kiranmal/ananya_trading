import defaultOrders from "../data/orders";

export const getOrders = () => {
  const savedOrders = localStorage.getItem("orders");

  if (savedOrders) {
    try {
      return JSON.parse(savedOrders);
    } catch {
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
  const normalizedId = String(orderId || "").trim().toLowerCase();

  if (!normalizedId) {
    return undefined;
  }

  const checkoutOrders = (() => {
    try {
      const savedOrders = localStorage.getItem("ananyaOrders");
      const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];
      return Array.isArray(parsedOrders) ? parsedOrders : [];
    } catch {
      return [];
    }
  })();

  const allOrders = [...checkoutOrders, ...getOrders()];

  return allOrders.find((order) => {
    const id = order?.orderNumber || order?.orderId || order?.id;
    return String(id || "").trim().toLowerCase() === normalizedId;
  });
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