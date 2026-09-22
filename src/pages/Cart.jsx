import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  Plus,
  Minus,
  Palette,
  Type,
  Image as ImageIcon,
  X,
  Maximize2,
} from "lucide-react";

import "./Cart.css";


// ============================================================
// PRODUCT PREVIEW COMPONENT
// ============================================================

function CartProductPreview({
  item,
  onPreview,
}) {

  const image =
    item.image ||
    item.images?.[0] ||
    "";

  const isCustomized =
    item.isCustomized ||
    item.logo ||
    item.text;


  const logoX =
    Number(item.logoPosition?.x) || 50;

  const logoY =
    Number(item.logoPosition?.y) || 31;


  const textX =
    Number(item.textPosition?.x) || 50;

  const textY =
    Number(item.textPosition?.y) || 55;


  const logoSize =
    Number(item.logoSize) || 115;


  const textFontSize =
    Number(item.fontSize) || 25;


  return (
    <div
      className="cart-design-preview"
      onClick={() =>
        onPreview(item)
      }
    >

      {/* PRODUCT IMAGE */}

      {image ? (

        <img
          src={image}
          alt={
            item.name ||
            "Product"
          }
          className="cart-product-image"
        />

      ) : (

        <div
          className="cart-product-fallback"
          style={{
            background:
              item.color ||
              "#ffffff",
          }}
        />

      )}


      {/* CUSTOMIZATION */}

      {isCustomized && (

        <div className="cart-customization-layer">

          {/* LOGO */}

          {item.logo &&
            item.side !== "back" && (

              <div
                className="cart-logo-overlay"
                style={{
                  left:
                    `${logoX}%`,

                  top:
                    `${logoY}%`,

                  width:
                    `${logoSize}px`,
                }}
              >

                <img
                  src={item.logo}
                  alt="Custom Logo"
                />

              </div>

            )}


          {/* TEXT */}

          {item.text &&
            item.side !== "back" && (

              <div
                className="cart-text-overlay"
                style={{
                  left:
                    `${textX}%`,

                  top:
                    `${textY}%`,

                  color:
                    item.textColor ||
                    "#102a4c",

                  fontSize:
                    `${textFontSize}px`,

                  fontFamily:
                    item.fontFamily ||
                    "Poppins",

                  fontWeight:
                    item.bold
                      ? 700
                      : 400,

                  fontStyle:
                    item.italic
                      ? "italic"
                      : "normal",

                  textDecoration:
                    item.underline
                      ? "underline"
                      : "none",
                }}
              >

                {item.text}

              </div>

            )}

        </div>

      )}


      {/* ZOOM ICON */}

      <div className="cart-image-zoom">

        <Maximize2 size={17} />

      </div>


      {/* CUSTOMIZED BADGE */}

      {isCustomized && (

        <div className="customized-badge">

          <Palette size={11} />

          Customized

        </div>

      )}

    </div>
  );
}


// ============================================================
// LARGE PREVIEW MODAL
// ============================================================

