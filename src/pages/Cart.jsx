import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  Plus,
  Minus,
} from "lucide-react";

import "./Cart.css";


function Cart() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);


  /* =====================================================
     LOAD CART
  ===================================================== */

  const loadCart = () => {

    try {

      const savedCart =
        localStorage.getItem("ananyaCart");

      const parsedCart =
        savedCart
          ? JSON.parse(savedCart)
          : [];


      if (Array.isArray(parsedCart)) {

        setCart(parsedCart);

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


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadCart();


    const handleCartUpdate = () => {

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


  /* =====================================================
     SAVE CART
  ===================================================== */

  const saveCart = (updatedCart) => {

    setCart(updatedCart);


    localStorage.setItem(
      "ananyaCart",
      JSON.stringify(updatedCart)
    );


    window.dispatchEvent(
      new Event("ananyaCartUpdated")
    );


    window.dispatchEvent(
      new Event("cartUpdated")
    );

  };


  /* =====================================================
     INCREASE QUANTITY
     
     100 → 200 → 300
  ===================================================== */

  const increaseQuantity = (index) => {

    const updatedCart = [...cart];

    const item = updatedCart[index];


    const currentQuantity =
      Number(item.quantity) || 100;


    const newQuantity =
      currentQuantity + 100;


    updatedCart[index] = {

      ...item,

      quantity: newQuantity,

    };


    saveCart(updatedCart);

  };


  /* =====================================================
     DECREASE QUANTITY
     
     Minimum = 100
  ===================================================== */

  const decreaseQuantity = (index) => {

    const updatedCart = [...cart];

    const item = updatedCart[index];


    const currentQuantity =
      Number(item.quantity) || 100;


    const newQuantity =
      Math.max(
        100,
        currentQuantity - 100
      );


    updatedCart[index] = {

      ...item,

      quantity: newQuantity,

    };


    saveCart(updatedCart);

  };


  /* =====================================================
     REMOVE SINGLE PRODUCT
  ===================================================== */

  const removeItem = (index) => {

    const updatedCart =
      cart.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );


    saveCart(updatedCart);

  };


  /* =====================================================
     CLEAR CART
  ===================================================== */

  const clearCart = () => {

    localStorage.removeItem(
      "ananyaCart"
    );


    setCart([]);


    window.dispatchEvent(
      new Event("ananyaCartUpdated")
    );


    window.dispatchEvent(
      new Event("cartUpdated")
    );

  };


  /* =====================================================
     TOTAL PRODUCTS
  ===================================================== */

  const totalProducts =
    cart.length;


  /* =====================================================
     TOTAL QUANTITY
  ===================================================== */

  const totalQuantity =
    cart.reduce(
      (total, item) => {

        return (
          total +
          (Number(item.quantity) || 0)
        );

      },
      0
    );


  /* =====================================================
     TOTAL PRICE
     
     price × quantity
  ===================================================== */

  const totalPrice =
    cart.reduce(
      (total, item) => {

        const price =
          Number(item.price) || 0;


        const quantity =
          Number(item.quantity) || 1;


        return (
          total +
          price * quantity
        );

      },
      0
    );


  /* =====================================================
     OPEN PRODUCT
  ===================================================== */

  const openProduct = (item) => {

    const productId =
      item.productId || item.id;


    if (!productId) {

      return;

    }


    navigate(
      `/product/${productId}`,
      {
        state: {
          product: item,
        },
      }
    );

  };


  /* =====================================================
     CHECK LOGIN + CHECKOUT
     
     IMPORTANT:
     
     Login.jsx saves:
     
     localStorage.setItem(
       "currentUser",
       JSON.stringify(loggedInUser)
     );
     
     Therefore we check "currentUser".
  ===================================================== */

  const handleCheckout = () => {

    /* ---------------------------------------------
       EMPTY CART CHECK
    --------------------------------------------- */

    if (cart.length === 0) {

      return;

    }


    /* ---------------------------------------------
       CHECK CURRENT USER
    --------------------------------------------- */

    let currentUser = null;


    try {

      const savedUser =
        localStorage.getItem(
          "currentUser"
        );


      if (savedUser) {

        currentUser =
          JSON.parse(savedUser);

      }

    } catch (error) {

      console.error(
        "Login check error:",
        error
      );

      currentUser = null;

    }


    /* ---------------------------------------------
       ALSO CHECK ADMIN SESSION
    --------------------------------------------- */

    const adminLoggedIn =
      localStorage.getItem(
        "adminLoggedIn"
      ) === "true";


    /* ---------------------------------------------
       USER IS LOGGED IN
    --------------------------------------------- */

    if (
      currentUser ||
      adminLoggedIn
    ) {

      navigate(
        "/checkout",
        {
          state: {

            cart: cart,

            totalPrice:
              totalPrice,

            totalQuantity:
              totalQuantity,

            user:
              currentUser,

          },
        }
      );


      return;

    }


    /* ---------------------------------------------
       USER IS NOT LOGGED IN
       
       Send checkout information to Login
       --------------------------------------------- */

    navigate(
      "/login",
      {
        state: {

          redirectTo:
            "/checkout",

          checkoutData: {

            cart: cart,

            totalPrice:
              totalPrice,

            totalQuantity:
              totalQuantity,

          },

        },
      }
    );

  };


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <main className="cart-page">

      <div className="cart-container">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="cart-heading">

          <div>

            <span className="cart-label">

              YOUR SHOPPING CART

            </span>


            <h1>

              Shopping Cart

            </h1>


            <p>

              Review your selected products
              before checkout.

            </p>

          </div>


          {cart.length > 0 && (

            <button

              type="button"

              className="clear-cart"

              onClick={clearCart}

            >

              Clear Cart

            </button>

          )}

        </div>



        {/* =================================================
            EMPTY CART
        ================================================= */}

        {cart.length === 0 ? (

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

        ) : (


          /* =================================================
             CART CONTENT
          ================================================= */

          <div className="cart-layout">


            {/* =================================================
                CART ITEMS
            ================================================= */}

            <div className="cart-items">


              {cart.map(
                (item, index) => {


                  const price =
                    Number(
                      item.price
                    ) || 0;


                  const quantity =
                    Number(
                      item.quantity
                    ) || 100;


                  const itemTotal =
                    price * quantity;


                  return (

                    <div

                      className="cart-item"

                      key={

                        `${
                          item.productId ||
                          item.id ||
                          "product"
                        }-${index}`

                      }

                    >


                      {/* =====================================
                          PRODUCT IMAGE
                      ===================================== */}

                      <div

                        className="cart-image"

                        onClick={() =>
                          openProduct(item)
                        }

                      >

                        <img

                          src={

                            item.image ||

                            item.images?.[0] ||

                            "https://via.placeholder.com/300x300?text=Product"

                          }

                          alt={

                            item.name ||
                            "Product"

                          }

                        />

                      </div>



                      {/* =====================================
                          PRODUCT INFORMATION
                      ===================================== */}

                      <div className="cart-info">


                        <span className="cart-category">

                          {item.paperType ||

                            item.category ||

                            "Premium"

                          }

                        </span>


                        <h3

                          onClick={() =>
                            openProduct(item)
                          }

                        >

                          {item.name ||

                            "Untitled Product"

                          }

                        </h3>


                        <p>

                          Size:{" "}

                          {item.size ||

                            "Standard"

                          }

                        </p>


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



                      {/* =====================================
                          QUANTITY
                      ===================================== */}

                      <div className="cart-quantity">


                        <button

                          type="button"

                          onClick={() =>
                            decreaseQuantity(
                              index
                            )
                          }

                          disabled={
                            quantity <= 100
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



                      {/* =====================================
                          ITEM TOTAL
                      ===================================== */}

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
                            removeItem(index)
                          }

                          aria-label={

                            `Remove ${
                              item.name ||
                              "product"
                            }`

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



            {/* =================================================
                ORDER SUMMARY
            ================================================= */}

            <aside className="cart-summary">


              <h2>

                Order Summary

              </h2>



              {/* PRODUCTS */}

              <div className="summary-row">

                <span>

                  Products

                </span>


                <span>

                  {totalProducts}

                </span>

              </div>



              {/* TOTAL QUANTITY */}

              <div className="summary-row">

                <span>

                  Total Quantity

                </span>


                <span>

                  {totalQuantity}

                </span>

              </div>



              {/* SUBTOTAL */}

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



              {/* DELIVERY */}

              <div className="summary-row">

                <span>

                  Delivery

                </span>


                <strong className="free">

                  FREE

                </strong>

              </div>



              <div className="summary-line" />



              {/* FINAL TOTAL */}

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



              {/* =============================================
                  CHECKOUT BUTTON
              ============================================= */}

              <button

                type="button"

                className="checkout-btn"

                onClick={handleCheckout}

              >

                Proceed to Checkout

                <ArrowRight
                  size={18}
                />

              </button>



              {/* =============================================
                  CONTINUE SHOPPING
              ============================================= */}

              <Link

                to="/"

                className="continue-link"

              >

                ← Continue Shopping

              </Link>


            </aside>


          </div>

        )}

      </div>

    </main>

  );

}


export default Cart;