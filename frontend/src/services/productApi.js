const API_URL = "http://localhost:5000/api";
const STORAGE_KEY = "ananyaProducts";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Product request failed.");
  }

  return data;
};

const syncProductCache = (products) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
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

export const fetchProducts = async () => {
  const cachedProducts = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const data = await request("/products");
  let products = Array.isArray(data.products) ? data.products : [];
  const token = localStorage.getItem("authToken");
  const savedUser = localStorage.getItem("currentUser");
  const isAdmin = (() => {
    try {
      return JSON.parse(savedUser || "null")?.role === "admin";
    } catch {
      return false;
    }
  })();

  if (products.length === 0 && cachedProducts.length > 0 && token && isAdmin) {
    const imported = await request("/products/import", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ products: cachedProducts }),
    });
    products = Array.isArray(imported.products) ? imported.products : [];
  }

  if (products.length > 0) {
    syncProductCache(products);
  }

  return products;
};

export const fetchProductById = async (id) => {
  const data = await request(`/products/${id}`);
  return data.product;
};

export const createProduct = async (product) => {
  const data = await request("/products", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  await fetchProducts();
  return data.product;
};

export const updateProduct = async (id, product) => {
  const data = await request(`/products/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(product),
  });
  await fetchProducts();
  return data.product;
};

export const deleteProduct = async (id) => {
  await request(`/products/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return fetchProducts();
};
