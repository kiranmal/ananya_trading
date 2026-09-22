import { useEffect, useRef, useState } from "react";
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
import defaultCategories from "../../data/categories";
import { fetchCategories } from "../../services/categoryApi";
import { createProduct } from "../../services/productApi";

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState(
    defaultCategories
  );

  useEffect(() => {
    const load = async () => {
      const list = await fetchCategories();
      setCategories(list);

      const first = list[0];
      if (first) {
        setCategory(first.name);
        setSubcategory(first.items?.[0] || "");
      }
    };
    load();
  }, []);

  const [name, setName] = useState("");
  const [category, setCategory] = useState(
    defaultCategories[0]?.name || ""
  );
  const [subcategory, setSubcategory] = useState(
    defaultCategories[0]?.items?.[0] || ""
  );

  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [quantityStep, setQuantityStep] =
    useState("1");

  const [images, setImages] = useState([]);

  const [description, setDescription] = useState("");

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
     IMAGE UPLOAD (MULTIPLE)
  ===================================================== */

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const maxImages = 6;
    const remaining = maxImages - images.length;
    if (remaining <= 0) {
      alert(`Maximum ${maxImages} images allowed.`);
      return;
    }

    const filesToProcess = files.slice(0, remaining);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}: Image size should be less than 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [
          ...prev,
          { dataUrl: reader.result, name: file.name },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* =====================================================
     REMOVE IMAGE
  ===================================================== */

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (!price || Number(price) <= 0) {
      alert("Please enter a valid product price.");
      return;
    }

    if (images.length === 0) {
      alert("Please upload at least one product image.");
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

    const imageUrls = images.map((img) => img.dataUrl);

    const newProduct = {
      id: Date.now(),

      name: name.trim(),

      category,

      subcategory,

      price: priceNumber,

      oldPrice: oldPriceNumber,

      quantityStep: Math.max(
        1,
        Math.floor(Number(quantityStep)) || 1
      ),

      discount: productDiscount,

      rating: 5,

      reviews: 0,

      badge: "NEW",

      image: imageUrls[0],

      images: imageUrls,

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

    try {
      await createProduct(newProduct);
    } catch (error) {
      console.error(
        "Unable to save product:",
        error
      );

      alert(error.message);
      return;
    }

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

            <div className="form-group">
              <label>
                Quantity Step
                <span>*</span>
              </label>

              <div className="input-wrapper">
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  value={quantityStep}
                  onChange={(e) =>
                    setQuantityStep(
                      e.target.value
                    )
                  }
                />
              </div>

              <small
                style={{
                  color: "#6b7280",
                  fontSize: "12px",
                }}
              >
                Min order + step. e.g. 100 for
                business cards, 1 for normal
                products.
              </small>
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
              Product Images
              <span>*</span>
              <small style={{ fontWeight: 400, color: "#6b7280", marginLeft: "8px" }}>
                ({images.length}/6)
              </small>
            </label>

            {/* Image Previews */}

            {images.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                {images.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: index === 0 ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                      aspectRatio: "1",
                    }}
                  >
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    {index === 0 && (
                      <span
                        style={{
                          position: "absolute",
                          top: "4px",
                          left: "4px",
                          background: "#3b82f6",
                          color: "#fff",
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        MAIN
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "22px",
                        height: "22px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <X size={12} />
                    </button>
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        fontSize: "9px",
                        padding: "3px 6px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {img.name}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}

            {images.length < 6 && (
              <div className="image-upload-box">
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
                    {images.length === 0
                      ? "Upload Product Images"
                      : "Add More Images"}
                  </strong>

                  <span>
                    Click to browse — up to {6 - images.length} more
                  </span>

                  <small>
                    JPG, JPEG, PNG, WEBP • Max 5MB each
                  </small>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/jpg"
              multiple
              onChange={handleImageUpload}
              hidden
            />

            <small className="field-help">
              Upload up to 6 product images. First image is the main image.
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

            {images.length > 0 ? (
              <div className="preview-image-inner">

                <img
                  src={images[0].dataUrl}
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
