import { API_URL } from "./apiConfig";
const STORAGE_KEY = "ananyaProducts";
const inFlight = new Map();

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

  /* if data unchanged, skip write+dispatch —
     ananyaProductsUpdated listener -> loadProducts ->
     fetchProducts -> dispatch would loop infinitely */
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

export const fetchProducts = (search = "", filters = {}) => {
  const searchTerm = String(search || "").trim();
  const category = String(filters.category || "").trim();
  const subcategory = String(filters.subcategory || "").trim();
  const isFiltered = !!(searchTerm || category || subcategory);

  /* same query already in flight — duplicate API request avoid */
  const key = `${searchTerm}|${category}|${subcategory}`;
  if (inFlight.has(key)) {
    return inFlight.get(key);
  }

  const promise = (async () => {
    const cachedProducts = (() => {
      try {
        const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })();

    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (category) params.set("category", category);
    if (subcategory) params.set("subcategory", subcategory);
    const qs = params.toString();
    const path = `/products${qs ? `?${qs}` : ""}`;

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

    if (products.length === 0 && cachedProducts.length > 0 && token && isAdmin && !isFiltered) {
      const imported = await request("/products/import", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ products: cachedProducts }),
      });

      products = Array.isArray(imported.products)
        ? imported.products
        : [];
    }

    /* do not cache filtered results —
       otherwise other pages would only see filtered matches */
    if (products.length > 0 && !isFiltered) {
      syncProductCache(products);
    }

    return products;
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
