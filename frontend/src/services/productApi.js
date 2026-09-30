import { API_URL } from "./apiConfig";
const inFlight = new Map();

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Product request failed.");
  }

  return data;
};

/* notify listening pages (Home/Category/Navbar) to
   refetch from the API — no catalog copy is stored */
const notifyProductsUpdated = () => {
  window.dispatchEvent(new Event("ananyaProductsUpdated"));
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("Administrator authentication is required.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchProducts = (search = "", filters = {}) => {
  const searchTerm = String(search || "").trim();
  const category = String(filters.category || "").trim();
  const subcategory = String(filters.subcategory || "").trim();

  /* same query already in flight — avoid duplicate requests */
  const key = `${searchTerm}|${category}|${subcategory}`;
  if (inFlight.has(key)) {
    return inFlight.get(key);
  }

  const promise = (async () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    const qs = params.toString();
    const path = `/products${qs ? `?${qs}` : ""}`;

    const data = await request(path);
    return Array.isArray(data.products) ? data.products : [];
  })();

  inFlight.set(key, promise);
  promise.finally(() => inFlight.delete(key));

  return promise;
};

export const fetchProductById = async (id) => {
  const data = await request(`/products/${id}`);
  return data.product;
};

export const isActiveProduct = (product) =>
  product?.status !== "Inactive";

export const createProduct = async (product) => {
  const data = await request("/products", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  notifyProductsUpdated();
  return data.product;
};

export const updateProduct = async (id, product) => {
  const data = await request(`/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  notifyProductsUpdated();
  return data.product;
};

export const deleteProduct = async (id) => {
  await request(`/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  notifyProductsUpdated();
  return fetchProducts();
};
