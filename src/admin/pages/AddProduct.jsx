import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PackagePlus,
  Tag,
  IndianRupee,
  Image as ImageIcon,
  FileText,
  X,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

import "./AddProduct.css";

export default function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Visiting Cards");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const [imageError, setImageError] = useState(false);
  const [success, setSuccess] = useState(false);

  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Please enter a valid product price.");
      return;
    }

    if (!image.trim()) {
      alert("Please enter product image URL.");
      return;
    }

    const priceNumber = Number(price);
    const oldPriceNumber = Number(oldPrice || price);

    const discount =
      oldPriceNumber > priceNumber
        ? `${Math.round(
            ((oldPriceNumber - priceNumber) /
              oldPriceNumber) *
              100
          )}% OFF`
        : "";

    const newProduct = {
      id: Date.now(),

      name: name.trim(),

      category,

      price: priceNumber,

      oldPrice: oldPriceNumber,

      discount,

      rating: 5,

      reviews: 0,

      badge: "NEW",

      image: image.trim(),

      images: [image.trim()],

      description:
        description.trim() ||
        "Premium quality product from Ananya Trading Company.",

      paperTypes: [
        "Matte",
        "Glossy",
        "Textured",
      ],

      sizes: [
        "Standard",
        "Premium",
      ],

      features: [
        "Premium Quality",
        "High Quality Printing",
        "Fast Delivery",
        "100% Quality Assured",
      ],
    };

    /* =====================================================
       GET EXISTING PRODUCTS
    ===================================================== */

    let existingProducts = [];

    try {
      existingProducts = JSON.parse(
        localStorage.getItem("ananyaProducts") || "[]"
      );

      if (!Array.isArray(existingProducts)) {
        existingProducts = [];
      }
    } catch (error) {
      console.error("Product storage error:", error);
      existingProducts = [];
    }

    /* =====================================================
       SAVE PRODUCT
    ===================================================== */

    const updatedProducts = [
      ...existingProducts,
      newProduct,
    ];

    localStorage.setItem(
      "ananyaProducts",
      JSON.stringify(updatedProducts)
    );

    /* =====================================================
       NOTIFY OTHER COMPONENTS
    ===================================================== */

    window.dispatchEvent(
      new Event("productsUpdated")
    );

    /* =====================================================
       SUCCESS MESSAGE
    ===================================================== */

    setSuccess(true);

    setTimeout(() => {
      navigate("/admin/products");
    }, 1000);
  };

  /* =====================================================
     RESET IMAGE
  ===================================================== */

  const removeImage = () => {
    setImage("");
    setImageError(false);
  };

  /* =====================================================
     PRICE FORMAT
  ===================================================== */

  const calculateDiscount = () => {
    if (
      !price ||
      !oldPrice ||
      Number(oldPrice) <= Number(price)
    ) {
      return null;
    }

    return Math.round(
      ((Number(oldPrice) - Number(price)) /
        Number(oldPrice)) *
        100
    );
  };

  const discount = calculateDiscount();

  return (
    <div className="add-product-page">

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div className="success-toast">
          <CheckCircle2 size={20} />

          <div>
            <strong>Product Added Successfully</strong>

            <span>
              Redirecting to products...
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="add-product-header">

        <div className="header-left">

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/admin/products")
            }
          >
            <ArrowLeft size={18} />
          </button>

          <div>

            <div className="header-label">
              <Sparkles size={15} />
              PRODUCT MANAGEMENT
            </div>

            <h1>
              Add New Product
            </h1>

            <p>
              Create and publish a new product
              to your Ananya Trading store.
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <form
        className="add-product-layout"
        onSubmit={handleSubmit}
      >

        {/* =====================================================
            LEFT FORM
        ===================================================== */}

        <div className="product-form-card">

          <div className="form-card-header">

            <div className="form-card-icon">
              <PackagePlus size={21} />
            </div>

            <div>
              <h2>
                Product Information
              </h2>

              <p>
                Enter the basic details of your product.
              </p>
            </div>

          </div>

          {/* =================================================
              PRODUCT NAME
          ================================================= */}

          <div className="form-group">

            <label>
              Product Name
              <span>*</span>
            </label>

            <div className="input-wrapper">

              <Tag size={18} />

              <input
                type="text"
                placeholder="Premium Visiting Card"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>

          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="form-group">

            <label>
              Category
              <span>*</span>
            </label>

            <div className="input-wrapper">

              <PackagePlus size={18} />

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >

                <option>
                  Visiting Cards
                </option>

                <option>
                  Business Cards
                </option>

                <option>
                  Premium Cards
                </option>

                <option>
                  Luxury Cards
                </option>

                <option>
                  Brochures
                </option>

                <option>
                  Flyers
                </option>

                <option>
                  Posters
                </option>

                <option>
                  Banners
                </option>

                <option>
                  Stickers
                </option>

                <option>
                  Packaging
                </option>

              </select>

            </div>

          </div>

          {/* =================================================
              PRICE
          ================================================= */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Selling Price
                <span>*</span>
              </label>

              <div className="input-wrapper">

                <IndianRupee size={18} />

                <input
                  type="number"
                  min="0"
                  placeholder="499"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="form-group">

              <label>
                Original Price
              </label>

              <div className="input-wrapper">

                <IndianRupee size={18} />

                <input
                  type="number"
                  min="0"
                  placeholder="699"
                  value={oldPrice}
                  onChange={(e) =>
                    setOldPrice(e.target.value)
                  }
                />

              </div>

            </div>

          </div>

          {/* =================================================
              DISCOUNT
          ================================================= */}

          {discount && (
            <div className="discount-preview">

              <div className="discount-icon">
                <Sparkles size={17} />
              </div>

              <div>

                <strong>
                  {discount}% OFF
                </strong>

                <span>
                  Customers will see this discount
                  on your product.
                </span>

              </div>

            </div>
          )}

          {/* =================================================
              IMAGE URL
          ================================================= */}

          <div className="form-group">

            <label>
              Product Image URL
              <span>*</span>
            </label>

            <div className="input-wrapper">

              <ImageIcon size={18} />

              <input
                type="url"
                placeholder="https://example.com/product.jpg"
                value={image}
                onChange={(e) => {
                  setImage(e.target.value);
                  setImageError(false);
                }}
              />

              {image && (
                <button
                  type="button"
                  className="clear-input"
                  onClick={removeImage}
                >
                  <X size={16} />
                </button>
              )}

            </div>

            <small className="field-help">
              Use a publicly accessible image URL.
            </small>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="form-group">

            <div className="label-row">

              <label>
                Product Description
              </label>

              <span className="character-count">
                {description.length}/500
              </span>

            </div>

            <div className="textarea-wrapper">

              <FileText size={18} />

              <textarea
                rows="6"
                maxLength="500"
                placeholder="Enter product description..."
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>

          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-btn"
              disabled={success}
            >
              <PackagePlus size={18} />

              {success
                ? "Product Added"
                : "Add Product"}
            </button>

          </div>

        </div>

        {/* =====================================================
            RIGHT PREVIEW
        ===================================================== */}

        <aside className="product-preview-card">

          <div className="preview-header">

            <div>

              <span>
                LIVE PREVIEW
              </span>

              <h2>
                Product Card
              </h2>

            </div>

            <div className="preview-status">
              <i />
              Preview
            </div>

          </div>

          {/* =================================================
              IMAGE
          ================================================= */}

          <div className="preview-image">

            {image && !imageError ? (
              <img
                src={image}
                alt="Product Preview"
                onError={() =>
                  setImageError(true)
                }
              />
            ) : (
              <div className="image-placeholder">

                <ImageIcon size={42} />

                <strong>
                  Product Image
                </strong>

                <span>
                  Add an image URL to preview
                </span>

              </div>
            )}

            {discount && (
              <span className="preview-discount">
                {discount}% OFF
              </span>
            )}

            <span className="preview-new">
              NEW
            </span>

          </div>

          {/* =================================================
              PREVIEW DETAILS
          ================================================= */}

          <div className="preview-details">

            <span className="preview-category">
              {category}
            </span>

            <h3>
              {name ||
                "Your Product Name"}
            </h3>

            <p>
              {description ||
                "Your product description will appear here."}
            </p>

            <div className="preview-rating">
              <span>
                ★★★★★
              </span>

              <small>
                5.0
              </small>
            </div>

            <div className="preview-price">

              <strong>
                ₹
                {Number(price || 0).toLocaleString(
                  "en-IN"
                )}
              </strong>

              {oldPrice &&
                Number(oldPrice) >
                  Number(price || 0) && (
                  <del>
                    ₹
                    {Number(
                      oldPrice
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </del>
                )}

            </div>

          </div>

          {/* =================================================
              PREVIEW INFO
          ================================================= */}

          <div className="preview-info">

            <div>
              <CheckCircle2 size={17} />
              Premium Quality
            </div>

            <div>
              <CheckCircle2 size={17} />
              Fast Delivery
            </div>

            <div>
              <CheckCircle2 size={17} />
              Quality Assured
            </div>

          </div>

        </aside>

      </form>

    </div>
  );
}