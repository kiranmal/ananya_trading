
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  Save,
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

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const fileInputRef = useRef(null);

  const [productLoaded, setProductLoaded] = useState(false);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Visiting Cards");
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

  const [errorMessage, setErrorMessage] = useState("");

  /* =====================================================
     LOAD PRODUCT
  ===================================================== */

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem("ananyaProducts");

      const products = savedProducts
        ? JSON.parse(savedProducts)
        : [];

      if (!Array.isArray(products)) {
        setErrorMessage("Products data is invalid.");
        return;
      }

      /*
        URL id string hota hai,
        localStorage me id number ho sakti hai.
        Isliye String comparison use kar rahe hain.
      */

      const product = products.find(
        (item) => String(item.id) === String(id)
      );

      if (!product) {
        setErrorMessage("Product not found.");
        return;
      }

      setName(product.name || "");

      setCategory(
        product.category || "Visiting Cards"
      );

      /*
        Product ki category ke andar subcategory
        available hai ya nahi check karenge.
      */

      const productCategory =
        categories.find(
          (item) =>
            item.name === product.category
        );

      const availableSubcategories =
        productCategory?.items || [];

      setSubcategory(
        availableSubcategories.includes(
          product.subcategory
        )
          ? product.subcategory
          : availableSubcategories[0] || ""
      );

      setPrice(
        product.price !== undefined &&
        product.price !== null
          ? String(product.price)
          : ""
      );

      setOldPrice(
        product.oldPrice !== undefined &&
        product.oldPrice !== null
          ? String(product.oldPrice)
          : ""
      );

      setImage(
        product.image ||
          product.images?.[0] ||
          ""
      );

      setImageName(
        product.imageName || ""
      );

      setDescription(
        product.description || ""
      );

      setProductLoaded(true);
    } catch (error) {
      console.error(
        "Edit product loading error:",
        error
      );

      setErrorMessage(
        "Unable to load product."
      );
    }
  }, [id]);

  /* =====================================================
     CURRENT CATEGORY
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
      alert(
        "Please select a valid image file."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Image size should be less than 5MB."
      );
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
     UPDATE PRODUCT
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert(
        "Please enter a valid product price."
      );
      return;
    }

    if (!image) {
      alert("Please upload a product image.");
      return;
    }

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

      alert(
        "Unable to read product data."
      );

      return;
    }

    /*
      Existing product find karo.
    */

    const productIndex =
      existingProducts.findIndex(
        (item) =>
          String(item.id) === String(id)
      );

    if (productIndex === -1) {
      alert(
        "Product not found. It may have been deleted."
      );
      return;
    }

    const existingProduct =
      existingProducts[productIndex];

    const priceNumber = Number(price);

    const oldPriceNumber = Number(
      oldPrice || price
    );

    const productDiscount =
      oldPriceNumber > priceNumber
        ? `${Math.round(
            ((oldPriceNumber -
              priceNumber) /
              oldPriceNumber) *
              100
          )}% OFF`
        : "";

    /*
      IMPORTANT:
      Existing product ke extra fields
      preserve kar rahe hain.

      Example:
      rating
      reviews
      badge
      paperTypes
      sizes
      features
      custom fields
      etc.
    */

    const updatedProduct = {
      ...existingProduct,

      /*
        Same ID preserve rahegi.
        Isse duplicate product create nahi hoga.
      */

      id: existingProduct.id,

      name: name.trim(),

      category,

      subcategory,

      price: priceNumber,

      oldPrice: oldPriceNumber,

      discount: productDiscount,

      image,

      images: [image],

      imageName,

      description:
        description.trim() ||
        "Premium quality product from Ananya Trading Company.",

      /*
        Existing values preserve.
        Agar old product me nahi hain,
        to default values use honge.
      */

      rating:
        existingProduct.rating ?? 5,

      reviews:
        existingProduct.reviews ?? 0,

      badge:
        existingProduct.badge || "NEW",

      paperTypes:
        Array.isArray(
          existingProduct.paperTypes
        )
          ? existingProduct.paperTypes
          : [
              "Matte",
              "Glossy",
              "Textured",
            ],

      sizes:
        Array.isArray(
          existingProduct.sizes
        )
          ? existingProduct.sizes
          : [
              "Standard",
              "Premium",
            ],

      features:
        Array.isArray(
          existingProduct.features
        )
          ? existingProduct.features
          : [
              "Premium Quality",
              "High Quality Printing",
              "Fast Delivery",
              "100% Quality Assured",
            ],

      updatedAt:
        new Date().toISOString(),
    };

    /*
      ONLY current product replace hoga.
    */

    const updatedProducts = [
      ...existingProducts,
    ];

    updatedProducts[productIndex] =
      updatedProduct;

    try {
      localStorage.setItem(
        "ananyaProducts",
        JSON.stringify(
          updatedProducts
        )
      );
    } catch (error) {
      console.error(
        "Unable to update product:",
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
      new Event(
        "ananyaProductsUpdated"
      )
    );

    window.dispatchEvent(
      new Event(
        "productsUpdated"
      )
    );

    /*
      Optional custom event
      admin product page ke liye useful.
    */

    window.dispatchEvent(
      new CustomEvent(
        "ananyaProductUpdated",
        {
          detail: updatedProduct,
        }
      )
    );

    /* =====================================================
       SUCCESS
    ===================================================== */

    setSuccess(true);

    setTimeout(() => {
      navigate("/admin/products");
    }, 1000);
  };

  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (errorMessage) {
    return (
      <div className="add-product-page">
        <div
          className="product-form-card"
          style={{
            maxWidth: "650px",
            margin: "80px auto",
            textAlign: "center",
            padding: "50px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fef2f2",
              color: "#dc2626",
            }}
          >
            <X size={35} />
          </div>

          <h2>
            {errorMessage}
          </h2>

          <p>
            The product you are trying to
            edit could not be found.
          </p>

          <button
            type="button"
            className="submit-btn"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            style={{
              marginTop: "20px",
            }}
          >
            <ArrowLeft size={18} />
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  /*
    Product load hone tak blank/loading screen.
  */

  if (!productLoaded) {
    return (
      <div className="add-product-page">
        <div
          style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          Loading product...
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page">

      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="success-toast">
          <CheckCircle2 size={20} />

          <div>
            <strong>
              Product Updated Successfully
            </strong>

            <span>
              Redirecting to products...
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="add-product-header">
        <div className="header-left">

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate(
                "/admin/products"
              )
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
              Edit Product
            </h1>

            <p>
              Update product details,
              pricing and image.
            </p>
          </div>

        </div>
      </div>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <form
        className="add-product-layout"
        onSubmit={handleSubmit}
      >

        {/* ===================================================
            LEFT FORM
        =================================================== */}

        <div className="product-form-card">

          <div className="form-card-header">
            <div className="form-card-icon">
              <Save size={21} />
            </div>

            <div>
              <h2>
                Edit Product Information
              </h2>

              <p>
                Make changes to your product
                and save them.
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
                    setPrice(
                      e.target.value
                    )
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
                  Customers will see this
                  discount on your product.
                </span>
              </div>

            </div>
          )}

          {/* IMAGE */}

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
                      <Upload size={16} />
                      Change Image
                    </button>

                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={
                        removeImage
                      }
                    >
                      <Trash2 size={16} />
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
                    Click to browse from your
                    computer
                  </span>

                  <small>
                    JPG, JPEG, PNG, WEBP •
                    Max 5MB
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
              Upload a clear,
              high-quality product image.
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
              <Save size={18} />

              {success
                ? "Product Updated"
                : "Update Product"}
            </button>

          </div>

        </div>

        {/* ===================================================
            RIGHT PREVIEW
        =================================================== */}

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
              Editing
            </div>

          </div>

          {/* IMAGE */}

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
              {productLoaded
                ? "EDIT"
                : "NEW"}
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
