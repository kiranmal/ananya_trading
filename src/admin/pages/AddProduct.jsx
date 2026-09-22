import React, { useRef, useState } from "react";
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
  Upload,
  Trash2,
} from "lucide-react";

import "./AddProduct.css";

const categories = [
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

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(
    "Visiting Cards"
  );
  const [subcategory, setSubcategory] = useState(
    "Premium Business Cards"
  );

  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");

  const [image, setImage] = useState("");
  const [imageName, setImageName] = useState("");

  const [description, setDescription] = useState("");

  const [imageError, setImageError] = useState(false);
  const [success, setSuccess] = useState(false);

  /* =====================================================
     CURRENT CATEGORY ITEMS
  ===================================================== */

  const selectedCategory = categories.find(
    (item) => item.name === category
  );

  const subcategories =
    selectedCategory?.items || [];

  /* =====================================================
     CATEGORY CHANGE
  ===================================================== */

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCategory(value);

    const newCategory = categories.find(
      (item) => item.name === value
    );

    setSubcategory(
      newCategory?.items?.[0] || ""
    );
  };

  /* =====================================================
     IMAGE UPLOAD
  ===================================================== */

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
      setImageName(file.name);
      setImageError(false);
    };

    reader.onerror = () => {
      alert("Unable to read image.");
    };

    reader.readAsDataURL(file);
  };

  /* =====================================================
     REMOVE IMAGE
  ===================================================== */

  const removeImage = () => {
    setImage("");
    setImageName("");
    setImageError(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =====================================================
     DISCOUNT
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

    if (!image) {
      alert("Please upload a product image.");
      return;
    }

    const priceNumber = Number(price);

    const oldPriceNumber = Number(
      oldPrice || price
    );

    const productDiscount =
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

      subcategory,

      price: priceNumber,

      oldPrice: oldPriceNumber,

      discount: productDiscount,

      rating: 5,

      reviews: 0,

      badge: "NEW",

      image,

      images: [image],

      imageName,

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
        localStorage.getItem(
          "ananyaProducts"
        ) || "[]"
      );

      if (!Array.isArray(existingProducts)) {
        existingProducts = [];
      }
    } catch (error) {
      console.error(
        "Product storage error:",
        error
      );

      existingProducts = [];
    }

    /* =====================================================
       SAVE PRODUCT
    ===================================================== */

    const updatedProducts = [
      ...existingProducts,
      newProduct,
    ];

    try {
      localStorage.setItem(
        "ananyaProducts",
        JSON.stringify(updatedProducts)
      );
    } catch (error) {
      console.error(
        "Unable to save product:",
        error
      );

      alert(
        "Image is too large for browser storage. Please use a smaller image."
      );

      return;
    }

    /* =====================================================
       NOTIFY OTHER COMPONENTS
    ===================================================== */

    window.dispatchEvent(
      new Event("ananyaProductsUpdated")
    );

    // Backward compatibility
    window.dispatchEvent(
      new Event("productsUpdated")
    );

    /* =====================================================
       SUCCESS
    ===================================================== */

    setSuccess(true);

    setTimeout(() => {
      navigate("/admin/products");
    }, 1000);
  };

  return (
    <div className="add-product-page">

      {/* SUCCESS */}

      {success && (
        <div className="success-toast">
          <CheckCircle2 size={20} />

          <div>
            <strong>
              Product Added Successfully
            </strong>

            <span>
              Redirecting to products...
            </span>
          </div>
        </div>
      )}

      {/* HEADER */}

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

            <h1>Add New Product</h1>

            <p>
              Create and publish a new product
              to your Ananya Trading store.
            </p>
          </div>

        </div>
      </div>

      {/* MAIN */}

      <form
        className="add-product-layout"
        onSubmit={handleSubmit}
      >

        {/* LEFT */}

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

          {/* PRODUCT NAME */}

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

          {/* CATEGORY */}

          <div className="form-row">

            <div className="form-group">
              <label>
                Category
                <span>*</span>
              </label>

              <div className="input-wrapper">
                <PackagePlus size={18} />

                <select
                  value={category}
                  onChange={
                    handleCategoryChange
                  }
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={item.name}
                        value={item.name}
                      >
                        {item.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* SUBCATEGORY */}

            <div className="form-group">
              <label>
                Product Type
                <span>*</span>
              </label>

              <div className="input-wrapper">
                <Tag size={18} />

                <select
                  value={subcategory}
                  onChange={(e) =>
                    setSubcategory(
                      e.target.value
                    )
                  }
                >
                  {subcategories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

          </div>

          {/* PRICE */}

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
                    setOldPrice(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>

          </div>

          {/* DISCOUNT */}

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

          {/* IMAGE UPLOAD */}

          <div className="form-group">

            <label>
              Product Image
              <span>*</span>
            </label>

            <div
              className={`image-upload-box ${
                image
                  ? "has-image"
                  : ""
              }`}
            >

              {image &&
              !imageError ? (
                <div className="uploaded-image-preview">

                  <img
                    src={image}
                    alt="Product Preview"
                    onError={() =>
                      setImageError(
                        true
                      )
                    }
                  />

                  <div className="image-overlay">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current?.click()
                      }
                    >
                      <Upload
                        size={16}
                      />
                      Change Image
                    </button>

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={
                        removeImage
                      }
                    >
                      <Trash2
                        size={16}
                      />
                      Remove
                    </button>
                  </div>

                </div>
              ) : (
                <button
                  type="button"
                  className="image-upload-trigger"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <div className="upload-icon">
                    <Upload size={28} />
                  </div>

                  <strong>
                    Upload Product Image
                  </strong>

                  <span>
                    Click to browse from your computer
                  </span>

                  <small>
                    JPG, JPEG, PNG, WEBP • Max 5MB
                  </small>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={
                  handleImageUpload
                }
                hidden
              />

            </div>

            {imageName && (
              <div className="selected-image-info">
                <ImageIcon size={15} />

                <span>
                  {imageName}
                </span>

                <button
                  type="button"
                  onClick={
                    removeImage
                  }
                >
                  <X size={15} />
                </button>
              </div>
            )}

            <small className="field-help">
              Upload a clear, high-quality product image.
            </small>

          </div>

          {/* DESCRIPTION */}

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
                  setDescription(
                    e.target.value
                  )
                }
              />
            </div>

          </div>

          {/* ACTIONS */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate(
                  "/admin/products"
                )
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

        {/* RIGHT PREVIEW */}

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

          {/* BEAUTIFUL PRODUCT IMAGE */}

          <div className="preview-image">

            {image &&
            !imageError ? (
              <div className="preview-image-inner">

                <img
                  src={image}
                  alt={
                    name ||
                    "Product Preview"
                  }
                />

                <div className="preview-image-shine" />

              </div>
            ) : (
              <div className="image-placeholder">

                <div className="placeholder-icon">
                  <ImageIcon size={42} />
                </div>

                <strong>
                  Product Image
                </strong>

                <span>
                  Upload an image to see
                  your product here
                </span>

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  <Upload size={15} />
                  Upload Image
                </button>

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

          {/* DETAILS */}

          <div className="preview-details">

            <span className="preview-category">
              {subcategory ||
                category}
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
                {Number(
                  price || 0
                ).toLocaleString(
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

          {/* INFO */}

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
