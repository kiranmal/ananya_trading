import { useState, useEffect } from "react";
import { API_URL } from "../../services/apiConfig";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryApi";
import {
  Tags,
  ChevronRight,
  Package,
  FolderOpen,
  Eye,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   CATEGORY COLORS
===================================================== */

const categoryColors = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#f97316",
  "#6366f1",
];

export default function AdminCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  /* Add/Edit form state */
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formName, setFormName] = useState("");
  const [formItems, setFormItems] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  /* =====================================================
     FETCH CATEGORIES + PRODUCT COUNTS
  ===================================================== */

  const loadCategories = async () => {
    const list = await fetchCategories();
    setCategories(list);
    return list;
  };

  useEffect(() => {
    const load = async () => {
      await loadCategories();

      try {
        const res = await fetch(
          `${API_URL}/products`
        );
        const data = await res.json();

        if (data.success && Array.isArray(data.products)) {
          const counts = {};
          data.products.forEach((p) => {
            const cat = p.category || "Uncategorized";
            counts[cat] = (counts[cat] || 0) + 1;
          });
          setProductCounts(counts);
        }
      } catch {
        // fallback — no counts
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* =====================================================
     FORM OPEN/CLOSE
  ===================================================== */

  const openAddForm = () => {
    setEditingCategory(null);
    setFormName("");
    setFormItems("");
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormItems((category.items || []).join(", "));
    setShowForm(true);
    setExpandedCategory(null);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormName("");
    setFormItems("");
  };

  /* =====================================================
     SAVE CATEGORY (ADD + EDIT)
  ===================================================== */

  const handleSaveCategory = async (e) => {
    e.preventDefault();

    const name = formName.trim();
    if (name.length < 2) {
      alert("Category name must be at least 2 characters.");
      return;
    }

    const items = formItems
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setSaving(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, name, items);
      } else {
        await createCategory(name, items);
      }
      closeForm();
      await loadCategories();
    } catch (error) {
      alert(error.message || "Unable to save category.");
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE CATEGORY
  ===================================================== */

  const handleDeleteCategory = async (category) => {
    if (!category.id) {
      alert("This category cannot be deleted (default static data).");
      return;
    }

    const count = productCounts[category.name] || 0;
    const message =
      count > 0
        ? `Delete "${category.name}"? ${count} product(s) belong to this category — they will keep their category label.`
        : `Delete "${category.name}"?`;

    if (!window.confirm(message)) {
      return;
    }

    setDeletingId(category.id);

    try {
      await deleteCategory(category.id);
      await loadCategories();
    } catch (error) {
      alert(error.message || "Unable to delete category.");
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     STATS
  ===================================================== */

  const totalCategories = categories.length;
  const totalSubcategories = categories.reduce(
    (sum, c) => sum + (c.items?.length || 0),
    0
  );
  const totalProducts = Object.values(productCounts).reduce(
    (s, n) => s + n,
    0
  );

  return (
    <div style={{ width: "100%" }}>

      {/* =====================================================
          PAGE HEADING
      ===================================================== */}

      <div className="page-heading">
        <div>
          <h2>Categories</h2>
          <p>Manage product categories and subcategories</p>
        </div>

        <button
          type="button"
          onClick={() => (showForm ? closeForm() : openAddForm())}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 18px",
            border: "none",
            borderRadius: "10px",
            background: "#1263bd",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "Cancel" : "Add Category"}
        </button>
      </div>

      {/* =====================================================
          ADD / EDIT CATEGORY FORM
      ===================================================== */}

      {showForm && (
        <form
          onSubmit={handleSaveCategory}
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "14px",
            padding: "22px 24px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            {editingCategory
              ? `Edit Category: ${editingCategory.name}`
              : "Add New Category"}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "16px",
              alignItems: "end",
            }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Category Name *
              </label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. Diaries & Journals"
                style={{
                  width: "100%",
                  height: "42px",
                  padding: "0 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: "6px",
                }}
              >
                Subcategories (comma separated)
              </label>
              <input
                type="text"
                value={formItems}
                onChange={(e) => setFormItems(e.target.value)}
                placeholder="e.g. Diaries, Journals, Planners"
                style={{
                  width: "100%",
                  height: "42px",
                  padding: "0 14px",
                  border: "1px solid #d1d5db",
                  borderRadius: "8px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                height: "42px",
                padding: "0 22px",
                border: "none",
                borderRadius: "8px",
                background: saving ? "#9ca3af" : "#10b981",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {editingCategory
                ? saving
                  ? "Saving..."
                  : "Save"
                : saving
                  ? "Adding..."
                  : "Add"}
            </button>
          </div>
        </form>
      )}

      {/* =====================================================
          STATS CARDS
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "28px",
        }}
      >
        {[
          {
            label: "Total Categories",
            value: totalCategories,
            icon: Tags,
            color: "#3b82f6",
            bg: "#eff6ff",
          },
          {
            label: "Subcategories",
            value: totalSubcategories,
            icon: FolderOpen,
            color: "#10b981",
            bg: "#ecfdf5",
          },
          {
            label: "Total Products",
            value: loading ? "..." : totalProducts,
            icon: Package,
            color: "#f59e0b",
            bg: "#fffbeb",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              background: "#fff",
              borderRadius: "12px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: stat.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <stat.icon size={22} color={stat.color} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  marginBottom: "4px",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          CATEGORIES GRID
      ===================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "20px",
        }}
      >
        {categories.map((category, index) => {
          const color = categoryColors[index % categoryColors.length];
          const count = productCounts[category.name] || 0;
          const isExpanded = expandedCategory === index;

          return (
            <div
              key={category.name}
              style={{
                background: "#fff",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
                overflow: "hidden",
                transition: "box-shadow 0.2s",
              }}
            >
              {/* Category Header */}
              <div
                style={{
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  borderBottom: isExpanded
                    ? "1px solid #f3f4f6"
                    : "none",
                }}
                onClick={() =>
                  setExpandedCategory(isExpanded ? null : index)
                }
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      background: color + "15",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Tags size={20} color={color} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        color: "#111827",
                      }}
                    >
                      {category.name}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#6b7280",
                        marginTop: "2px",
                      }}
                    >
                      {category.items.length} subcategories
                      {count > 0 && (
                        <span
                          style={{
                            marginLeft: "8px",
                            color: color,
                            fontWeight: 600,
                          }}
                        >
                          {count} products
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {category.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditForm(category);
                      }}
                      title="Edit category"
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                  )}

                  {category.id && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(category);
                      }}
                      disabled={deletingId === category.id}
                      title="Delete category"
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "none",
                        borderRadius: "8px",
                        background: "#fef2f2",
                        color: "#dc2626",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor:
                          deletingId === category.id
                            ? "not-allowed"
                            : "pointer",
                        opacity:
                          deletingId === category.id ? 0.5 : 1,
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  )}

                  <ChevronRight
                    size={20}
                    color="#9ca3af"
                    style={{
                      transform: isExpanded
                        ? "rotate(90deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </div>
              </div>

              {/* Subcategories */}
              {isExpanded && (
                <div style={{ padding: "8px 24px 20px" }}>
                  {category.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        marginBottom: "4px",
                        transition: "background 0.15s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                      onClick={() =>
                        navigate(
                          `/category?type=${encodeURIComponent(item)}`
                        )
                      }
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: color,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "14px",
                            color: "#374151",
                          }}
                        >
                          {item}
                        </span>
                      </div>
                      <Eye size={15} color="#9ca3af" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
