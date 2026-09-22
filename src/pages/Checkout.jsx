import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  MapPin,
  User,
  Phone,
  Mail,
  CreditCard,
  Wallet,
  Building2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";

import "./Checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(
    location.state?.cart || []
  );

  const [totalPrice, setTotalPrice] =
    useState(
      Number(
        location.state?.totalPrice || 0
      )
    );

  const [totalQuantity, setTotalQuantity] =
    useState(
      Number(
        location.state?.totalQuantity || 0
      )
    );

  /* =====================================================
     FORM
  ===================================================== */

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /* =====================================================
     PAYMENT
  ===================================================== */

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  /* =====================================================
     SUCCESS
  ===================================================== */

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  /* =====================================================
     LOAD USER DETAILS
  ===================================================== */

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem(
          "ananyaUser"
        );

      if (!savedUser) return;

      const user =
        JSON.parse(savedUser);

      setForm((prev) => ({
        ...prev,

        name:
          user.name ||
          user.fullName ||
          "",

        phone:
          user.phone ||
          user.mobile ||
          "",

        email:
          user.email ||
          "",
      }));
    } catch (error) {
      console.error(
        "User details loading error:",
        error
      );
    }
  }, []);

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateForm = () => {

    if (
      !form.name.trim()
    ) {
      alert("Please enter your full name.");
      return false;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        form.phone
      )
    ) {
      alert(
        "Please enter a valid 10 digit phone number."
      );
      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email
      )
    ) {
      alert(
        "Please enter a valid email address."
      );
      return false;
    }

    if (
      !form.address.trim()
    ) {
      alert(
        "Please enter your complete address."
      );
      return false;
    }

    if (
      !form.city.trim()
    ) {
      alert("Please enter your city.");
      return false;
    }

    if (
      !form.state.trim()
    ) {
      alert("Please enter your state.");
      return false;
    }

    if (
      !/^\d{6}$/.test(
        form.pincode
      )
    ) {
      alert(
        "Please enter a valid 6 digit pincode."
      );
      return false;
    }

    return true;
  };

  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const handlePlaceOrder = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    /*
      NOTE:

      COD:
      Directly order create hoga.

      ONLINE:
      Abhi demo flow hai.
      Real payment gateway ke liye
      Razorpay/Stripe backend connect
      karna hoga.
    */

    const generatedOrderId =
      "ATC-" +
      Date.now();

    const newOrder = {
      id: generatedOrderId,

      products: cart,

      customer: {
        ...form,
      },

      paymentMethod,

      totalQuantity,

      totalAmount: totalPrice,

      status:
        paymentMethod === "cod"
          ? "Order Placed"
          : "Payment Pending",

      createdAt:
        new Date().toISOString(),
    };

    /* =================================================
       SAVE ORDER
    ================================================= */

    try {
      const savedOrders =
        localStorage.getItem(
          "ananyaOrders"
        );

      const orders = savedOrders
        ? JSON.parse(savedOrders)
        : [];

      localStorage.setItem(
        "ananyaOrders",
        JSON.stringify([
          newOrder,
          ...orders,
        ])
      );
    } catch (error) {
      console.error(
        "Order save error:",
        error
      );
    }

    /* =================================================
       CLEAR CART
    ================================================= */

    localStorage.removeItem(
      "ananyaCart"
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

    setOrderId(
      generatedOrderId
    );

    setOrderPlaced(true);
  };

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (
    cart.length === 0 &&
    !orderPlaced
  ) {
    return (
      <main className="checkout-page">

        <div className="checkout-empty">

          <ShoppingBag size={55} />

          <h2>
            Your cart is empty
          </h2>

          <p>
            Please add products before
            proceeding to checkout.
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Explore Products
          </button>

        </div>

      </main>
    );
  }

  /* =====================================================
     SUCCESS
  ===================================================== */

  if (orderPlaced) {
    return (
      <main className="checkout-page">

        <div className="order-success">

          <div className="success-icon">
            <CheckCircle2
              size={60}
            />
          </div>

          <span>
            ORDER CONFIRMED
          </span>

          <h1>
            Thank You!
          </h1>

          <p>
            Your order has been placed
            successfully.
          </p>

          <div className="success-details">

            <div>
              <small>
                Order ID
              </small>

              <strong>
                {orderId}
              </strong>
            </div>

            <div>
              <small>
                Total Amount
              </small>

              <strong>
                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>

          <div className="success-buttons">

            <button
              onClick={() =>
                navigate("/")
              }
            >
              Continue Shopping
            </button>

            <button
              className="secondary-success-btn"
              onClick={() =>
                navigate(
                  "/profile"
                )
              }
            >
              View My Account
            </button>

          </div>

        </div>

      </main>
    );
  }

  /* =====================================================
     CHECKOUT
  ===================================================== */

  return (
    <main className="checkout-page">

      <div className="checkout-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="checkout-header">

          <button
            type="button"
            className="back-button"
            onClick={() =>
              navigate(-1)
            }
          >
            <ArrowLeft size={18} />
            Back to Cart
          </button>

          <span>
            ANANYA TRADING COMPANY
          </span>

          <h1>
            Checkout
          </h1>

          <p>
            Complete your details and
            place your order securely.
          </p>

        </div>

        <div className="checkout-layout">

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <form
            className="checkout-form"
            onSubmit={
              handlePlaceOrder
            }
          >

            {/* =================================================
                CUSTOMER DETAILS
            ================================================= */}

            <section className="checkout-card">

              <div className="checkout-card-title">

                <div className="title-icon">
                  <User size={19} />
                </div>

                <div>
                  <h2>
                    Customer Details
                  </h2>

                  <p>
                    Your contact information
                  </p>
                </div>

              </div>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Full Name *
                  </label>

                  <div className="input-box">

                    <User size={17} />

                    <input
                      type="text"
                      name="name"
                      value={
                        form.name
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter full name"
                    />

                  </div>

                </div>

                <div className="form-group">

                  <label>
                    Phone Number *
                  </label>

                  <div className="input-box">

                    <Phone size={17} />

                    <input
                      type="tel"
                      name="phone"
                      value={
                        form.phone
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="10 digit mobile number"
                      maxLength="10"
                    />

                  </div>

                </div>

                <div className="form-group full-width">

                  <label>
                    Email Address *
                  </label>

                  <div className="input-box">

                    <Mail size={17} />

                    <input
                      type="email"
                      name="email"
                      value={
                        form.email
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter email address"
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* =================================================
                DELIVERY ADDRESS
            ================================================= */}

            <section className="checkout-card">

              <div className="checkout-card-title">

                <div className="title-icon">
                  <MapPin size={19} />
                </div>

                <div>
                  <h2>
                    Delivery Address
                  </h2>

                  <p>
                    Where should we deliver your order?
                  </p>
                </div>

              </div>

              <div className="form-grid">

                <div className="form-group full-width">

                  <label>
                    Complete Address *
                  </label>

                  <textarea
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="House no., street, area, landmark..."
                    rows="4"
                  />

                </div>

                <div className="form-group">

                  <label>
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="City"
                  />

                </div>

                <div className="form-group">

                  <label>
                    State *
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="State"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Pincode *
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={
                      form.pincode
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="6 digit pincode"
                    maxLength="6"
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                PAYMENT
            ================================================= */}

            <section className="checkout-card">

              <div className="checkout-card-title">

                <div className="title-icon">
                  <CreditCard size={19} />
                </div>

                <div>
                  <h2>
                    Payment Method
                  </h2>

                  <p>
                    Select your preferred payment method
                  </p>
                </div>

              </div>

              <div className="payment-options">

                {/* COD */}

                <label
                  className={
                    paymentMethod ===
                    "cod"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={
                      paymentMethod ===
                      "cod"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-icon">
                    <Wallet size={21} />
                  </div>

                  <div>
                    <strong>
                      Cash on Delivery
                    </strong>

                    <span>
                      Pay when your order arrives
                    </span>
                  </div>

                </label>

                {/* ONLINE */}

                <label
                  className={
                    paymentMethod ===
                    "online"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={
                      paymentMethod ===
                      "online"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-icon">
                    <CreditCard size={21} />
                  </div>

                  <div>
                    <strong>
                      Online Payment
                    </strong>

                    <span>
                      UPI, Card & Net Banking
                    </span>
                  </div>

                </label>

                {/* BUSINESS */}

                <label
                  className={
                    paymentMethod ===
                    "business"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >

                  <input
                    type="radio"
                    name="payment"
                    value="business"
                    checked={
                      paymentMethod ===
                      "business"
                    }
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value
                      )
                    }
                  />

                  <div className="payment-icon">
                    <Building2 size={21} />
                  </div>

                  <div>
                    <strong>
                      Business / Bulk Order
                    </strong>

                    <span>
                      For large business orders
                    </span>
                  </div>

                </label>

              </div>

            </section>

            {/* =================================================
                PLACE ORDER
            ================================================= */}

            <button
              type="submit"
              className="place-order-btn"
            >

              {paymentMethod ===
              "online"
                ? "Continue to Payment"
                : "Place Order"}

              <ArrowRight
                size={18}
              />

            </button>

          </form>

          {/* =================================================
              RIGHT SUMMARY
          ================================================= */}

          <aside className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="checkout-products">

              {cart.map(
                (item, index) => {

                  const price =
                    Number(
                      item.price
                    ) || 0;

                  const quantity =
                    Number(
                      item.quantity
                    ) || 1;

                  const itemTotal =
                    price *
                    quantity;

                  return (
                    <div
                      className="checkout-product"
                      key={
                        `${
                          item.productId ||
                          item.id ||
                          "product"
                        }-${index}`
                      }
                    >

                      <div className="checkout-product-image">

                        <img
                          src={
                            item.image ||
                            item.images?.[0] ||
                            "https://via.placeholder.com/100x100?text=Product"
                          }
                          alt={
                            item.name ||
                            "Product"
                          }
                        />

                        <span>
                          {quantity}
                        </span>

                      </div>

                      <div className="checkout-product-info">

                        <strong>
                          {item.name ||
                            "Product"}
                        </strong>

                        <small>
                          ₹
                          {price.toLocaleString(
                            "en-IN"
                          )} × {quantity}
                        </small>

                      </div>

                      <b>
                        ₹
                        {itemTotal.toLocaleString(
                          "en-IN"
                        )}
                      </b>

                    </div>
                  );
                }
              )}

            </div>

            <div className="checkout-summary-line" />

            <div className="summary-price-row">

              <span>
                Products
              </span>

              <span>
                {cart.length}
              </span>

            </div>

            <div className="summary-price-row">

              <span>
                Total Quantity
              </span>

              <span>
                {totalQuantity}
              </span>

            </div>

            <div className="summary-price-row">

              <span>
                Delivery
              </span>

              <strong className="free">
                FREE
              </strong>

            </div>

            <div className="checkout-summary-line" />

            <div className="checkout-final-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹
                {totalPrice.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

            <div className="secure-payment">

              <ShieldCheck
                size={16}
              />

              <span>
                Secure & trusted checkout
              </span>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default Checkout;