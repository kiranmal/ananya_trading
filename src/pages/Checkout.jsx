
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

  /*
  =====================================================
  CART
  =====================================================
  */

  const [cart, setCart] = useState(
    Array.isArray(location.state?.cart)
      ? location.state.cart
      : []
  );

  const [totalPrice, setTotalPrice] = useState(
    Number(location.state?.totalPrice || 0)
  );

  const [totalQuantity, setTotalQuantity] = useState(
    Number(location.state?.totalQuantity || 0)
  );

  /*
  =====================================================
  FORM
  =====================================================
  */

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  /*
  =====================================================
  PAYMENT
  =====================================================
  */

  const [paymentMethod, setPaymentMethod] = useState("cod");

  /*
  =====================================================
  SUCCESS
  =====================================================
  */

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  /*
  =====================================================
  DELIVERY VERIFICATION
  =====================================================
  */

  const [deliveryStatus, setDeliveryStatus] = useState("idle");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [checkingDelivery, setCheckingDelivery] = useState(false);

  /*
  =====================================================
  CHECK DELIVERY
  =====================================================
  */

  const checkDeliveryAvailability = async () => {
    const name = String(form.name || "").trim();
    const address = String(form.address || "").trim();
    const city = String(form.city || "").trim();
    const state = String(form.state || "").trim();
    const pincode = String(form.pincode || "").trim();

    /*
    -----------------------------------------------
    BASIC VALIDATION
    -----------------------------------------------
    */

    if (name.length < 2) {
      setDeliveryStatus("invalid");
      setDeliveryMessage("Please enter your full name.");
      return false;
    }

    if (address.length < 10) {
      setDeliveryStatus("invalid");
      setDeliveryMessage(
        "Please enter your complete delivery address."
      );
      return false;
    }

    if (city.length < 2) {
      setDeliveryStatus("invalid");
      setDeliveryMessage("Please enter your city.");
      return false;
    }

    if (state.length < 2) {
      setDeliveryStatus("invalid");
      setDeliveryMessage("Please enter your state.");
      return false;
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setDeliveryStatus("invalid");
      setDeliveryMessage(
        "Please enter a valid 6 digit Indian pincode."
      );
      return false;
    }

    /*
    -----------------------------------------------
    START CHECK
    -----------------------------------------------
    */

    setCheckingDelivery(true);
    setDeliveryStatus("checking");
    setDeliveryMessage(
      "Checking your address and delivery availability..."
    );

    try {
      const response = await fetch(
        "http://localhost:5000/api/check-delivery",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            address,
            city,
            state,
            pincode,
          }),
        }
      );

      let result = {};

      try {
        result = await response.json();
      } catch {
        result = {};
      }

      /*
      -----------------------------------------------
      SERVER ERROR
      -----------------------------------------------
      */

      if (!response.ok) {
        setDeliveryStatus("error");

        setDeliveryMessage(
          result.message ||
            "Address verification failed. Please try again."
        );

        return false;
      }

      /*
      -----------------------------------------------
      DELIVERY NOT AVAILABLE
      -----------------------------------------------
      */

      if (
        result.serviceable !== true ||
        result.validAddress !== true
      ) {
        setDeliveryStatus("unavailable");

        setDeliveryMessage(
          result.message ||
            "Sorry, delivery is not available at this address."
        );

        return false;
      }

      /*
      -----------------------------------------------
      DELIVERY AVAILABLE
      -----------------------------------------------
      */

      setDeliveryStatus("available");

      setDeliveryMessage(
        result.message ||
          "Delivery is available at this address."
      );

      return true;
    } catch (error) {
      console.error(
        "Delivery availability error:",
        error
      );

      setDeliveryStatus("error");

      setDeliveryMessage(
        "Unable to check delivery. Please make sure the backend server is running on port 5000."
      );

      return false;
    } finally {
      setCheckingDelivery(false);
    }
  };

  /*
  =====================================================
  LOAD USER DETAILS
  =====================================================
  */

  useEffect(() => {
    try {
      const savedUser =
        localStorage.getItem("ananyaUser") ||
        localStorage.getItem("currentUser");

      if (!savedUser) {
        return;
      }

      const user = JSON.parse(savedUser);

      setForm((prev) => ({
        ...prev,

        name:
          user.name ||
          user.fullName ||
          prev.name ||
          "",

        phone:
          user.phone ||
          user.mobile ||
          prev.phone ||
          "",

        email:
          user.email ||
          prev.email ||
          "",
      }));
    } catch (error) {
      console.error(
        "User details loading error:",
        error
      );
    }
  }, []);

  /*
  =====================================================
  RECALCULATE TOTALS
  =====================================================
  */

  useEffect(() => {
    if (!Array.isArray(cart)) {
      return;
    }

    const quantity = cart.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 1),
      0
    );

    const price = cart.reduce(
      (sum, item) => {
        const itemPrice = Number(item.price) || 0;
        const itemQuantity =
          Number(item.quantity) || 1;

        return sum + itemPrice * itemQuantity;
      },
      0
    );

    if (!totalQuantity) {
      setTotalQuantity(quantity);
    }

    if (!totalPrice) {
      setTotalPrice(price);
    }
  }, [cart, totalPrice, totalQuantity]);

  /*
  =====================================================
  FORM CHANGE
  =====================================================
  */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    /*
    Address change hone par
    old verification invalid hogi.
    */

    if (
      [
        "name",
        "address",
        "city",
        "state",
        "pincode",
      ].includes(name)
    ) {
      setDeliveryStatus("idle");
      setDeliveryMessage("");
    }
  };

  /*
  =====================================================
  VALIDATE FORM
  =====================================================
  */

  const validateForm = () => {
    if (!form.name.trim()) {
      alert("Please enter your full name.");
      return false;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      alert(
        "Please enter a valid 10 digit phone number."
      );
      return false;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim()
      )
    ) {
      alert(
        "Please enter a valid email address."
      );
      return false;
    }

    if (form.address.trim().length < 10) {
      alert(
        "Please enter your complete delivery address."
      );
      return false;
    }

    if (form.city.trim().length < 2) {
      alert("Please enter your city.");
      return false;
    }

    if (form.state.trim().length < 2) {
      alert("Please enter your state.");
      return false;
    }

    if (
      !/^[1-9][0-9]{5}$/.test(
        form.pincode.trim()
      )
    ) {
      alert(
        "Please enter a valid 6 digit Indian pincode."
      );
      return false;
    }

    if (!cart.length) {
      alert("Your cart is empty.");
      return false;
    }

    return true;
  };

  /*
  =====================================================
  CREATE ADMIN NOTIFICATION
  =====================================================
  */

  const createAdminNotification = (order) => {
    try {
      const savedNotifications =
        localStorage.getItem(
          "ananyaAdminNotifications"
        );

      let notifications = savedNotifications
        ? JSON.parse(savedNotifications)
        : [];

      if (!Array.isArray(notifications)) {
        notifications = [];
      }

      const notification = {
        id: `NOTIF-${Date.now()}`,

        type: "order",

        title: "New Order Received",

        message: `${order.customer.name} placed order ${order.id}`,

        orderId: order.id,

        orderNumber: order.orderNumber,

        productId:
          order.products?.[0]?.productId ||
          order.products?.[0]?.id ||
          "",

        productName:
          order.products?.[0]?.name ||
          "Multiple Products",

        productImage:
          order.products?.[0]?.image ||
          order.products?.[0]?.images?.[0] ||
          "",

        products: order.products,

        quantity: order.totalQuantity,

        total: order.total,

        customerName: order.customer.name,

        customerEmail: order.customer.email,

        customerPhone: order.customer.phone,

        status: order.status,

        read: false,

        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "ananyaAdminNotifications",
        JSON.stringify([
          notification,
          ...notifications,
        ])
      );

      window.dispatchEvent(
        new Event("ananyaAdminNotification")
      );
    } catch (error) {
      console.error(
        "Admin notification error:",
        error
      );
    }
  };

  /*
  =====================================================
  PLACE ORDER
  =====================================================
  */

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    /*
    -----------------------------------------------
    1. NORMAL FORM VALIDATION
    -----------------------------------------------
    */

    if (!validateForm()) {
      return;
    }

    /*
    -----------------------------------------------
    2. ALWAYS VERIFY DELIVERY AGAIN
    -----------------------------------------------
    */

    const deliveryAvailable =
      await checkDeliveryAvailability();

    if (!deliveryAvailable) {
      alert(
        "This address is not verified for delivery. Order cannot be placed."
      );
      return;
    }

    /*
    -----------------------------------------------
    GENERATE ORDER ID
    -----------------------------------------------
    */

    const generatedOrderId =
      "ATC-" + Date.now();

    /*
    -----------------------------------------------
    PREPARE PRODUCTS
    -----------------------------------------------
    */

    const products = cart.map(
      (item, index) => {
        const price =
          Number(item.price) || 0;

        const quantity =
          Number(item.quantity) || 1;

        const itemTotal =
          price * quantity;

        const customized =
          Boolean(
            item.isCustomized ||
            item.logo ||
            item.text
          );

        return {
          ...item,

          id:
            item.id ||
            item.productId ||
            `PRODUCT-${index}`,

          productId:
            item.originalProductId ||
            item.productId ||
            item.id ||
            "",

          name:
            item.name ||
            "Untitled Product",

          image:
            item.image ||
            item.images?.[0] ||
            "",

          images:
            Array.isArray(item.images)
              ? item.images
              : item.image
              ? [item.image]
              : [],

          price,

          quantity,

          total: itemTotal,

          size:
            item.size ||
            "Standard",

          category:
            item.category ||
            item.paperType ||
            "Premium",

          customized,

          isCustomized: customized,

          logo: item.logo || null,

          text: item.text || "",

          textColor:
            item.textColor || "",

          fontFamily:
            item.fontFamily || "",

          fontSize:
            item.fontSize || "",

          bold: Boolean(item.bold),

          italic: Boolean(item.italic),

          underline: Boolean(
            item.underline
          ),

          logoPosition:
            item.logoPosition || null,

          textPosition:
            item.textPosition || null,

          logoSize:
            item.logoSize || null,

          color:
            item.color || "",
        };
      }
    );

    /*
    -----------------------------------------------
    CALCULATE TOTALS
    -----------------------------------------------
    */

    const calculatedSubtotal =
      products.reduce(
        (sum, item) =>
          sum +
          (Number(item.price) || 0) *
            (Number(item.quantity) || 1),
        0
      );

    const calculatedQuantity =
      products.reduce(
        (sum, item) =>
          sum +
          (Number(item.quantity) || 1),
        0
      );

    const shippingCharge = 0;
    const discount = 0;

    const finalTotal =
      calculatedSubtotal +
      shippingCharge -
      discount;

    /*
    -----------------------------------------------
    SHIPPING ADDRESS
    -----------------------------------------------
    */

    const shippingAddress = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim(),
    };

    /*
    -----------------------------------------------
    CUSTOMER
    -----------------------------------------------
    */

    const customer = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };

    /*
    -----------------------------------------------
    CREATE ORDER
    -----------------------------------------------
    */

    const now = new Date().toISOString();

    const newOrder = {
      id: generatedOrderId,

      orderId: generatedOrderId,

      orderNumber: generatedOrderId,

      products,

      items: products,

      cart: products,

      customer,

      user: customer,

      customerName: customer.name,

      email: customer.email,

      phone: customer.phone,

      shippingAddress,

      address: shippingAddress,

      paymentMethod,

      payment: paymentMethod,

      paymentStatus: "Pending",

      subtotal: calculatedSubtotal,

      totalPrice: calculatedSubtotal,

      shipping: shippingCharge,

      shippingCharge,

      discount,

      total: finalTotal,

      grandTotal: finalTotal,

      totalAmount: finalTotal,

      totalQuantity: calculatedQuantity,

      totalItems: products.length,

      status:
        paymentMethod === "cod"
          ? "New"
          : "Payment Pending",

      notification: true,

      /*
      -----------------------------------------------
      DELIVERY VERIFICATION RECORD
      -----------------------------------------------
      */

      deliveryVerified: true,

      deliveryVerification: {
        verified: true,

        validAddress: true,

        serviceable: true,

        pincode:
          form.pincode.trim(),

        city:
          form.city.trim(),

        state:
          form.state.trim(),

        verifiedAt: now,
      },

      createdAt: now,

      updatedAt: now,
    };

    /*
    -----------------------------------------------
    SAVE ORDER
    -----------------------------------------------
    */

    try {
      const savedOrders =
        localStorage.getItem(
          "ananyaOrders"
        );

      let orders = savedOrders
        ? JSON.parse(savedOrders)
        : [];

      if (!Array.isArray(orders)) {
        orders = [];
      }

      const updatedOrders = [
        newOrder,
        ...orders,
      ];

      localStorage.setItem(
        "ananyaOrders",
        JSON.stringify(updatedOrders)
      );

      /*
      ADMIN NOTIFICATION
      */

      createAdminNotification(
        newOrder
      );

      /*
      EVENTS
      */

      window.dispatchEvent(
        new Event(
          "ananyaOrdersUpdated"
        )
      );

      window.dispatchEvent(
        new Event(
          "ananyaOrderCreated"
        )
      );

      window.dispatchEvent(
        new Event("orderUpdated")
      );
    } catch (error) {
      console.error(
        "Order save error:",
        error
      );

      alert(
        "Order save nahi ho paya. Please try again."
      );

      return;
    }

    /*
    -----------------------------------------------
    CLEAR CART
    -----------------------------------------------
    */

    localStorage.removeItem(
      "ananyaCart"
    );

    window.dispatchEvent(
      new Event("ananyaCartUpdated")
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );

    /*
    -----------------------------------------------
    SUCCESS
    -----------------------------------------------
    */

    setTotalPrice(finalTotal);

    setOrderId(
      generatedOrderId
    );

    setOrderPlaced(true);
  };

  /*
  =====================================================
  EMPTY CART
  =====================================================
  */

  if (
    cart.length === 0 &&
    !orderPlaced
  ) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <ShoppingBag size={55} />

          <h2>Your cart is empty</h2>

          <p>
            Please add products before
            proceeding to checkout.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Explore Products
          </button>
        </div>
      </main>
    );
  }

  /*
  =====================================================
  SUCCESS
  =====================================================
  */

  if (orderPlaced) {
    return (
      <main className="checkout-page">
        <div className="order-success">
          <div className="success-icon">
            <CheckCircle2 size={60} />
          </div>

          <span>
            ORDER CONFIRMED
          </span>

          <h1>Thank You!</h1>

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
              type="button"
              onClick={() =>
                navigate("/")
              }
            >
              Continue Shopping
            </button>

            <button
              type="button"
              className="secondary-success-btn"
              onClick={() =>
                navigate("/profile")
              }
            >
              View My Account
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
  =====================================================
  CHECKOUT PAGE
  =====================================================
  */

  return (
    <main className="checkout-page">
      <div className="checkout-container">

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

          <h1>Checkout</h1>

          <p>
            Complete your details and
            place your order securely.
          </p>
        </div>

        <div className="checkout-layout">

          {/* LEFT */}

          <form
            className="checkout-form"
            onSubmit={handlePlaceOrder}
          >

            {/* CUSTOMER */}

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
                      value={form.name}
                      onChange={handleChange}
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
                      value={form.phone}
                      onChange={handleChange}
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
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Enter email address"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* DELIVERY */}

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

                {/* ADDRESS */}

                <div className="form-group full-width">

                  <label>
                    Complete Address *
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="House no., street, area, landmark..."
                    rows="4"
                  />

                </div>

                {/* CITY */}

                <div className="form-group">

                  <label>
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="City"
                  />

                </div>

                {/* STATE */}

                <div className="form-group">

                  <label>
                    State *
                  </label>

                  <input
                    type="text"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="State"
                  />

                </div>

                {/* PINCODE */}

                <div className="form-group">

                  <label>
                    Pincode *
                  </label>

                  <input
                    type="text"
                    name="pincode"
                    value={form.pincode}
                    onChange={(e) => {
                      const value =
                        e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);

                      handleChange({
                        target: {
                          name: "pincode",
                          value,
                        },
                      });
                    }}
                    placeholder="6 digit pincode"
                    maxLength="6"
                    inputMode="numeric"
                  />

                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={
                        checkDeliveryAvailability
                      }
                      disabled={
                        checkingDelivery ||
                        !/^[1-9][0-9]{5}$/.test(
                          form.pincode
                        )
                      }
                      style={{
                        padding:
                          "10px 14px",

                        border: "none",

                        borderRadius: "8px",

                        cursor:
                          checkingDelivery ||
                          !/^[1-9][0-9]{5}$/.test(
                            form.pincode
                          )
                            ? "not-allowed"
                            : "pointer",

                        opacity:
                          checkingDelivery ||
                          !/^[1-9][0-9]{5}$/.test(
                            form.pincode
                          )
                            ? 0.6
                            : 1,
                      }}
                    >
                      {checkingDelivery
                        ? "Checking..."
                        : "Check Delivery Availability"}
                    </button>
                  </div>

                  {deliveryMessage && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: 600,
                        

                        background:
                          deliveryStatus ===
                          "available"
                            ? "#ecfdf5"
                            : deliveryStatus ===
                              "checking"
                            ? "#eff6ff"
                            : "#a5f1c4",

                        color:
                          deliveryStatus ===
                          "available"
                            ? "#f4f5f5"
                            : deliveryStatus ===
                              "checking"
                            ? "#1d4ed8"
                            : "#060606",
                      }}
                    >
                      {deliveryStatus ===
                      "available"
                        ? "✓ "
                        : ""}

                      {deliveryMessage}
                    </div>
                  )}

                </div>

              </div>
            </section>

            {/* PAYMENT */}

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
                    paymentMethod === "cod"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={
                      paymentMethod === "cod"
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
                    paymentMethod === "online"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={
                      paymentMethod === "online"
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
                    paymentMethod === "business"
                      ? "payment-option active"
                      : "payment-option"
                  }
                >
                  <input
                    type="radio"
                    name="payment"
                    value="business"
                    checked={
                      paymentMethod === "business"
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

            {/* PLACE ORDER */}

            <button
              type="submit"
              className="place-order-btn"
              disabled={checkingDelivery}
              style={{
                opacity:
                  checkingDelivery
                    ? 0.6
                    : 1,

                cursor:
                  checkingDelivery
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {checkingDelivery
                ? "Checking Address..."
                : paymentMethod === "online"
                ? "Continue to Payment"
                : "Place Order"}

              <ArrowRight size={18} />
            </button>

          </form>

          {/* RIGHT SUMMARY */}

          <aside className="checkout-summary">

            <h2>
              Order Summary
            </h2>

            <div className="checkout-products">

              {cart.map(
                (item, index) => {
                  const price =
                    Number(item.price) || 0;

                  const quantity =
                    Number(item.quantity) || 1;

                  const itemTotal =
                    price * quantity;

                  const image =
                    item.image ||
                    item.images?.[0] ||
                    "";

                  return (
                    <div
                      className="checkout-product"
                      key={`${
                        item.productId ||
                        item.id ||
                        "product"
                      }-${index}`}
                    >

                      <div className="checkout-product-image">

                        {image ? (
                          <img
                            src={image}
                            alt={
                              item.name ||
                              "Product"
                            }
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              background:
                                "#f1f5f9",
                              color:
                                "#64748b",
                            }}
                          >
                            <ShoppingBag
                              size={25}
                            />
                          </div>
                        )}

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
                          )}{" "}
                          × {quantity}
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

              <ShieldCheck size={16} />

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
