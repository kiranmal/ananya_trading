import React, { useEffect, useState } from "react";

import {
  useParams,
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

import "../styles/ProductDetails.css";


function ProductDetails() {

  const { id } = useParams();


  /* =====================================================
     GET PRODUCT
  ===================================================== */

  const product = getProductById(id);


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
    useState(100);

  const [paper, setPaper] =
    useState(paperTypes[0]);

  const [size, setSize] =
    useState(sizes[0]);

  const [isFavorite, setIsFavorite] =
    useState(false);


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
     INCREASE QUANTITY
  ===================================================== */

  const increaseQuantity = () => {

    setQuantity(
      (previousQuantity) =>
        previousQuantity + 100
    );

  };


  /* =====================================================
     DECREASE QUANTITY
  ===================================================== */

  const decreaseQuantity = () => {

    setQuantity(
      (previousQuantity) =>
        Math.max(
          100,
          previousQuantity - 100
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

    alert(
      "Design upload feature will be connected soon."
    );

  };


  /* =====================================================
     CUSTOMIZE
  ===================================================== */

  const handleCustomize = () => {

    alert(
      "Customization feature will be connected soon."
    );

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


            {/* =================================================
                FAVORITE BUTTON
            ================================================= */}

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


          {/* =================================================
              THUMBNAILS
          ================================================= */}

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
              {product.reviews || 0}
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
                  quantity <= 100
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


            <button
              type="button"
              className="customize-btn"
              onClick={
                handleCustomize
              }
            >

              Customize Now

            </button>


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


          {/* =================================================
              BULK MESSAGE
          ================================================= */}

          <div className="bulk-message">

            💼 Bulk orders get additional discounts.
            Contact us for custom pricing.

          </div>

        </div>

      </section>


      {/* =================================================
          DETAILS SECTION
      ================================================= */}

      <section
        className="details-container information-section"
      >


        {/* TABS */}

        <div className="information-tabs">

          <button
            type="button"
            className="active"
          >

            Product Details

          </button>


          <button type="button">

            Specifications

          </button>


          <button type="button">

            Design Guidelines

          </button>


          <button type="button">

            Reviews (
            {product.reviews || 0}
            )

          </button>

        </div>


        {/* CONTENT */}

        <div className="information-content">


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


    </div>

  );

}


export default ProductDetails;