
import React, { useState } from "react";
import "./AdminProducts.css";

export default function AdminProducts() {
  const [showModal, setShowModal] = useState(false);

  const [products, setProducts] = useState([
    {
      id: "#PROD-001",
      name: "Wireless Headphones",
      category: "Electronics",
      price: 2499,
      stock: 25,
      status: "Active",
    },
    {
      id: "#PROD-002",
      name: "Men's T-Shirt",
      category: "Fashion",
      price: 799,
      stock: 50,
      status: "Active",
    },
    {
      id: "#PROD-003",
      name: "Kitchen Mixer",
      category: "Home & Kitchen",
      price: 3499,
      stock: 12,
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
  });

  // Input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add Product
  const handleAddProduct = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name.trim() ||
      !formData.category.trim() ||
      !formData.price ||
      !formData.stock
    ) {
      alert("Please fill all fields.");
      return;
    }

    const newProduct = {
      id: `#PROD-${String(products.length + 1).padStart(3, "0")}`,
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      status: formData.status,
    };

    setProducts((prev) => [...prev, newProduct]);

    // Form reset
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "Active",
    });

    // Close modal
    setShowModal(false);
  };

  // Delete Product
  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    setProducts((prev) =>
      prev.filter((product) => product.id !== id)
    );
  };

  // Change status
  const handleStatusChange = (id) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? {
              ...product,
              status:
                product.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : product
      )
    );
  };

  return (
    <div className="admin-page">

      {/* =========================
          PAGE HEADING
      ========================== */}
      <div className="page-heading">

        <div>
          <h2>Products</h2>
          <p>Manage your products.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Product
        </button>

      </div>


      {/* =========================
          PRODUCT PANEL
      ========================== */}
      <div className="panel">

        <div className="panel-head">

          <div>
            <h3>All Products</h3>
            <p>Product inventory management</p>
          </div>

          <div className="product-count">
            Total Products: <strong>{products.length}</strong>
          </div>

        </div>


        {/* =========================
            TABLE
        ========================== */}
        <div className="table-wrap">

          <table className="admin-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {products.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No products found.
                  </td>
                </tr>

              ) : (

                products.map((product) => (

                  <tr key={product.id}>

                    <td>{product.id}</td>

                    <td>
                      <strong>{product.name}</strong>
                    </td>

                    <td>{product.category}</td>

                    <td>
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>

                    <td>{product.stock}</td>

                    <td>

                      <button
                        className={
                          product.status === "Active"
                            ? "status delivered status-btn"
                            : "status inactive status-btn"
                        }
                        onClick={() =>
                          handleStatusChange(product.id)
                        }
                      >
                        {product.status}
                      </button>

                    </td>

                    <td>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(product.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =========================
          ADD PRODUCT MODAL
      ========================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="modal-header">

              <div>
                <h3>Add Product</h3>
                <p>Add a new product to your store.</p>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form onSubmit={handleAddProduct}>

              {/* Product Name */}

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>


              {/* Category */}

              <div className="form-group">

                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >

                  <option value="">
                    Select Category
                  </option>

                  <option value="Electronics">
                    Electronics
                  </option>

                  <option value="Fashion">
                    Fashion
                  </option>

                  <option value="Home & Kitchen">
                    Home & Kitchen
                  </option>

                  <option value="Beauty">
                    Beauty
                  </option>

                  <option value="Sports">
                    Sports
                  </option>

                  <option value="Books">
                    Books
                  </option>

                </select>

              </div>


              {/* Price */}

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    placeholder="Enter price"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                  />

                </div>


                {/* Stock */}

                <div className="form-group">

                  <label>
                    Stock
                  </label>

                  <input
                    type="number"
                    name="stock"
                    placeholder="Enter stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                  />

                </div>

              </div>


              {/* Status */}

              <div className="form-group">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>


              {/* Buttons */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  Add Product
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}
