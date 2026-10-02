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
import { saveOrderToServer } from "../services/orderApi";
import { fetchProducts, isActiveProduct, saveCustomizeSelection } from "../services/productApi";

// ============================================================
// HELPERS
// ============================================================

const getImage = (item) => {
  if (!item) return "";

  if (item.image) {
    return item.image;
  }

  if (
    Array.isArray(item.images) &&
    item.images.length > 0
  ) {
    return item.images[0];
  }

  return "";
};

const getProductId = (item) =>
  item?.originalProductId ||
  item?.productId ||
  item?.id ||
  "";

const getQuantity = (item) => {
  const quantity = Number(item?.quantity);

  return quantity > 0
    ? quantity
    : Math.max(1, Number(item?.quantityStep) || 1);
};

const getQuantityStep = (item) =>
  Math.max(1, Number(item?.quantityStep) || 1);

const getPrice = (item) => {
  const price = Number(item?.price);

  return Number.isFinite(price) ? price : 0;
};

const getItemTotal = (item) =>
  getPrice(item) * getQuantity(item);

const isItemCustomized = (item) =>
  Boolean(
    item?.isCustomized ||
    item?.customized ||
    item?.logo ||
    item?.text
  );

/* extract labeled text fields from the business-card
   design — for the cart summary (Name/Designation/Company) */
const getCardFieldSummary = (item) => {
  const elements =
    item?.customization?.frontDesign?.elements ||
    item?.frontDesign?.elements ||
    [];

  if (!Array.isArray(elements)) return [];

  const wanted = [
    "Name",
    "Designation",
    "Company",
    "Company Name",
    "Phone",
  ];

  return elements
    .filter(
      (el) =>
        el?.type === "text" &&
        wanted.includes(el.label) &&
        String(el.text || "").trim() !== ""
    )
    .slice(0, 4)
    .map((el) => ({
      label: el.label,
      text: String(el.text),
    }));
};

// ============================================================
// CREATE PRODUCT SNAPSHOT
// ============================================================
// Save complete product data inside the order so
// OrderDetails correctly receives image, price,
// quantity, amount etc.
// ============================================================

const createProductSnapshot = (item) => {
  const price = getPrice(item);
  const quantity = getQuantity(item);
  const image = getImage(item);

  const itemTotal = price * quantity;

  return {
    // --------------------------------------------------------
    // IDs
    // --------------------------------------------------------

    id:
      item?.id ||
      item?.productId ||
      item?.originalProductId ||
      `product-${Date.now()}`,

    productId:
      getProductId(item),

    originalProductId:
      item?.originalProductId ||
      item?.productId ||
      item?.id ||
      "",

    // --------------------------------------------------------
    // PRODUCT INFO
    // --------------------------------------------------------

    name:
      item?.name ||
      item?.productName ||
      "Untitled Product",

    productName:
      item?.productName ||
      item?.name ||
      "Untitled Product",

    category:
      item?.category ||
      "General",

    subcategory:
      item?.subcategory ||
      "",

    paperType:
      item?.paperType ||
      "",

    size:
      item?.size ||
      "Standard",

    color:
      item?.color ||
      "",

    side:
      item?.side ||
      "front",

    // --------------------------------------------------------
    // IMAGE
    // --------------------------------------------------------

    image,

    images:
      Array.isArray(item?.images)
        ? item.images
        : image
        ? [image]
        : [],

    // --------------------------------------------------------
    // PRICE
    // --------------------------------------------------------

    price,

    quantity,

    total: itemTotal,

    itemTotal,

    amount: itemTotal,

    // --------------------------------------------------------
    // CUSTOMIZATION
    // --------------------------------------------------------

    customized:
      isItemCustomized(item),

    isCustomized:
      isItemCustomized(item),

    logo:
      item?.logo ||
      null,

    logoPosition:
      item?.logoPosition ||
      null,

    logoSize:
      item?.logoSize ||
      null,

    text:
      item?.text ||
      "",

    textColor:
      item?.textColor ||
      "",

    fontFamily:
      item?.fontFamily ||
      "Poppins",

    fontSize:
      Number(item?.fontSize) || 25,

    bold:
      Boolean(item?.bold),

    italic:
      Boolean(item?.italic),

    underline:
      Boolean(item?.underline),

    textPosition:
      item?.textPosition ||
      null,

    customization:
      item?.customization ||
      null,

    customizationType:
      item?.customizationType ||
      "",

    frontDesign:
      item?.frontDesign ||
      null,

    backDesign:
      item?.backDesign ||
      null,

    template:
      item?.template ||
      null,

    uploadedDesign:
      item?.uploadedDesign ||
      null,

    uploadedDesigns:
      item?.uploadedDesigns ||
      [],
  };
};