function ProductPreviewModal({
  item,
  onClose,
}) {

  if (!item) {
    return null;
  }


  const image =
    item.image ||
    item.images?.[0] ||
    "";


  const logoX =
    Number(item.logoPosition?.x) || 50;

  const logoY =
    Number(item.logoPosition?.y) || 31;


  const textX =
    Number(item.textPosition?.x) || 50;

  const textY =
    Number(item.textPosition?.y) || 55;


  const logoSize =
    Number(item.logoSize) || 115;


  const textFontSize =
    Number(item.fontSize) || 25;


  return (

    <div
      className="product-preview-overlay"
      onClick={onClose}
    >

      {/* ==================================================
          MODAL
      ================================================== */}

      <div
        className="product-preview-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* CLOSE BUTTON */}

        <button
          type="button"
          className="preview-close-btn"
          onClick={onClose}
          aria-label="Close preview"
        >

          <X size={24} />

        </button>


        {/* HEADER */}

        <div className="preview-modal-header">

          <div>

            <span>
              PRODUCT PREVIEW
            </span>

            <h2>
              {item.name ||
                "Product"}
            </h2>

          </div>

        </div>


        {/* ==================================================
            LARGE PRODUCT
        ================================================== */}

        <div className="large-product-preview">

          {image ? (

            <img
              src={image}
              alt={
                item.name ||
                "Product"
              }
              className="large-product-image"
            />

          ) : (

            <div
              className="large-product-fallback"
              style={{
                background:
                  item.color ||
                  "#ffffff",
              }}
            />

          )}


          {/* CUSTOMIZATION */}

          <div className="large-customization-layer">

            {/* LOGO */}

            {item.logo &&
              item.side !== "back" && (

                <div
                  className="large-logo-overlay"
                  style={{
                    left:
                      `${logoX}%`,

                    top:
                      `${logoY}%`,

                    width:
                      `${logoSize}px`,
                  }}
                >

                  <img
                    src={item.logo}
                    alt="Custom Logo"
                  />

                </div>

              )}


            {/* TEXT */}

            {item.text &&
              item.side !== "back" && (

                <div
                  className="large-text-overlay"
                  style={{
                    left:
                      `${textX}%`,

                    top:
                      `${textY}%`,

                    color:
                      item.textColor ||
                      "#102a4c",

                    fontSize:
                      `${textFontSize}px`,

                    fontFamily:
                      item.fontFamily ||
                      "Poppins",

                    fontWeight:
                      item.bold
                        ? 700
                        : 400,

                    fontStyle:
                      item.italic
                        ? "italic"
                        : "normal",

                    textDecoration:
                      item.underline
                        ? "underline"
                        : "none",
                  }}
                >

                  {item.text}

                </div>

              )}

          </div>

        </div>


        {/* ==================================================
            PRODUCT DETAILS
        ================================================== */}

        <div className="preview-product-details">

          <div>

            <span>
              Product
            </span>

            <strong>
              {item.name ||
                "Product"}
            </strong>

          </div>


          <div>

            <span>
              Size
            </span>

            <strong>
              {item.size ||
                "Standard"}
            </strong>

          </div>


          {item.color && (

            <div>

              <span>
                Color
              </span>

              <strong
                className="preview-color"
              >

                <i
                  style={{
                    background:
                      item.color,
                  }}
                />

                {item.color}

              </strong>

            </div>

          )}


          {item.logo && (

            <div>

              <span>
                Logo
              </span>

              <strong>
                Added
              </strong>

            </div>

          )}


          {item.text && (

            <div>

              <span>
                Text
              </span>

              <strong>
                {item.text}
              </strong>

            </div>

          )}

        </div>


        {/* CLOSE */}

        <button
          type="button"
          className="preview-bottom-btn"
          onClick={onClose}
        >

          Close Preview

        </button>

      </div>

    </div>

  );
}


// ============================================================
// CART
// ============================================================

