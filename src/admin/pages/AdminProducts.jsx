import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import AdminTable from "../components/AdminTable";

const defaultProducts = [
  {
    id: 1,
    name: "Premium Cotton Shirt",
    category: "Fashion",
    price: 1299,
    oldPrice: 1599,
    stock: 45,
    status: "Active",
    badge: "Popular",
    rating: 4.8,
    reviews: 120,
    discount: "19% OFF",
    description: "Premium quality product.",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800",
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800"
    ],
    paperTypes: ["Matte", "Glossy"],
    sizes: ["S", "M", "L", "XL"],
    features: [
      "Premium quality",
      "Long lasting",
      "Fast delivery"
    ]
  },

  {
    id: 2,
    name: "Classic Sneakers",
    category: "Footwear",
    price: 2499,
    oldPrice: 2999,
    stock: 18,
    status: "Active",
    badge: "Trending",
    rating: 4.7,
    reviews: 95,
    discount: "17% OFF",
    description: "Comfortable and stylish sneakers.",
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"
    ],
    paperTypes: ["Standard"],
    sizes: ["7", "8", "9", "10"],
    features: [
      "Comfortable",
      "Premium material",
      "Modern design"
    ]
  },

  {
    id: 3,
    name: "Leather Backpack",
    category: "Bags",
    price: 3799,
    oldPrice: 4499,
    stock: 7,
    status: "Low Stock",
    badge: "Premium",
    rating: 4.6,
    reviews: 75,
    discount: "16% OFF",
    description: "Premium leather backpack.",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800"
    ],
    paperTypes: ["Premium"],
    sizes: ["Medium", "Large"],
    features: [
      "Premium leather",
      "Spacious",
      "Durable"
    ]
  }
];


export default function AdminProducts() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");


  // Load products
  useEffect(() => {

    const savedProducts =
      JSON.parse(
        localStorage.getItem("ananyaProducts")
      );

    if (savedProducts && savedProducts.length > 0) {

      setProducts(savedProducts);

    } else {

      localStorage.setItem(
        "ananyaProducts",
        JSON.stringify(defaultProducts)
      );

      setProducts(defaultProducts);

    }

  }, []);


  // Delete product
  const deleteProduct = (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this product?"
      );

    if (!confirmDelete) {
      return;
    }


    const updatedProducts =
      products.filter(
        product => product.id !== id
      );


    setProducts(updatedProducts);


    localStorage.setItem(
      "ananyaProducts",
      JSON.stringify(updatedProducts)
    );

  };


  // Search
  const filteredProducts =
    products.filter(product => {

      const text =
        `${product.name} ${product.category}`
          .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );

    });


  return (

    <div>

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


          <select className="filter">

            <option>
              All Categories
            </option>

            <option>
              Fashion
            </option>

            <option>
              Electronics
            </option>

            <option>
              Footwear
            </option>

            <option>
              Bags
            </option>

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

          {filteredProducts.map(
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
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "8px"
                          }}
                        />

                      ) : (

                        "🛍️"

                      )}

                    </div>


                    <strong>
                      {product.name}
                    </strong>

                  </div>

                </td>


                {/* CATEGORY */}

                <td>
                  {product.category}
                </td>


                {/* PRICE */}

                <td>
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </td>


                {/* STOCK */}

                <td>
                  {product.stock}
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
                      to={`/admin/products/edit/${product.id}`}
                    >
                      ✏️
                    </Link>


                    <button
                      type="button"
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


          {/* EMPTY */}

          {filteredProducts.length === 0 && (

            <tr>

              <td
                colSpan="6"
                style={{
                  textAlign: "center",
                  padding: "40px"
                }}
              >

                No products found.

              </td>

            </tr>

          )}

        </AdminTable>

      </section>

    </div>

  );
}