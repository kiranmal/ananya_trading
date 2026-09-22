import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminTable from "../components/AdminTable";
import categoriesData from "../../data/categories";
import { fetchCategories } from "../../services/categoryApi";
import {
  deleteProduct as deleteProductFromApi,
  fetchProducts,
} from "../../services/productApi";

import "./AdminProducts.css";

export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [categoryList, setCategoryList] = useState(categoriesData);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");


  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProducts(await fetchProducts());
      } catch (error) {
        console.error("Products loading error:", error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);


  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      setCategoryList(await fetchCategories());
    };

    loadCategories();
  }, []);


  // Delete product
  const deleteProduct = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }


    try {
      setProducts(
        await deleteProductFromApi(id)
      );
    } catch (error) {
      console.error("Product delete error:", error);
      alert(error.message);
    }

  };


  // Categories list — master list + products mein jo extra ho
  const categories = [
    "All Categories",
    ...new Set([
      ...categoryList.map(cat => cat.name),
      ...products
        .map(product => product.category)
        .filter(Boolean),
    ]),
  ];


  // Search + Category filter
  const filteredProducts =
    products.filter(product => {

      const text =
        `${product.name} ${product.category}`
          .toLowerCase();

      const matchesSearch =
        text.includes(
          search.toLowerCase()
        );

      const matchesCategory =
        category === "All Categories" ||
        product.category === category;

      return matchesSearch && matchesCategory;

    });


  // Group products by category
  const groupedByCategory = {};
  filteredProducts.forEach(product => {
    const cat = product.category || "Uncategorized";
    if (!groupedByCategory[cat]) {
      groupedByCategory[cat] = [];
    }
    groupedByCategory[cat].push(product);
  });

  const categoryOrder = categories.filter(c => c !== "All Categories");
  const sortedCategoryKeys = Object.keys(groupedByCategory).sort((a, b) => {
    const ia = categoryOrder.indexOf(a);
    const ib = categoryOrder.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });


  return (

    <div className="admin-products">

      {/* PAGE HEADER */}

      <div className="page-heading">

        <div>

          <h2>
            Products
          </h2>

          <p>
            {products.length} products in your store
          </p>

        </div>


        <Link
          className="primary-btn"
          to="/admin/products/add"
        >
          ＋ Add Product
        </Link>

      </div>


      {/* PRODUCT PANEL */}

      <section className="panel">

        {/* TOOLBAR */}

        <div className="toolbar">

          <input
            className="search-input"
            type="text"
            placeholder="🔎 Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <select
            className="filter"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

            {categories.map(cat => (

              <option
                key={cat}
                value={cat}
              >
                {cat}
              </option>

            ))}

          </select>

        </div>


        {/* TABLE */}

        <AdminTable
          headers={[
            "Product",
            "Category",
            "Price",
            "Stock",
            "Status",
            "Action"
          ]}
        >

          {sortedCategoryKeys.map(cat => (

            <React.Fragment key={cat}>

              {/* CATEGORY HEADER ROW */}

              <tr>
                <td
                  colSpan="6"
                  style={{
                    background: "#f0f4ff",
                    padding: "12px 16px",
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "#1e40af",
                    borderBottom: "2px solid #dbeafe",
                    letterSpacing: "0.3px",
                  }}
                >
                  {cat}
                  <span
                    style={{
                      marginLeft: "10px",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "#6b7280",
                    }}
                  >
                    ({groupedByCategory[cat].length} products)
                  </span>
                </td>
              </tr>


              {groupedByCategory[cat].map(
                product => (

                  <tr key={product.id}>

                    {/* PRODUCT */}

                    <td>

                      <div className="product-cell">

                        <div className="product-thumb">

                          {product.images?.[0] ? (

                            <img
                              src={product.images[0]}
                              alt={product.name}
                            />

                          ) : (

                            "🛍️"

                          )}

                        </div>


                        <div className="product-name">

                          <strong>
                            {product.name}
                          </strong>

                          <small>
                            {product.badge || "Standard"}
                          </small>

                        </div>

                      </div>

                    </td>


                    {/* CATEGORY */}

                    <td>

                      <span className="category-pill">
                        {product.category}
                      </span>

                    </td>


                    {/* PRICE */}

                    <td className="price-cell">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>


                    {/* STOCK */}

                    <td>

                      <span
                        className={`stock-pill ${
                          product.stock <= 10
                            ? "low"
                            : "ok"
                        }`}
                      >
                        {product.stock} units
                      </span>

                    </td>


                    {/* STATUS */}

                    <td>

                      <span
                        className={`status ${
                          product.status === "Active"
                            ? "delivered"
                            : product.status === "Low Stock"
                            ? "pending"
                            : "cancelled"
                        }`}
                      >
                        {product.status}
                      </span>

                    </td>


                    {/* ACTION */}

                    <td>

                      <div className="actions">

                        <Link
                          className="action-btn edit-btn"
                          to={`/admin/products/edit/${product.id}`}
                          title="Edit product"
                        >
                          ✏️
                        </Link>


                        <button
                          type="button"
                          className="action-btn delete-btn"
                          title="Delete product"
                          onClick={() =>
                            deleteProduct(product.id)
                          }
                        >
                          🗑️
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </React.Fragment>

          ))}


          {/* EMPTY */}

          {filteredProducts.length === 0 && (

            <tr>

              <td
                colSpan="6"
                className="empty-state"
              >

                🛍️ No products found.

              </td>

            </tr>

          )}

        </AdminTable>

      </section>

    </div>

  );
}