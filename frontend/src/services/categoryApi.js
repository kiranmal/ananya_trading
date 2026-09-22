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
