import { useState, useEffect } from "react";
import {
  Tags,
  ChevronRight,
  Package,
  FolderOpen,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* =====================================================
   CATEGORIES DATA (same as Navbar)
===================================================== */

const allCategories = [
  {
    name: "Visiting Cards",
    items: [
      "Premium Business Cards",
      "Standard Cards",
      "Matte Cards",
      "Glossy Cards",
    ],
  },
  {
    name: "Stationery & Office",
    items: [
      "Letterheads",
      "Notebooks",
      "Envelopes",
      "Office Files",
      "Stamps",
    ],
  },
  {
    name: "Marketing Materials",
    items: [
      "Flyers",
      "Brochures",
      "Posters",
      "Leaflets",
      "Calendars",
    ],
  },
  {
    name: "Stickers & Labels",
    items: [
      "Product Labels",
      "Vinyl Stickers",
      "Round Stickers",
      "Packaging Labels",
    ],
  },
  {
    name: "Packaging",
    items: [
      "Paper Bags",
      "Boxes",
      "Food Packaging",
      "Product Packaging",
    ],
  },
  {
    name: "Clothing & Bags",
    items: [
      "T-Shirts",
      "Caps",
      "Tote Bags",
      "Corporate Bags",
    ],
  },
  {
    name: "Mugs & Gifts",
    items: [
      "Coffee Mugs",
      "Photo Mugs",
      "Keychains",
      "Corporate Gifts",
    ],
  },
  {
    name: "Pens & Drinkware",
    items: [
      "Ball Pens",
      "Premium Pens",
      "Water Bottles",
      "Travel Mugs",
    ],
  },
  {
    name: "Custom Polo T-Shirts",
    items: [
      "Corporate Polo",
      "Printed Polo",
      "Custom T-Shirts",
    ],
  },
];

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
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState(null);

  /* =====================================================
     FETCH PRODUCT COUNTS PER CATEGORY
  ===================================================== */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/products"
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

    fetchProducts();
  }, []);

  /* =====================================================
     STATS
  ===================================================== */

  const totalCategories = allCategories.length;
  const totalSubcategories = allCategories.reduce(
    (sum, c) => sum + c.items.length,
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
      </div>

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
        {allCategories.map((category, index) => {
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