function Cart() {

  const navigate =
    useNavigate();


  const [cart, setCart] =
    useState([]);


  // ==========================================================
  // PREVIEW STATE
  // ==========================================================

  const [
    previewProduct,
    setPreviewProduct,
  ] = useState(null);


  // ==========================================================
  // LOAD CART
  // ==========================================================

  const loadCart = () => {

    try {

      const savedCart =
        localStorage.getItem(
          "ananyaCart"
        );


      const parsedCart =
        savedCart
          ? JSON.parse(
              savedCart
            )
          : [];


      if (
        Array.isArray(
          parsedCart
        )
      ) {

        setCart(
          parsedCart
        );

      } else {

        setCart([]);

      }

    } catch (error) {

      console.error(
        "Cart loading error:",
        error
      );

      setCart([]);

    }

  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {

    loadCart();


    const handleCartUpdate =
      () => {

        loadCart();

      };


    window.addEventListener(
      "ananyaCartUpdated",
      handleCartUpdate
    );


    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );


    window.addEventListener(
      "storage",
      handleCartUpdate
    );


    return () => {

      window.removeEventListener(
        "ananyaCartUpdated",
        handleCartUpdate
      );


      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );


      window.removeEventListener(
        "storage",
        handleCartUpdate
      );

    };

  }, []);


  // ==========================================================
  // CLOSE PREVIEW WITH ESC
  // ==========================================================

  useEffect(() => {

    const handleKeyDown =
      (event) => {

        if (
          event.key === "Escape"
        ) {

          setPreviewProduct(
            null
          );

        }

      };


    window.addEventListener(
      "keydown",
      handleKeyDown
    );


    return () => {

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );

    };

  }, []);


  // ==========================================================
  // SAVE CART
  // ==========================================================

  const saveCart =
    (updatedCart) => {

      setCart(
        updatedCart
      );


      localStorage.setItem(
        "ananyaCart",
        JSON.stringify(
          updatedCart
        )
      );


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

    };


  // ==========================================================
  // INCREASE
  // ==========================================================

  const increaseQuantity =
    (index) => {

      const updatedCart =
        [...cart];


      const item =
        updatedCart[index];


      const currentQuantity =
        Number(
          item.quantity
        ) || 100;


      updatedCart[index] = {

        ...item,

        quantity:
          currentQuantity +
          100,

      };


      saveCart(
        updatedCart
      );

    };


  // ==========================================================
  // DECREASE
  // ==========================================================

  const decreaseQuantity =
    (index) => {

      const updatedCart =
        [...cart];


      const item =
        updatedCart[index];


      const currentQuantity =
        Number(
          item.quantity
        ) || 100;


      updatedCart[index] = {

        ...item,

        quantity:
          Math.max(
            100,
            currentQuantity -
              100
          ),

      };


      saveCart(
        updatedCart
      );

    };


  // ==========================================================
  // REMOVE
  // ==========================================================

  const removeItem =
    (index) => {

      const updatedCart =
        cart.filter(
          (_, itemIndex) =>
            itemIndex !== index
        );


      saveCart(
        updatedCart
      );

    };


  // ==========================================================
  // CLEAR
  // ==========================================================

  const clearCart =
    () => {

      localStorage.removeItem(
        "ananyaCart"
      );


      setCart([]);


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

    };


  // ==========================================================
  // TOTALS
  // ==========================================================

  const totalProducts =
    cart.length;


  const totalQuantity =
    cart.reduce(
      (
        total,
        item
      ) =>
        total +
        (
          Number(
            item.quantity
          ) || 0
        ),
      0
    );


  const totalPrice =
    cart.reduce(
      (
        total,
        item
      ) => {

        const price =
          Number(
            item.price
          ) || 0;


        const quantity =
          Number(
            item.quantity
          ) || 1;


        return (
          total +
          price *
            quantity
        );

      },
      0
    );


  // ==========================================================
  // OPEN PRODUCT
  // ==========================================================

  const openProduct =
    (item) => {

      const productId =
        item.originalProductId ||
        item.id;


      if (!productId) {

        return;

      }


      navigate(
        `/product/${productId}`,
        {
          state: {
            product:
              item,
          },
        }
      );

    };


  // ==========================================================
  // CHECKOUT
  // ==========================================================

  const handleCheckout =
    () => {

      if (
        cart.length === 0
      ) {

        return;

      }


      let currentUser =
        null;


      try {

        const savedUser =
          localStorage.getItem(
            "currentUser"
          );


        if (
          savedUser
        ) {

          currentUser =
            JSON.parse(
              savedUser
            );

        }

      } catch (error) {

        console.error(
          "Login check error:",
          error
        );

      }


      const adminLoggedIn =
        localStorage.getItem(
          "adminLoggedIn"
        ) === "true";


      if (
        currentUser ||
        adminLoggedIn
      ) {

        navigate(
          "/checkout",
          {
            state: {

              cart,

              totalPrice,

              totalQuantity,

              user:
                currentUser,

            },
          }
        );


        return;

      }


      navigate(
        "/login",
        {
          state: {

            redirectTo:
              "/checkout",

            checkoutData: {

              cart,

              totalPrice,

              totalQuantity,

            },

          },
        }
      );

    };


  // ==========================================================
  // EMPTY CART
  // ==========================================================

  if (
    cart.length === 0
  ) {

    return (

      <main className="cart-page">

        <div className="cart-container">

          <div className="cart-heading">

            <div>

              <span className="cart-label">
                YOUR SHOPPING CART
              </span>

              <h1>
                Shopping Cart
              </h1>

              <p>
                Review your selected
                products before checkout.
              </p>

            </div>

          </div>


          <div className="empty-cart">

            <div className="empty-cart-icon">

              <ShoppingCart
                size={42}
              />

            </div>


            <h2>
              Your cart is empty
            </h2>


            <p>
              You haven't added any
              products to your cart yet.
            </p>


            <Link
              to="/"
              className="continue-shopping"
            >

              Explore Products

              <ArrowRight
                size={18}
              />

            </Link>

          </div>

        </div>

      </main>

    );

  }


  // ==========================================================
  // MAIN CART
  // ==========================================================

  return (

    <main className="cart-page">

      <div className="cart-container">


        {/* HEADER */}

        <div className="cart-heading">

          <div>

            <span className="cart-label">
              YOUR SHOPPING CART
            </span>


            <h1>
              Shopping Cart
            </h1>


            <p>
              Review your selected
              products before checkout.
            </p>

          </div>


          <button
            type="button"
            className="clear-cart"
            onClick={
              clearCart
            }
          >

            Clear Cart

          </button>

        </div>



        {/* CART */}

        <div className="cart-layout">


          {/* ITEMS */}

          <div className="cart-items">

            {cart.map(
              (
                item,
                index
              ) => {

                const price =
                  Number(
                    item.price
                  ) || 0;


                const quantity =
                  Number(
                    item.quantity
                  ) || 100;


                const itemTotal =
                  price *
                  quantity;


                const customized =
                  Boolean(
                    item.isCustomized ||
                    item.logo ||
                    item.text
                  );


                return (

                  <div
                    className={
                      customized
                        ? "cart-item customized-cart-item"
                        : "cart-item"
                    }
                    key={
                      `${
                        item.productId ||
                        item.id ||
                        "product"
                      }-${index}`
                    }
                  >


                    {/* PRODUCT IMAGE */}

                    <div
                      className="cart-image"
                    >

                      <CartProductPreview
                        item={
                          item
                        }
                        onPreview={
                          setPreviewProduct
                        }
                      />

                    </div>



                    {/* INFO */}

                    <div className="cart-info">

                      <span className="cart-category">

                        {
                          item.paperType ||
                          item.category ||
                          "Premium"
                        }

                      </span>


                      <h3
                        onClick={() =>
                          openProduct(
                            item
                          )
                        }
                      >

                        {
                          item.name ||
                          "Untitled Product"
                        }

                      </h3>


                      <p>

                        Size:{" "}

                        {
                          item.size ||
                          "Standard"
                        }

                      </p>


                      {customized && (

                        <div className="customization-info">

                          <div>

                            <Palette
                              size={14}
                            />

                            Customized

                          </div>


                          {item.logo && (

                            <span>

                              <ImageIcon
                                size={13}
                              />

                              Logo

                            </span>

                          )}


                          {item.text && (

                            <span>

                              <Type
                                size={13}
                              />

                              Text

                            </span>

                          )}

                        </div>

                      )}


                      <strong>

                        ₹
                        {price.toLocaleString(
                          "en-IN"
                        )}

                      </strong>


                      <small className="price-note">

                        Price per piece

                      </small>

                    </div>



                    {/* QUANTITY */}

                    <div className="cart-quantity">

                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(
                            index
                          )
                        }
                        disabled={
                          quantity <=
                          100
                        }
                      >

                        <Minus
                          size={15}
                        />

                      </button>


                      <span>
                        {quantity}
                      </span>


                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(
                            index
                          )
                        }
                      >

                        <Plus
                          size={15}
                        />

                      </button>

                    </div>



                    {/* TOTAL */}

                    <div className="cart-item-total">

                      <span>
                        Item Total
                      </span>


                      <strong>

                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}

                      </strong>


                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          removeItem(
                            index
                          )
                        }
                      >

                        <Trash2
                          size={18}
                        />

                      </button>

                    </div>


                  </div>

                );

              }
            )}

          </div>



          {/* SUMMARY */}

          <aside className="cart-summary">

            <h2>
              Order Summary
            </h2>


            <div className="summary-row">

              <span>
                Products
              </span>

              <span>
                {totalProducts}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Total Quantity
              </span>

              <span>
                {totalQuantity}
              </span>

            </div>


            <div className="summary-row">

              <span>
                Subtotal
              </span>

              <strong>

                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}

              </strong>

            </div>


            <div className="summary-row">

              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>

            </div>


            <div className="summary-line" />


            <div className="summary-total">

              <span>
                Total
              </span>

              <strong>

                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}

              </strong>

            </div>


            <button
              type="button"
              className="checkout-btn"
              onClick={
                handleCheckout
              }
            >

              Proceed to Checkout

              <ArrowRight
                size={18}
              />

            </button>


            <Link
              to="/"
              className="continue-link"
            >

              ← Continue Shopping

            </Link>

          </aside>

        </div>

      </div>



      {/* ======================================================
          LARGE PREVIEW MODAL
      ====================================================== */}

      <ProductPreviewModal
        item={
          previewProduct
        }
        onClose={() =>
          setPreviewProduct(
            null
          )
        }
      />

    </main>

  );

}


export default Cart;