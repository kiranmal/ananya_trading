import { API_URL } from "./apiConfig";
import defaultCategories from "../data/categories";

// API se categories fetch karta hai; fail hone pe static fallback use karta hai
export const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json().catch(() => ({}));

    if (res.ok && Array.isArray(data.categories) && data.categories.length > 0) {
      return data.categories;
    }
  } catch {
    // fall through to defaults
  }

  return defaultCategories;
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

export const createCategory = async (name, items = []) => {
  const res = await fetch(`${API_URL}/admin/categories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, items }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to add category.");
  }

  return data.category;
};

export const updateCategory = async (id, name, items = []) => {
  const res = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name, items }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to update category.");
  }

  return data.category;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${API_URL}/admin/categories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to delete category.");
  }

  return data;
};


/* =====================================================
   SUBCATEGORIES
===================================================== */

export const fetchSubcategories = async (categoryId = null) => {
  const query = categoryId ? `?category_id=${encodeURIComponent(categoryId)}` : "";
  const res = await fetch(`${API_URL}/subcategories${query}`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to load subcategories.");
  }

  return Array.isArray(data.subcategories) ? data.subcategories : [];
};

export const createSubcategory = async (categoryId, name) => {
  const res = await fetch(`${API_URL}/admin/subcategories`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ category_id: categoryId, name }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to add subcategory.");
  }

  return data.subcategory;
};

export const updateSubcategory = async (id, payload = {}) => {
  const res = await fetch(`${API_URL}/admin/subcategories/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to update subcategory.");
  }

  return data.subcategory;
};

export const deleteSubcategory = async (id) => {
  const res = await fetch(`${API_URL}/admin/subcategories/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to delete subcategory.");
  }

  return data;
};

/* =====================================================
   TAGS
===================================================== */

export const fetchTags = async () => {
  const res = await fetch(`${API_URL}/tags`);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to load tags.");
  }

  return Array.isArray(data.tags) ? data.tags : [];
};

export const createTag = async (name) => {
  const res = await fetch(`${API_URL}/admin/tags`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to add tag.");
  }

  return data.tag;
};

export const updateTag = async (id, payload = {}) => {
  const res = await fetch(`${API_URL}/admin/tags/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to update tag.");
  }

  return data.tag;
};

export const deleteTag = async (id) => {
  const res = await fetch(`${API_URL}/admin/tags/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Unable to delete tag.");
  }

  return data;
};