// ============================================================
// PRODUCT PREVIEW
// ============================================================

function CartProductPreview({
  item,
  onPreview,
}) {
  const image = getImage(item);

  const isCustomized =
    isItemCustomized(item);

  const logoX =
    Number(item?.logoPosition?.x) || 50;

  const logoY =
    Number(item?.logoPosition?.y) || 31;

  const textX =
    Number(item?.textPosition?.x) || 50;

  const textY =
    Number(item?.textPosition?.y) || 55;

  const logoSize =
    Number(item?.logoSize) || 115;

  const textFontSize =
    Number(item?.fontSize) || 25;

  return (
    <div
      className="cart-design-preview"
      onClick={() => onPreview(item)}
    >
      {/* PRODUCT IMAGE */}

      {image ? (
        <img
          src={image}
          alt={
            item?.name ||
            item?.productName ||
            "Product"
          }
          className="cart-product-image"
        />
      ) : (
        <div
          className="cart-product-fallback"
          style={{
            background:
              item?.color ||
              "#ffffff",
          }}
        />
      )}

      {/* CUSTOMIZATION */}

      {isCustomized && (
        <div className="cart-customization-layer">

          {/* LOGO */}

          {item?.logo &&
            item?.side !== "back" && (
              <div
                className="cart-logo-overlay"
                style={{
                  left: `${logoX}%`,
                  top: `${logoY}%`,
                  width: `${logoSize}px`,
                }}
              >
                <img
                  src={item.logo}
                  alt="Custom Logo"
                />
              </div>
            )}

          {/* TEXT */}

          {item?.text &&
            item?.side !== "back" && (
              <div
                className="cart-text-overlay"
                style={{
                  left: `${textX}%`,
                  top: `${textY}%`,
                  color:
                    item?.textColor ||
                    "#102a4c",
                  fontSize:
                    `${textFontSize}px`,
                  fontFamily:
                    item?.fontFamily ||
                    "Poppins",
                  fontWeight:
                    item?.bold
                      ? 700
                      : 400,
                  fontStyle:
                    item?.italic
                      ? "italic"
                      : "normal",
                  textDecoration:
                    item?.underline
                      ? "underline"
                      : "none",
                }}
              >
                {item.text}
              </div>
            )}

        </div>
      )}

      {/* ZOOM */}

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

  const image = getImage(item);

  const logoX =
    Number(item?.logoPosition?.x) || 50;

  const logoY =
    Number(item?.logoPosition?.y) || 31;

  const textX =
    Number(item?.textPosition?.x) || 50;

  const textY =
    Number(item?.textPosition?.y) || 55;

  const logoSize =
    Number(item?.logoSize) || 115;

  const textFontSize =
    Number(item?.fontSize) || 25;

  return (
    <div
      className="product-preview-overlay"
      onClick={onClose}
    >
      <div
        className="product-preview-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* CLOSE */}

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
              {item?.name ||
                item?.productName ||
                "Product"}
            </h2>

          </div>
        </div>

        {/* LARGE IMAGE */}

        <div className="large-product-preview">

          {image ? (
            <img
              src={image}
              alt={
                item?.name ||
                "Product"
              }
              className="large-product-image"
            />
          ) : (
            <div
              className="large-product-fallback"
              style={{
                background:
                  item?.color ||
                  "#ffffff",
              }}
            />
          )}

          {/* CUSTOMIZATION */}

          <div className="large-customization-layer">

            {item?.logo &&
              item?.side !== "back" && (
                <div
                  className="large-logo-overlay"
                  style={{
                    left: `${logoX}%`,
                    top: `${logoY}%`,
                    width: `${logoSize}px`,
                  }}
                >
                  <img
                    src={item.logo}
                    alt="Custom Logo"
                  />
                </div>
              )}

            {item?.text &&
              item?.side !== "back" && (
                <div
                  className="large-text-overlay"
                  style={{
                    left: `${textX}%`,
                    top: `${textY}%`,
                    color:
                      item?.textColor ||
                      "#102a4c",
                    fontSize:
                      `${textFontSize}px`,
                    fontFamily:
                      item?.fontFamily ||
                      "Poppins",
                    fontWeight:
                      item?.bold
                        ? 700
                        : 400,
                    fontStyle:
                      item?.italic
                        ? "italic"
                        : "normal",
                    textDecoration:
                      item?.underline
                        ? "underline"
                        : "none",
                  }}
                >
                  {item.text}
                </div>
              )}

          </div>
        </div>

        {/* DETAILS */}

        <div className="preview-product-details">

          <div>
            <span>Product</span>

            <strong>
              {item?.name ||
                item?.productName ||
                "Product"}
            </strong>
          </div>

          <div>
            <span>Size</span>

            <strong>
              {item?.size ||
                "Standard"}
            </strong>
          </div>

          {item?.color && (
            <div>

              <span>
                Color
              </span>

              <strong className="preview-color">

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

          {item?.logo && (
            <div>
              <span>Logo</span>
              <strong>Added</strong>
            </div>
          )}

          {item?.text && (
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

        {/* CLOSE BUTTON */}

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
// CART COMPONENT
// ============================================================

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] =
    useState([]);

  const [
    previewProduct,
    setPreviewProduct,
  ] = useState(null);

  const [
    orderingProduct,
    setOrderingProduct,
  ] = useState(null);

  const [
    orderMessage,
    setOrderMessage,
  ] = useState("");

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
          ? JSON.parse(savedCart)
          : [];

      setCart(
        Array.isArray(parsedCart)
          ? parsedCart
          : []
      );
    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      setCart([]);
    }
  };

  // ==========================================================
  // REFRESH CART PRICES FROM DATABASE
  // Avoid stale prices in the cart; latest DB price is used
  // ==========================================================

  const refreshCartPrices = async () => {
    try {
      const products = await fetchProducts();

      if (!Array.isArray(products) || products.length === 0) {
        return;
      }

      const productMap = new Map(
        products.map((p) => [String(p.id), p])
      );

      const savedCart = localStorage.getItem("ananyaCart");
      const currentCart = savedCart ? JSON.parse(savedCart) : [];

      if (!Array.isArray(currentCart)) {
        return;
      }

      let changed = false;

      const updatedCart = currentCart.reduce(
        (acc, item) => {
          const pid = String(
            item.productId ||
              item.originalProductId ||
              item.id ||
              ""
          );

          const current = productMap.get(pid);

          if (!current || !isActiveProduct(current)) {
            changed = true;
            return acc;
          }

          const currentPrice = Number(
            current.price || 0
          );

          if (
            Number(item.price) !== currentPrice ||
            item.status === "Inactive"
          ) {
            changed = true;
          }

          acc.push({
            ...item,
            price: currentPrice,
            name: current.name || item.name,
            image:
              getImage(current) ||
              item.image,
            category:
              current.category ||
              item.category,
            status: current.status,
          });

          return acc;
        },
        []
      );

      if (changed) {
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
      }
    } catch (error) {
      console.error(
        "Cart price refresh error:",
        error
      );
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    loadCart();
    refreshCartPrices();

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

  // ==========================================================
  // ESC CLOSE PREVIEW
  // ==========================================================

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setPreviewProduct(null);
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

  const saveCart = (updatedCart) => {
    setCart(updatedCart);

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

  const increaseQuantity = (index) => {
    const updatedCart = [
      ...cart,
    ];

    const item =
      updatedCart[index];

    const currentQuantity =
      getQuantity(item);

    const step =
      getQuantityStep(item);

    updatedCart[index] = {
      ...item,

      quantity:
        currentQuantity + step,
    };

    saveCart(updatedCart);
  };

  // ==========================================================
  // DECREASE
  // ==========================================================

  const decreaseQuantity = (index) => {
    const updatedCart = [
      ...cart,
    ];

    const item =
      updatedCart[index];

    const currentQuantity =
      getQuantity(item);

    const step =
      getQuantityStep(item);

    updatedCart[index] = {
      ...item,

      quantity:
        Math.max(
          step,
          currentQuantity - step
        ),
    };

    saveCart(updatedCart);
  };

  // ==========================================================
  // DIRECT QUANTITY INPUT — type/paste; min = quantityStep
  // ==========================================================

  const setItemQuantity = (index, rawValue) => {
    if (
      rawValue !== "" &&
      !/^\d+$/.test(rawValue)
    ) {
      return;
    }

    const updatedCart = [
      ...cart,
    ];

    const item = updatedCart[index];
    const step = getQuantityStep(item);

    const parsed = Math.floor(
      Number(rawValue)
    );

    if (
      rawValue === "" ||
      !Number.isFinite(parsed) ||
      parsed <= 0
    ) {
      /* invalid/empty -> min step pe reset */
      updatedCart[index] = {
        ...item,
        quantity: step,
      };
      saveCart(updatedCart);
      return;
    }

    updatedCart[index] = {
      ...item,
      quantity: Math.max(step, parsed),
    };

    saveCart(updatedCart);
  };

  // ==========================================================
  // REMOVE
  // ==========================================================

  const removeItem = (index) => {
    const updatedCart =
      cart.filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

    saveCart(updatedCart);
  };

  // ==========================================================
  // CLEAR CART
  // ==========================================================

  const clearCart = () => {
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
  // GET CURRENT USER
  // ==========================================================

  const getCurrentUser = () => {
    try {
      const savedUser =
        localStorage.getItem(
          "currentUser"
        );

      if (!savedUser) {
        return null;
      }

      return JSON.parse(
        savedUser
      );
    } catch (error) {
      console.error(
        "User loading error:",
        error
      );

      return null;
    }
  };

  // ==========================================================
  // GET EXISTING ORDERS
  // ==========================================================

  const getExistingOrders = () => {
    try {
      const savedOrders =
        localStorage.getItem(
          "ananyaOrders"
        );

      if (!savedOrders) {
        return [];
      }

      const parsed =
        JSON.parse(
          savedOrders
        );

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch (error) {
      console.error(
        "Orders loading error:",
        error
      );

      return [];
    }
  };

  // ==========================================================
  // ORDER NOW
  // ==========================================================

  const handleOrderNow = (item) => {
    if (orderingProduct !== null) {
      return;
    }

    const itemId =
      item?.id ||
      item?.productId ||
      item?.originalProductId;

    setOrderingProduct(itemId);

    // --------------------------------------------------------
    // USER
    // --------------------------------------------------------

    const currentUser =
      getCurrentUser();

    const adminLoggedIn =
      localStorage.getItem(
        "adminLoggedIn"
      ) === "true";

    // --------------------------------------------------------
    // LOGIN CHECK
    // --------------------------------------------------------

    if (
      !currentUser &&
      !adminLoggedIn
    ) {
      setOrderingProduct(null);

      navigate(
        "/login",
        {
          state: {
            redirectTo:
              "/cart",

            orderProduct:
              item,
          },
        }
      );

      return;
    }

    // --------------------------------------------------------
    // CUSTOMER
    // --------------------------------------------------------

    const customer = {
      name:
        currentUser?.name ||
        currentUser?.fullName ||
        currentUser?.username ||
        "Customer",

      email:
        currentUser?.email ||
        "",

      phone:
        currentUser?.phone ||
        currentUser?.mobile ||
        "",
    };

    // --------------------------------------------------------
    // PRODUCT
    // --------------------------------------------------------

    const product =
      createProductSnapshot(
        item
      );

    // --------------------------------------------------------
    // UNIQUE ORDER ID
    // --------------------------------------------------------

    const orderId =
      `ORD-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 7)
        .toUpperCase()}`;

    // --------------------------------------------------------
    // CREATE ORDER
    // --------------------------------------------------------

    const order = {
      // ======================================================
      // ORDER IDs
      // ======================================================

      id: orderId,

      orderId,

      orderNumber:
        orderId,

      // ======================================================
      // PRODUCT DATA
      // ======================================================

      items: [
        product,
      ],

      products: [
        product,
      ],

      // Single product compatibility
      productId:
        product.productId,

      productName:
        product.productName,

      name:
        product.name,

      category:
        product.category,

      subcategory:
        product.subcategory,

      paperType:
        product.paperType,

      image:
        product.image,

      images:
        product.images,

      price:
        product.price,

      quantity:
        product.quantity,

      total:
        product.total,

      itemTotal:
        product.itemTotal,

      size:
        product.size,

      color:
        product.color,

      side:
        product.side,

      customized:
        product.customized,

      isCustomized:
        product.isCustomized,

      logo:
        product.logo,

      logoPosition:
        product.logoPosition,

      logoSize:
        product.logoSize,

      text:
        product.text,

      textColor:
        product.textColor,

      fontFamily:
        product.fontFamily,

      fontSize:
        product.fontSize,

      bold:
        product.bold,

      italic:
        product.italic,

      underline:
        product.underline,

      textPosition:
        product.textPosition,

      customization:
        product.customization,

      customizationType:
        product.customizationType,

      frontDesign:
        product.frontDesign,

      backDesign:
        product.backDesign,

      template:
        product.template,

      uploadedDesign:
        product.uploadedDesign,

      uploadedDesigns:
        product.uploadedDesigns || [],

      // ======================================================
      // CUSTOMER
      // ======================================================

      customer,

      customerName:
        customer.name,

      customerEmail:
        customer.email,

      customerPhone:
        customer.phone,

      // ======================================================
      // TOTALS
      // ======================================================

      subtotal:
        product.total,

      shipping:
        0,

      shippingCharge:
        0,

      discount:
        0,

      totalAmount:
        product.total,

      grandTotal:
        product.total,

      // ======================================================
      // STATUS
      // ======================================================

      status:
        "New",

      paymentStatus:
        "Pending",

      paymentMethod:
        "Not Selected",

      // ======================================================
      // NOTIFICATION
      // ======================================================

      notification:
        true,

      notificationRead:
        false,

      // ======================================================
      // DATES
      // ======================================================

      createdAt:
        new Date().toISOString(),

      updatedAt:
        new Date().toISOString(),
    };

    // --------------------------------------------------------
    // SAVE ORDER
    // --------------------------------------------------------

    const existingOrders =
      getExistingOrders();

    const updatedOrders = [
      order,
      ...existingOrders,
    ];

    /* strip heavy base64 data before persisting to
       localStorage — keeps ananyaOrders under quota.
       Full design data goes to server via saveOrderToServer. */
    const lightOrder = JSON.parse(
      JSON.stringify(order)
    );

    /* slim down uploadedDesigns to metadata only */
    if (Array.isArray(lightOrder.uploadedDesigns)) {
      lightOrder.uploadedDesigns =
        lightOrder.uploadedDesigns.map((d) => ({
          name: d.name,
          type: d.type,
          size: d.size,
        }));
    }
    if (lightOrder.uploadedDesign?.dataUrl) {
      const { dataUrl, ...meta } =
        lightOrder.uploadedDesign;
      lightOrder.uploadedDesign = meta;
    }

    /* slim down card designer data */
    const stripElements = (design) => {
      if (!design?.elements) return design;
      return {
        ...design,
        elements: design.elements.map((el) => {
          if (el.type === "image" && el.src?.length > 500) {
            return { ...el, src: "[uploaded]" };
          }
          return el;
        }),
      };
    };
    if (lightOrder.frontDesign) {
      lightOrder.frontDesign =
        stripElements(lightOrder.frontDesign);
    }
    if (lightOrder.backDesign) {
      lightOrder.backDesign =
        stripElements(lightOrder.backDesign);
    }

    try {
      localStorage.setItem(
        "ananyaOrders",
        JSON.stringify(updatedOrders.map((o, i) =>
          i === 0 ? lightOrder : o
        ))
      );
    } catch {
      /* quota still exceeded — keep only recent orders */
      try {
        localStorage.setItem(
          "ananyaOrders",
          JSON.stringify([lightOrder])
        );
      } catch {
        /* cannot persist locally at all — server is source of truth */
      }
    }

    // save full order to DB — server is the authoritative record
    saveOrderToServer(order);

    // --------------------------------------------------------
    // EVENTS
    // --------------------------------------------------------

    window.dispatchEvent(
      new CustomEvent(
        "ananyaOrderCreated",
        {
          detail: order,
        }
      )
    );

    window.dispatchEvent(
      new Event(
        "ordersUpdated"
      )
    );

    window.dispatchEvent(
      new Event(
        "notificationsUpdated"
      )
    );

    // --------------------------------------------------------
    // SUCCESS MESSAGE
    // --------------------------------------------------------

    setOrderMessage(
      `Order ${order.id} created successfully!`
    );

    // --------------------------------------------------------
    // GO CHECKOUT
    // --------------------------------------------------------

    setTimeout(() => {
      setOrderingProduct(
        null
      );

      navigate(
        "/checkout",
        {
          state: {
            directOrder:
              order,

            cart: [
              item,
            ],

            totalPrice:
              product.total,

            totalQuantity:
              product.quantity,

            user:
              currentUser,

            orderId:
              order.id,
          },
        }
      );
    }, 700);
  };

  // ==========================================================
  // TOTALS
  // ==========================================================

  const totalProducts =
    cart.length;

  const totalQuantity =
    cart.reduce(
      (total, item) =>
        total +
        getQuantity(item),
      0
    );

  const totalPrice =
    cart.reduce(
      (total, item) =>
        total +
        getItemTotal(item),
      0
    );

  // ==========================================================
  // OPEN PRODUCT
  // ==========================================================

  const openProduct = (item) => {
    const productId =
      getProductId(item);

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
  // EDIT DESIGN — reopen the cart item's saved design in the editor
  // ==========================================================

  const editCardDesign = (item) => {
    const pid =
      item?.productId ||
      item?.originalProductId;

    if (!pid) return;

    /* BusinessCardCustomizer saved design isi key se load karta hai */
    try {
      localStorage.setItem(
        `businessCardDesign-${pid}`,
        JSON.stringify({
          productId: pid,
          frontDesign:
            item.frontDesign ||
            item.customization?.frontDesign ||
            null,
          backDesign:
            item.backDesign ||
            item.customization?.backDesign ||
            null,
          template:
            item.template ||
            item.customization?.template ||
            null,
          quantity: item.quantity,
        })
      );
    } catch {
      /* ignore */
    }

    /* lean selection — the item's design objects must not
       go into localStorage via the product payload */
    saveCustomizeSelection(
      { ...item, id: pid },
      {
        customizationType:
          item.customizationType || "business-card",
      }
    );

    navigate("/customize");
  };

  // ==========================================================
  // CHECKOUT ALL
  // ==========================================================

  const handleCheckout = () => {
    if (cart.length === 0) {
      return;
    }

    const currentUser =
      getCurrentUser();

    const adminLoggedIn =
      localStorage.getItem(
        "adminLoggedIn"
      ) === "true";

    // --------------------------------------------------------
    // USER ALREADY LOGGED IN
    // --------------------------------------------------------

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

    // --------------------------------------------------------
    // LOGIN FIRST
    // --------------------------------------------------------

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

  if (cart.length === 0) {
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
  // MAIN
  // ==========================================================

  return (
    <main className="cart-page">

      <div className="cart-container">

        {/* ==================================================
            SUCCESS MESSAGE
        ================================================== */}

        {orderMessage && (
          <div className="order-success-message">

            <span>
              ✓
            </span>

            <div>

              <strong>
                {orderMessage}
              </strong>

              <small>
                Redirecting to checkout...
              </small>

            </div>

          </div>
        )}

        {/* ==================================================
            HEADER
        ================================================== */}

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
            onClick={clearCart}
          >
            Clear Cart
          </button>

        </div>

        {/* ==================================================
            CART LAYOUT
        ================================================== */}

        <div className="cart-layout">

          {/* =================================================
              CART ITEMS
          ================================================= */}

          <div className="cart-items">

            {cart.map(
              (item, index) => {

                const price =
                  getPrice(item);

                const quantity =
                  getQuantity(item);

                const itemTotal =
                  getItemTotal(item);

                const customized =
                  isItemCustomized(item);

                const itemId =
                  item?.id ||
                  item?.productId ||
                  item?.originalProductId ||
                  index;

                const isOrdering =
                  orderingProduct ===
                  itemId;

                return (
                  <div
                    className={
                      customized
                        ? "cart-item customized-cart-item"
                        : "cart-item"
                    }
                    key={`${itemId}-${index}`}
                  >

                    {/* ======================================
                        IMAGE
                    ====================================== */}

                    <div className="cart-image">

                      <CartProductPreview
                        item={item}
                        onPreview={
                          setPreviewProduct
                        }
                      />

                    </div>

                    {/* ======================================
                        PRODUCT INFO
                    ====================================== */}

                    <div className="cart-info">

                      <span className="cart-category">
                        {item?.category ||
                          "General"}
                      </span>

                      <h3
                        onClick={() =>
                          openProduct(
                            item
                          )
                        }
                      >
                        {item?.name ||
                          item?.productName ||
                          "Untitled Product"}
                      </h3>

                      {/* dynamic attributes (Size/Material/
                          Capacity/Paper Type...) */}
                      {item?.attributes &&
                      Object.keys(item.attributes).length > 0 ? (
                        Object.entries(item.attributes).map(
                          ([k, v]) => (
                            <p key={k}>
                              {k}: {String(v)}
                            </p>
                          )
                        )
                      ) : (
                        <>
                          {item?.size && (
                            <p>
                              Size: {item.size}
                            </p>
                          )}
                          {item?.paperType && (
                            <p>
                              Paper Type: {item.paperType}
                            </p>
                          )}
                        </>
                      )}

                      {item?.color && (
                        <p>
                          Color:{" "}
                          {item.color}
                        </p>
                      )}

                      {/* CUSTOMIZATION */}

                      {customized && (
                        <div className="customization-info">

                          <div>

                            <Palette
                              size={14}
                            />

                            {item?.customizationType === "business-card"
                              ? "Customized Design"
                              : "Customized"}

                          </div>

                          {item?.logo && (
                            <span>

                              <ImageIcon
                                size={13}
                              />

                              Logo

                            </span>
                          )}

                          {item?.text && (
                            <span>

                              <Type
                                size={13}
                              />

                              Text

                            </span>
                          )}

                        </div>
                      )}

                      {/* CARD FIELD SUMMARY + EDIT DESIGN */}

                      {customized &&
                        item?.customizationType ===
                          "business-card" && (
                          <div className="card-design-summary">

                            {getCardFieldSummary(
                              item
                            ).map((f) => (
                              <p key={f.label}>
                                {f.label}: {f.text}
                              </p>
                            ))}

                            <button
                              type="button"
                              className="edit-design-btn"
                              onClick={() =>
                                editCardDesign(item)
                              }
                            >
                              ✏️ Edit Design
                            </button>

                          </div>
                        )}

                      {/* PRICE */}

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

                    {/* ======================================
                        QUANTITY
                    ====================================== */}

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
                          getQuantityStep(item)
                        }
                      >
                        <Minus
                          size={15}
                        />
                      </button>

                      <input
                        type="number"
                        min={getQuantityStep(item)}
                        value={quantity}
                        onChange={(e) => {
                          /* digits only; commit on valid */
                          if (
                            e.target.value !== "" &&
                            /^\d+$/.test(e.target.value)
                          ) {
                            setItemQuantity(
                              index,
                              e.target.value
                            );
                          } else if (
                            e.target.value === ""
                          ) {
                            /* allow clearing for typing */
                            const updatedCart = [...cart];
                            updatedCart[index] = {
                              ...item,
                              quantity: "",
                            };
                            setCart(updatedCart);
                          }
                        }}
                        onBlur={(e) =>
                          setItemQuantity(
                            index,
                            e.target.value
                          )
                        }
                        aria-label="Quantity"
                        style={{
                          width: "60px",
                          textAlign: "center",
                          fontWeight: 600,
                        }}
                      />

                      <span
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                        }}
                      >
                        {item.unit || "Pieces"}
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

                    {/* ======================================
                        TOTAL
                    ====================================== */}

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

                      {/* ORDER NOW */}

                      <button
                        type="button"
                        className="order-now-btn"
                        onClick={() =>
                          handleOrderNow(
                            item
                          )
                        }
                        disabled={
                          orderingProduct !==
                          null
                        }
                      >
                        {isOrdering ? (
                          "Placing Order..."
                        ) : (
                          <>
                            Order Now

                            <ArrowRight
                              size={16}
                            />
                          </>
                        )}
                      </button>

                      {/* REMOVE */}

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          removeItem(
                            index
                          )
                        }
                        aria-label="Remove product"
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
              SUMMARY
          ================================================= */}

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

      {/* ====================================================
          PREVIEW MODAL
      ==================================================== */}

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
