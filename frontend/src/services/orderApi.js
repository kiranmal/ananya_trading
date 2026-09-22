import { API_URL } from "./apiConfig";

const authHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token
    ? { Authorization: `Bearer ${token}` }
    : null;
};

/* Checkout — order DB mein save (localStorage ke saath) */
export const saveOrderToServer = async (order) => {
  const headers = authHeaders();
  if (!headers) return null;

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    const data = await res.json().catch(() => ({}));
    return res.ok && data.success ? data : null;
  } catch {
    return null;
  }
};

/* User ke orders (login required) */
export const fetchMyOrders = async () => {
  const headers = authHeaders();
  if (!headers) return [];

  try {
    const res = await fetch(`${API_URL}/orders/my`, {
      headers,
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && Array.isArray(data.orders)
      ? data.orders
      : [];
  } catch {
    return [];
  }
};

/* Admin — saare orders */
export const fetchAllOrders = async () => {
  const headers = authHeaders();
  if (!headers) return null;

  try {
    const res = await fetch(`${API_URL}/admin/orders`, {
      headers,
    });
    const data = await res.json().catch(() => ({}));
    return res.ok && Array.isArray(data.orders)
      ? data.orders
      : null;
  } catch {
    return null;
  }
};

/* Admin — status update */
export const updateOrderStatusRemote = async (
  orderNumber,
  status
) => {
  const headers = authHeaders();
  if (!headers) return false;

  try {
    const res = await fetch(
      `${API_URL}/admin/orders/${encodeURIComponent(orderNumber)}/status`,
      {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
};

/* LocalStorage + server orders ko orderNumber se merge */
export const mergeOrders = (remoteOrders, localOrders) => {
  const map = new Map();

  (Array.isArray(localOrders) ? localOrders : []).forEach(
    (o) => {
      const id =
        o?.orderNumber || o?.orderId || o?.id;
      if (id) map.set(String(id), o);
    }
  );

  (Array.isArray(remoteOrders) ? remoteOrders : []).forEach(
    (o) => {
      const id =
        o?.orderNumber || o?.orderId || o?.id;
      if (id) map.set(String(id), o);
    }
  );

  return Array.from(map.values());
};
