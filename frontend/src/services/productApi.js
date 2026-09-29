import { API_URL } from "./apiConfig";
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
  const serialized = JSON.stringify(products);

  /* same data hai to write+dispatch skip —
     ananyaProductsUpdated listener -> loadProducts ->
     fetchProducts -> dispatch ka infinite loop nahi banega */
  if (localStorage.getItem(STORAGE_KEY) === serialized) {
    return;
  }

  localStorage.setItem(STORAGE_KEY, serialized);
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

export const fetchProducts = async (search = "") => {
  const cachedProducts = (() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();

  const searchTerm = String(search || "").trim();

  const path = searchTerm
    ? `/products?search=${encodeURIComponent(searchTerm)}`
    : "/products";

  const data = await request(path);

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

  if (products.length === 0 && cachedProducts.length > 0 && token && isAdmin && !searchTerm) {
    const imported = await request("/products/import", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ products: cachedProducts }),
    });

    products = Array.isArray(imported.products)
      ? imported.products
      : [];
  }

  /* search result ko cache mein mat likho —
     warna baaki pages ko sirf search matches milenge */
  if (products.length > 0 && !searchTerm) {
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
