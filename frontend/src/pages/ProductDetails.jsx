import React, { useEffect, useRef, useState } from "react";
import { API_URL } from "../services/apiConfig";

import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  Star,
  Heart,
  Truck,
  ShieldCheck,
  CreditCard,
  Plus,
  Minus,
  Upload,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

import {
  getProductById,
} from "../data/productStorage";
import { fetchProductById } from "../services/productApi";
import { saveInquiryContext } from "../services/inquiryApi";

import "../styles/ProductDetails.css";


function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const designInputRef = useRef(null);

  /* =====================================================
     GET PRODUCT
  ===================================================== */

  const [product, setProduct] = useState(
    () => getProductById(id)
  );

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setProduct(await fetchProductById(id));
      } catch (error) {
        console.error("Product loading error:", error);
      }
    };

    loadProduct();
  }, [id]);


  /* =====================================================
     SAFE PRODUCT DATA
  ===================================================== */

  const images =
    product?.images?.length
      ? product.images
      : product?.image
        ? [product.image]
        : [
            "https://via.placeholder.com/600x600?text=Product",
          ];


  const paperTypes =
    product?.paperTypes?.length
      ? product.paperTypes
      : ["Standard"];


  const sizes =
    product?.sizes?.length
      ? product.sizes
      : ["Standard"];


  const features =
    product?.features?.length
      ? product.features
      : [
          "Premium Quality",
          "High Quality Material",
          "Fast Delivery",
        ];


  /* =====================================================
     STATES
  ===================================================== */

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  /* Admin-set quantity step / min order */
  const quantityStep = Math.max(
    1,
    Number(product?.quantityStep) || 1
  );

  /* Product load hone pe start qty = step */
  useEffect(() => {
    setQuantity(quantityStep);
  }, [quantityStep, id]);

  const [paper, setPaper] =
    useState(paperTypes[0]);

  const [size, setSize] =
    useState(sizes[0]);

  const [isFavorite, setIsFavorite] =
    useState(false);

  const [uploadedDesign, setUploadedDesign] =
    useState(null);


  /* =====================================================
     CUSTOMER REVIEW STATES
  ===================================================== */

  const [customerReviews, setCustomerReviews] =
    useState([]);

  const [reviewName, setReviewName] =
    useState("");

  const [reviewRating, setReviewRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  /* =====================================================
     INFO TABS
  ===================================================== */

  const [activeTab, setActiveTab] =
    useState("details");


  /* =====================================================
     LOAD CUSTOMER REVIEWS
  ===================================================== */

  const loadCustomerReviews = () => {

    if (!product) return;

    try {

      const savedReviews =
        localStorage.getItem(
          "ananyaProductReviews"
        );

      const allReviews =
        savedReviews
          ? JSON.parse(savedReviews)
          : {};

      const productReviews =
        allReviews[String(product.id)] || [];

      setCustomerReviews(
        Array.isArray(productReviews)
          ? productReviews
          : []
      );

    } catch (error) {

      console.error(
        "Review loading error:",
        error
      );

      setCustomerReviews([]);

    }

  };


  /* =====================================================
     LOAD REVIEWS
  ===================================================== */

  useEffect(() => {

    loadCustomerReviews();

  }, [product?.id]);


  /* =====================================================
     CHECK FAVORITE
  ===================================================== */

  useEffect(() => {

    if (!product) return;

    try {

      const savedFavorites =
        JSON.parse(
          localStorage.getItem(
            "ananyaFavorites"
          ) || "[]"
        );

      const exists =
        savedFavorites.some(
          (item) =>
            String(item.id) ===
            String(product.id)
        );

      setIsFavorite(exists);

    } catch (error) {

      console.error(
        "Favorite loading error:",
        error
      );

      setIsFavorite(false);

    }

  }, [product?.id]);


  /* =====================================================
     PRODUCT NOT FOUND
  ===================================================== */

  if (!product) {

    return (

      <div className="not-found">

        <h1>
          Product Not Found
        </h1>

        <p>
          This product does not exist
          or has been removed.
        </p>

        <Link to="/category">
          Back to Products
        </Link>

      </div>

    );

  }


  /* =====================================================
     PRICE
  ===================================================== */

  const price =
    Number(product.price) || 0;


  const oldPrice =
    Number(product.oldPrice) || 0;


  /* =====================================================
     REVIEW COUNT
  ===================================================== */

  const originalReviewCount =
    Number(product.reviews) || 0;

  const totalReviewCount =
    originalReviewCount +
    customerReviews.length;


  /* =====================================================
     INCREASE QUANTITY
  ===================================================== */

  const increaseQuantity = () => {

    setQuantity(
      (previousQuantity) =>
        previousQuantity + quantityStep
    );

  };


  /* =====================================================
     DECREASE QUANTITY
  ===================================================== */

  const decreaseQuantity = () => {

    setQuantity(
      (previousQuantity) =>
        Math.max(
          quantityStep,
          previousQuantity - quantityStep
        )
    );

  };


  /* =====================================================
     TOGGLE FAVORITE
  ===================================================== */

  const toggleFavorite = () => {

    try {

      const savedFavorites =
        JSON.parse(
          localStorage.getItem(
            "ananyaFavorites"
          ) || "[]"
        );


      const alreadyFavorite =
        savedFavorites.some(
          (item) =>
            String(item.id) ===
            String(product.id)
        );


      let updatedFavorites;


      /* ================= REMOVE ================= */

      if (alreadyFavorite) {

        updatedFavorites =
          savedFavorites.filter(
            (item) =>
              String(item.id) !==
              String(product.id)
          );

        setIsFavorite(false);

        alert(
          `${product.name} removed from favorites.`
        );

      }


      /* ================= ADD ================= */

      else {

        const favoriteProduct = {

          ...product,

          id: product.id,

          name:
            product.name ||
            "Untitled Product",

          category:
            product.category ||
            "General",

          images:
            images,

          price:
            price,

          oldPrice:
            oldPrice,

          rating:
            Number(product.rating) || 4.8,

          reviews:
            Number(product.reviews) || 0,

          badge:
            product.badge || "NEW",

          description:
            product.description ||
            "Premium quality customized product made for your brand and business.",

        };


        updatedFavorites = [

          ...savedFavorites,

          favoriteProduct,

        ];


        setIsFavorite(true);

        alert(
          `${product.name} added to favorites!`
        );

      }


      /* ================= SAVE ================= */

      localStorage.setItem(
        "ananyaFavorites",
        JSON.stringify(
          updatedFavorites
        )
      );


      /* ================= EVENT ================= */

      window.dispatchEvent(
        new Event(
          "ananyaFavoritesUpdated"
        )
      );


    } catch (error) {

      console.error(
        "Favorite error:",
        error
      );

    }

  };


  /* =====================================================
     UPLOAD
  ===================================================== */

  const handleUpload = () => {
    designInputRef.current?.click();
  };

  const handleUploadedDesign = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowed.includes(file.type) || file.size > 750 * 1024) {
      alert("Upload a PNG, JPG/JPEG, or PDF design up to 750 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setUploadedDesign({
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl: reader.result,
    });
    reader.readAsDataURL(file);
  };


  /* =====================================================
     CUSTOMIZE — sirf customizable products pe
  ===================================================== */

  const isCustomizableProduct = Boolean(
    product?.customizable ||
      product?.isCustomizable ||
      product?.customizationType ||
      product?.type
  );

  const handleCustomize = () => {
    const selectedProduct = {
      ...product,
      image: images[0],
      paperType: paper,
      size,
      quantity,
    };

    localStorage.setItem(
      "selectedCustomizeProduct",
      JSON.stringify(selectedProduct)
    );

    navigate("/customize");
  };


  /* =====================================================
     ADD TO CART
  ===================================================== */

  const handleAddToCart = () => {

    try {

      const cartItem = {

        productId:
          product.id,

        name:
          product.name,

        price:
          price,

        quantity:
          quantity,

        quantityStep:
          quantityStep,

        paperType:
          paper,

        size:
          size,

        image:
          images[0],

        category:
          product.category ||
          "General",

        description:
          product.description ||
          "",

        uploadedDesign,

        hasUploadedDesign:
          Boolean(uploadedDesign),

        isCustomized:
          Boolean(uploadedDesign),

      };


      const existingCart =
        JSON.parse(
          localStorage.getItem(
            "ananyaCart"
          ) || "[]"
        );


      /* =================================================
         CHECK SAME PRODUCT
      ================================================= */

      const existingIndex =
        existingCart.findIndex(
          (item) =>
            String(item.productId) ===
              String(product.id) &&
            item.paperType ===
              paper &&
            item.size ===
              size
        );


      /* =================================================
         PRODUCT ALREADY IN CART
      ================================================= */

      if (existingIndex !== -1) {

        existingCart[
          existingIndex
        ] = {

          ...existingCart[
            existingIndex
          ],

          quantity:
            Number(
              existingCart[
                existingIndex
              ].quantity
            ) + quantity,

        };

      }


      /* =================================================
         NEW PRODUCT
      ================================================= */

      else {

        existingCart.push(
          cartItem
        );

      }


      /* =================================================
         SAVE CART
      ================================================= */

      localStorage.setItem(
        "ananyaCart",
        JSON.stringify(
          existingCart
        )
      );


      /* =================================================
         CART UPDATE EVENTS
      ================================================= */

      window.dispatchEvent(
        new Event(
          "ananyaCartUpdated"
        )
      );

      window.dispatchEvent(
        new Event(
          "cartUpdated"
        )
      );


      alert(
        `${product.name} added to cart!`
      );


    } catch (error) {

      console.error(
        "Cart error:",
        error
      );

      alert(
        "Unable to add product to cart."
      );

    }

  };


  /* =====================================================
     SUBMIT CUSTOMER REVIEW
  ===================================================== */

  const handleReviewSubmit = async (e) => {

    e.preventDefault();


    /* ================= VALIDATION ================= */

    const name =
      reviewName.trim();

    const message =
      reviewText.trim();


    if (!name) {

      alert(
        "Please enter your name."
      );

      return;

    }


    if (!message) {

      alert(
        "Please write your review."
      );

      return;

    }


    if (message.length < 5) {

      alert(
        "Review should contain at least 5 characters."
      );

      return;

    }


    /* =================================================
       CREATE REVIEW
    ================================================= */

    const newReview = {

      id:
        Date.now(),

      productId:
        product.id,

      name:
        name,

      rating:
        Number(reviewRating),

      comment:
        message,

      date:
        new Date().toLocaleDateString(
          "en-IN",
          {
            day: "numeric",
            month: "short",
            year: "numeric",
          }
        ),

    };


    try {

      const savedReviews =
        localStorage.getItem(
          "ananyaProductReviews"
        );


      const allReviews =
        savedReviews
          ? JSON.parse(savedReviews)
          : {};


      const currentProductReviews =
        Array.isArray(
          allReviews[String(product.id)]
        )
          ? allReviews[String(product.id)]
          : [];


      const updatedProductReviews = [

        newReview,

        ...currentProductReviews,

      ];


      allReviews[String(product.id)] =
        updatedProductReviews;


      /* =================================================
         SAVE
      ================================================= */

      localStorage.setItem(
        "ananyaProductReviews",
        JSON.stringify(
          allReviews
        )
      );


      /* =================================================
         SAVE TO BACKEND
      ================================================= */

      try {
        await fetch(
          `${API_URL}/feedback`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              name: name,
              message: message,
              type: "review",
              product_id: product.id,
              rating:
                Number(reviewRating),
              subject:
                product.name,
            }),
          }
        );
      } catch {
        // Backend save is optional
      }


      /* =================================================
         UPDATE SCREEN
      ================================================= */

      setCustomerReviews(
        updatedProductReviews
      );


      /* =================================================
         RESET FORM
      ================================================= */

      setReviewName("");

      setReviewRating(5);

      setReviewText("");


      alert(
        "Thank you! Your review has been posted."
      );


      /* =================================================
         SCROLL TO REVIEWS
      ================================================= */

      setTimeout(() => {

        document
          .getElementById(
            "customer-reviews"
          )
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

      }, 100);


    } catch (error) {

      console.error(
        "Review save error:",
        error
      );

      alert(
        "Unable to post your review."
      );

    }

  };


  /* =====================================================
     DELETE REVIEW
     Optional local review delete
  ===================================================== */

  const deleteReview = (reviewId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this review?"
      );


    if (!confirmDelete) return;


    try {

      const savedReviews =
        localStorage.getItem(
          "ananyaProductReviews"
        );


      const allReviews =
        savedReviews
          ? JSON.parse(savedReviews)
          : {};


      const updatedReviews =
        customerReviews.filter(
          (review) =>
            review.id !== reviewId
        );


      allReviews[String(product.id)] =
        updatedReviews;


      localStorage.setItem(
        "ananyaProductReviews",
        JSON.stringify(
          allReviews
        )
      );


      setCustomerReviews(
        updatedReviews
      );


    } catch (error) {

      console.error(
        "Delete review error:",
        error
      );

    }

  };


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <div className="product-details-page">


      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="details-container breadcrumb-details">

        <Link to="/">
          Home
        </Link>

        <ChevronRight size={15} />

        <Link to="/category">
          {product.category || "Products"}
        </Link>

        <ChevronRight size={15} />

        <span>
          {product.name}
        </span>

      </div>


      {/* =================================================
          PRODUCT MAIN
      ================================================= */}

      <section
        className="details-container product-main"
      >


        {/* =================================================
            IMAGE AREA
        ================================================= */}

        <div className="product-gallery">


          {/* MAIN IMAGE */}

          <div className="main-product-image">

            <img
              src={
                images[selectedImage] ||
                images[0]
              }
              alt={
                product.name
              }
            />


            {/* FAVORITE BUTTON */}

            <button
              className={
                isFavorite
                  ? "image-heart active"
                  : "image-heart"
              }
              type="button"
              onClick={
                toggleFavorite
              }
              aria-label={
                isFavorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              title={
                isFavorite
                  ? "Remove from Favorites"
                  : "Add to Favorites"
              }
            >

              <Heart
                size={20}
                fill={
                  isFavorite
                    ? "currentColor"
                    : "none"
                }
              />

            </button>

          </div>


          {/* THUMBNAILS */}

          <div className="thumbnail-row">

            {images.map(
              (image, index) => (

                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={
                    selectedImage === index
                      ? "thumbnail active"
                      : "thumbnail"
                  }
                  onClick={() =>
                    setSelectedImage(
                      index
                    )
                  }
                >

                  <img
                    src={image}
                    alt={
                      `${product.name} ${index + 1}`
                    }
                  />

                </button>

              )
            )}

          </div>

        </div>


        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}

        <div className="product-info">


          {/* BADGE */}

          <span className="details-badge">

            {product.badge || "NEW"}

          </span>


          {/* NAME */}

          <h1>
            {product.name}
          </h1>


          {/* RATING */}

          <div className="details-rating">

            <span className="stars">

              <Star
                size={17}
                fill="currentColor"
              />

              {product.rating || "4.8"}

            </span>


            <span>

              (
              {totalReviewCount}
              Reviews)

            </span>

          </div>


          {/* DESCRIPTION */}

          <p className="details-description">

            {product.description ||
              "Premium quality customized product designed for your brand and business."}

          </p>


          {/* PRICE */}

          <div className="details-price">

            <strong>

              ₹
              {price.toLocaleString(
                "en-IN"
              )}

            </strong>


            {oldPrice > price && (

              <del>

                ₹
                {oldPrice.toLocaleString(
                  "en-IN"
                )}

              </del>

            )}


            {product.discount && (

              <span>

                {product.discount}

              </span>

            )}

          </div>


          <small className="tax-text">

            Inclusive of all taxes

          </small>


          {/* =================================================
              TRUST
          ================================================= */}

          <div className="product-trust">


            <div>

              <Truck />

              <strong>
                Fast Delivery
              </strong>

              <span>
                3–5 business days
              </span>

            </div>


            <div>

              <ShieldCheck />

              <strong>
                Premium Quality
              </strong>

              <span>
                100% quality assured
              </span>

            </div>


            <div>

              <CreditCard />

              <strong>
                Secure Payment
              </strong>

              <span>
                Safe checkout
              </span>

            </div>


          </div>


          {/* =================================================
              PAPER TYPE
          ================================================= */}

          <div className="option-section">

            <h3>
              Paper Type
            </h3>


            <div className="options">

              {paperTypes.map(
                (type) => (

                  <button
                    key={type}
                    type="button"
                    className={
                      paper === type
                        ? "option active"
                        : "option"
                    }
                    onClick={() =>
                      setPaper(type)
                    }
                  >

                    {type}

                  </button>

                )
              )}

            </div>

          </div>


          {/* =================================================
              SIZE
          ================================================= */}

          <div className="option-section">

            <h3>
              Size
            </h3>


            <div className="options">

              {sizes.map(
                (item) => (

                  <button
                    key={item}
                    type="button"
                    className={
                      size === item
                        ? "option active"
                        : "option"
                    }
                    onClick={() =>
                      setSize(item)
                    }
                  >

                    {item}

                  </button>

                )
              )}

            </div>

          </div>


          {/* =================================================
              QUANTITY
          ================================================= */}

          <div className="option-section">

            <h3>
              Quantity
            </h3>


            <div className="quantity">

              <button
                type="button"
                onClick={
                  decreaseQuantity
                }
                disabled={
                  quantity <= quantityStep
                }
                aria-label="Decrease quantity"
              >

                <Minus size={16} />

              </button>


              <span>

                {quantity} Cards

              </span>


              <button
                type="button"
                onClick={
                  increaseQuantity
                }
                aria-label="Increase quantity"
              >

                <Plus size={16} />

              </button>

            </div>

          </div>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="product-actions">


            {isCustomizableProduct && (
              <button
                type="button"
                className="customize-btn"
                onClick={
                  handleCustomize
                }
              >

                Customize Now

              </button>
            )}


            <button
              type="button"
              className="upload-btn"
              onClick={
                handleUpload
              }
            >

              <Upload size={17} />

              Upload Design

            </button>

            <input
              ref={designInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,image/png,image/jpeg,application/pdf"
              onChange={handleUploadedDesign}
              hidden
            />


            <button
              type="button"
              className="cart-btn"
              onClick={
                handleAddToCart
              }
            >

              <ShoppingCart size={17} />

              Add to Cart

            </button>

          </div>

          {uploadedDesign && (
            <div className="uploaded-design-summary">
              <Upload size={17} />
              <div>
                <strong>{uploadedDesign.name}</strong>
                <span>Ready-made design attached</span>
              </div>
              <button type="button" onClick={handleUpload}>Replace</button>
              <button type="button" onClick={() => setUploadedDesign(null)}>Remove</button>
            </div>
          )}


          {/* =================================================
              BULK MESSAGE
          ================================================= */}

          <div
            className="bulk-message"
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            onClick={() => {
              saveInquiryContext({
                productId: product.id,
                productName: product.name,
                size,
                quantity,
                source: "product-detail",
              });

              navigate("/#contact-inquiry");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                saveInquiryContext({
                  productId: product.id,
                  productName: product.name,
                  size,
                  quantity,
                  source: "product-detail",
                });

                navigate("/#contact-inquiry");
              }
            }}
          >

            💼 Bulk orders get additional discounts.
            Contact us for custom pricing →

          </div>

        </div>

      </section>


      {/* =================================================
          PRODUCT INFORMATION
      ================================================= */}

      <section
        className="details-container information-section"
      >


        {/* TABS */}

        <div className="information-tabs">

          <button
            type="button"
            className={
              activeTab === "details"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("details")
            }
          >

            Product Details

          </button>


          <button
            type="button"
            className={
              activeTab === "specs"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("specs")
            }
          >

            Specifications

          </button>


          <button
            type="button"
            className={
              activeTab === "guidelines"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("guidelines")
            }
          >

            Design Guidelines

          </button>


          <button
            type="button"
            className={
              activeTab === "reviews"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("reviews")
            }
          >

            Reviews (
            {totalReviewCount}
            )

          </button>

        </div>


        {/* CONTENT */}

        <div className="information-content">


          {activeTab === "details" && (
            <>

          <div>

            <h2>

              {product.name}

            </h2>


            <p>

              {product.description ||
                "Designed for businesses that want premium quality, professional finishing and unforgettable brand presentation."}

            </p>


            <h3>
              Features
            </h3>


            <ul>

              {features.map(
                (feature, index) => (

                  <li
                    key={`${feature}-${index}`}
                  >

                    <span>
                      ✓
                    </span>

                    {feature}

                  </li>

                )
              )}

            </ul>

          </div>


          <img
            src={
              images[1] ||
              images[0]
            }
            alt={
              product.name
            }
          />

            </>
          )}


          {/* SPECIFICATIONS */}

          {activeTab === "specs" && (
            <div className="spec-tab-content">

              <h2>
                Specifications
              </h2>

              <table className="spec-table">
                <tbody>

                  <tr>
                    <td>Product Name</td>
                    <td>{product.name}</td>
                  </tr>

                  <tr>
                    <td>Category</td>
                    <td>
                      {product.category}
                      {product.subcategory
                        ? ` — ${product.subcategory}`
                        : ""}
                    </td>
                  </tr>

                  {sizes.length > 0 && (
                    <tr>
                      <td>Available Sizes</td>
                      <td>{sizes.join(", ")}</td>
                    </tr>
                  )}

                  {paperTypes.length > 0 && (
                    <tr>
                      <td>Paper / Material</td>
                      <td>{paperTypes.join(", ")}</td>
                    </tr>
                  )}

                  {features.length > 0 && (
                    <tr>
                      <td>Features</td>
                      <td>{features.join(", ")}</td>
                    </tr>
                  )}

                  <tr>
                    <td>Minimum Order</td>
                    <td>
                      {Number(
                        product.quantityStep || 1
                      )}{" "}
                      unit(s)
                    </td>
                  </tr>

                  <tr>
                    <td>Stock</td>
                    <td>
                      {Number(product.stock) > 0
                        ? `${Number(product.stock)} available`
                        : "Available on order"}
                    </td>
                  </tr>

                  <tr>
                    <td>Customization</td>
                    <td>
                      {isCustomizableProduct
                        ? `Yes — ${
                            product.customizationType ||
                            "available"
                          }`
                        : "Not available"}
                    </td>
                  </tr>

                </tbody>
              </table>

            </div>
          )}


          {/* DESIGN GUIDELINES */}

          {activeTab === "guidelines" && (
            <div className="spec-tab-content">

              <h2>
                Design Guidelines
              </h2>

              <ul className="guideline-list">
                <li>
                  <span>✓</span>
                  High-resolution artwork use karein
                  (300 DPI recommended) — blurry
                  images print mein bhi blurry
                  aati hain.
                </li>
                <li>
                  <span>✓</span>
                  Transparent PNG logo best result
                  deta hai. JPG white background
                  ke saath bhi chalega.
                </li>
                <li>
                  <span>✓</span>
                  Text ko print area ke andar
                  rakhein — edges ke paas design
                  cut ho sakta hai.
                </li>
                <li>
                  <span>✓</span>
                  Dark product pe light colors,
                  light product pe dark colors
                  best contrast dete hain.
                </li>
                <li>
                  <span>✓</span>
                  Screen colors aur print colors
                  mein thoda difference ho sakta
                  hai (CMYK printing).
                </li>
                <li>
                  <span>✓</span>
                  Final design save karne se pehle
                  Preview mode mein front aur
                  back dono check karein.
                </li>
              </ul>

            </div>
          )}


          {/* REVIEWS */}

          {activeTab === "reviews" && (
            <div className="spec-tab-content">

              <h2>
                Customer Reviews
              </h2>

              <div className="tab-review-summary">
                <strong>
                  {product.rating || "4.8"}
                </strong>

                <div className="summary-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <span>
                  {totalReviewCount} reviews
                </span>
              </div>

              {customerReviews.length === 0 ? (
                <p>
                  Is product ke liye abhi koi
                  customer review nahi hai.
                  Neeche review section se pehla
                  review likhein.
                </p>
              ) : (
                <ul className="tab-review-list">
                  {customerReviews
                    .slice(0, 5)
                    .map((r, i) => (
                      <li key={i}>
                        <strong>
                          {r.name || "Customer"}
                        </strong>
                        <span className="tab-review-stars">
                          {"★".repeat(
                            Number(r.rating) || 5
                          )}
                        </span>
                        <p>{r.text}</p>
                      </li>
                    ))}
                </ul>
              )}

              <button
                type="button"
                className="view-details"
                style={{
                  display: "inline-block",
                  width: "auto",
                  padding: "10px 22px",
                  marginTop: "12px",
                }}
                onClick={() =>
                  document
                    .getElementById(
                      "customer-reviews"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }
              >
                See All Reviews / Write a Review
              </button>

            </div>
          )}

        </div>


        {/* =================================================
            SERVICE BOXES
        ================================================= */}

        <div className="service-boxes">


          <div>

            <ShieldCheck />

            <strong>
              Premium Quality
            </strong>

            <span>
              Long lasting print
            </span>

          </div>


          <div>

            <Truck />

            <strong>
              Fast Delivery
            </strong>

            <span>
              Pan India delivery
            </span>

          </div>


          <div>

            <CreditCard />

            <strong>
              Secure Payment
            </strong>

            <span>
              100% secure checkout
            </span>

          </div>


          <div>

            <Heart />

            <strong>
              Customer Support
            </strong>

            <span>
              We're here to help
            </span>

          </div>


        </div>

      </section>


      {/* =====================================================
          CUSTOMER REVIEWS
      ===================================================== */}

      <section
        className="details-container customer-reviews-section"
        id="customer-reviews"
      >

        {/* =================================================
            REVIEW HEADER
        ================================================= */}

        <div className="customer-review-header">

          <div>

            <span className="review-small-title">
              CUSTOMER FEEDBACK
            </span>

            <h2>
              Customer Reviews
            </h2>

            <p>
              See what customers are saying
              about this product.
            </p>

          </div>


          <div className="review-summary">

            <strong>
              {product.rating || "4.8"}
            </strong>

            <div className="summary-stars">

              {[1, 2, 3, 4, 5].map(
                (star) => (

                  <Star
                    key={star}
                    size={18}
                    fill="currentColor"
                  />

                )
              )}

            </div>

            <span>
              {totalReviewCount} reviews
            </span>

          </div>

        </div>


        {/* =================================================
            WRITE REVIEW
        ================================================= */}

        <div className="write-review-box">

          <div className="write-review-title">

            <h3>
              Write a Review
            </h3>

            <p>
              Share your experience with
              this product.
            </p>

          </div>


          <form
            onSubmit={
              handleReviewSubmit
            }
            className="review-form"
          >


            {/* NAME */}

            <div className="review-field">

              <label>
                Your Name
              </label>

              <input
                type="text"
                value={reviewName}
                onChange={(e) =>
                  setReviewName(
                    e.target.value
                  )
                }
                placeholder="Enter your name"
                maxLength={50}
              />

            </div>


            {/* RATING */}

            <div className="review-field">

              <label>
                Your Rating
              </label>

              <div className="review-star-selector">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewRating(
                          star
                        )
                      }
                      className={
                        star <= reviewRating
                          ? "selected"
                          : ""
                      }
                      aria-label={`Rate ${star} stars`}
                    >

                      <Star
                        size={25}
                        fill={
                          star <=
                          reviewRating
                            ? "currentColor"
                            : "none"
                        }
                      />

                    </button>

                  )
                )}

              </div>

            </div>


            {/* REVIEW */}

            <div className="review-field">

              <label>
                Your Review
              </label>

              <textarea
                value={reviewText}
                onChange={(e) =>
                  setReviewText(
                    e.target.value
                  )
                }
                placeholder="Write your experience about this product..."
                rows="5"
                maxLength={500}
              />

              <small>
                {reviewText.length}/500
              </small>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="submit-review-btn"
            >

              Post Review

            </button>

          </form>

        </div>


        {/* =================================================
            CUSTOMER REVIEW LIST
        ================================================= */}

        <div className="reviews-list">

          {customerReviews.length === 0 ? (

            <div className="no-reviews">

              <div className="no-review-icon">
                ★
              </div>

              <h3>
                No Customer Reviews Yet
              </h3>

              <p>
                Be the first customer to
                review this product.
              </p>

            </div>

          ) : (

            customerReviews.map(
              (review) => (

                <article
                  className="customer-review-card"
                  key={review.id}
                >

                  {/* REVIEW TOP */}

                  <div className="review-card-top">

                    <div className="review-user">

                      <div className="review-avatar">

                        {review.name
                          .charAt(0)
                          .toUpperCase()}

                      </div>


                      <div>

                        <h4>
                          {review.name}
                        </h4>

                        <span>
                          {review.date}
                        </span>

                      </div>

                    </div>


                    {/* STARS */}

                    <div className="customer-stars">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (

                          <Star
                            key={star}
                            size={16}
                            fill={
                              star <=
                              review.rating
                                ? "currentColor"
                                : "none"
                            }
                          />

                        )
                      )}

                    </div>

                  </div>


                  {/* COMMENT */}

                  <p className="review-comment">

                    {review.comment}

                  </p>


                  {/* VERIFIED */}

                  <div className="review-bottom">

                    <span className="verified-review">

                      ✓ Verified Customer

                    </span>


                    <button
                      type="button"
                      className="delete-review-btn"
                      onClick={() =>
                        deleteReview(
                          review.id
                        )
                      }
                    >

                      Delete

                    </button>

                  </div>

                </article>

              )
            )

          )}

        </div>

      </section>


    </div>

  );

}


export default ProductDetails;