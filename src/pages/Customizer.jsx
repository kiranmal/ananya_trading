import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowLeft,
  UploadCloud,
  Type,
  Palette,
  Move,
  Layers,
  Trash2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ShoppingCart,
  Heart,
  X,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RefreshCcw,
  CheckCircle,
  FileText,
  MessageSquare,
  Info,
  PackageCheck,
  ClipboardList,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Customizer.css";

function Customizer() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  /* =====================================================
     SELECTED PRODUCT
  ===================================================== */

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  useEffect(() => {
    const savedProduct =
      localStorage.getItem(
        "selectedCustomizeProduct"
      );

    if (!savedProduct) {
      return;
    }

    try {
      const product =
        JSON.parse(savedProduct);

      setSelectedProduct(product);

      if (product?.color) {
        setProductColor(product.color);
      }
    } catch (error) {
      console.error(
        "Selected product load error:",
        error
      );
    }
  }, []);

  /* =====================================================
     BASIC STATES
  ===================================================== */

  const [activeTool, setActiveTool] =
    useState("text");

  const [side, setSide] =
    useState("front");

  const [productColor, setProductColor] =
    useState("#ffffff");

  const [size, setSize] =
    useState("M");

  const [zoom, setZoom] =
    useState(1);

  /* =====================================================
     CUSTOMER DESCRIPTION / NOTE
  ===================================================== */

  const [
    customerDescription,
    setCustomerDescription,
  ] = useState("");

  const [
    customerNote,
    setCustomerNote,
  ] = useState("");

  const [cartSuccess, setCartSuccess] =
    useState(false);

  const [orderSuccess, setOrderSuccess] =
    useState(false);

  const [isPlacingOrder, setIsPlacingOrder] =
    useState(false);

  /* =====================================================
     LOGO
  ===================================================== */

  const [logo, setLogo] =
    useState(null);

  const [logoPosition, setLogoPosition] =
    useState({
      x: 50,
      y: 31,
    });

  const [logoSize, setLogoSize] =
    useState(115);

  /* =====================================================
     TEXT
  ===================================================== */

  const [text, setText] =
    useState("ANANYA TRADING");

  const [textPosition, setTextPosition] =
    useState({
      x: 50,
      y: 55,
    });

  const [fontSize, setFontSize] =
    useState(25);

  const [fontFamily, setFontFamily] =
    useState("Poppins");

  const [textColor, setTextColor] =
    useState("#102a4c");

  const [bold, setBold] =
    useState(true);

  const [italic, setItalic] =
    useState(false);

  const [underline, setUnderline] =
    useState(false);

  /* =====================================================
     HISTORY
  ===================================================== */

  const [history, setHistory] =
    useState([]);

  const [future, setFuture] =
    useState([]);

  /* =====================================================
     PRICE
  ===================================================== */

  const basePrice =
    Number(selectedProduct?.price) || 599;

  const customizationPrice =
    Number(
      selectedProduct?.customizationPrice
    ) || 199;

  const totalPrice =
    basePrice + customizationPrice;

  /* =====================================================
     PRODUCT
  ===================================================== */

  const productType =
    selectedProduct?.type ||
    "tshirt";

  const isHoodie =
    productType
      .toLowerCase() === "hoodie";

  const productName =
    selectedProduct?.name ||
    "Custom Product";

  const productImage =
    selectedProduct?.image ||
    selectedProduct?.img ||
    selectedProduct?.productImage ||
    selectedProduct?.thumbnail ||
    "";

  /* =====================================================
     CURRENT DESIGN STATE
  ===================================================== */

  const getCurrentState = () => {
    return {
      logo,

      logoPosition: {
        ...logoPosition,
      },

      logoSize,

      text,

      textPosition: {
        ...textPosition,
      },

      fontSize,

      fontFamily,

      textColor,

      bold,

      italic,

      underline,

      productColor,

      size,

      side,
    };
  };

  /* =====================================================
     HISTORY
  ===================================================== */

  const saveHistory = () => {
    setHistory((prev) => [
      ...prev.slice(-20),
      getCurrentState(),
    ]);

    setFuture([]);
  };

  const restoreState = (state) => {
    if (!state) {
      return;
    }

    setLogo(state.logo || null);

    setLogoPosition(
      state.logoPosition || {
        x: 50,
        y: 31,
      }
    );

    setLogoSize(
      state.logoSize || 115
    );

    setText(
      state.text ?? ""
    );

    setTextPosition(
      state.textPosition || {
        x: 50,
        y: 55,
      }
    );

    setFontSize(
      state.fontSize || 25
    );

    setFontFamily(
      state.fontFamily || "Poppins"
    );

    setTextColor(
      state.textColor || "#102a4c"
    );

    setBold(
      state.bold ?? true
    );

    setItalic(
      state.italic ?? false
    );

    setUnderline(
      state.underline ?? false
    );

    setProductColor(
      state.productColor || "#ffffff"
    );

    setSize(
      state.size || "M"
    );

    setSide(
      state.side || "front"
    );
  };

  const undo = () => {
    if (history.length === 0) {
      return;
    }

    const previous =
      history[history.length - 1];

    setFuture((prev) => [
      ...prev,
      getCurrentState(),
    ]);

    setHistory((prev) =>
      prev.slice(0, -1)
    );

    restoreState(previous);
  };

  const redo = () => {
    if (future.length === 0) {
      return;
    }

    const next =
      future[future.length - 1];

    setHistory((prev) => [
      ...prev,
      getCurrentState(),
    ]);

    setFuture((prev) =>
      prev.slice(0, -1)
    );

    restoreState(next);
  };

  /* =====================================================
     LOGO UPLOAD
  ===================================================== */

  const handleLogoUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "Please select a valid image."
      );

      event.target.value = "";

      return;
    }

    saveHistory();

    const reader =
      new FileReader();

    reader.onload = (e) => {
      setLogo(
        e.target.result
      );

      setLogoPosition({
        x: 50,
        y: 31,
      });

      setLogoSize(115);
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const deleteLogo = () => {
    if (!logo) {
      return;
    }

    saveHistory();

    setLogo(null);
  };

  /* =====================================================
     LOGO DRAG
  ===================================================== */

  const handleLogoMouseDown = (
    event
  ) => {
    event.preventDefault();

    const printArea =
      event.currentTarget.closest(
        ".print-area"
      );

    if (!printArea) {
      return;
    }

    const container =
      printArea.getBoundingClientRect();

    const startX =
      event.clientX;

    const startY =
      event.clientY;

    const initialX =
      logoPosition.x;

    const initialY =
      logoPosition.y;

    const handleMove = (
      moveEvent
    ) => {
      const dx =
        ((moveEvent.clientX -
          startX) /
          container.width) *
        100;

      const dy =
        ((moveEvent.clientY -
          startY) /
          container.height) *
        100;

      setLogoPosition({
        x: Math.max(
          10,
          Math.min(
            90,
            initialX + dx
          )
        ),

        y: Math.max(
          5,
          Math.min(
            90,
            initialY + dy
          )
        ),
      });
    };

    const handleUp = () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      window.removeEventListener(
        "mouseup",
        handleUp
      );
    };

    window.addEventListener(
      "mousemove",
      handleMove
    );

    window.addEventListener(
      "mouseup",
      handleUp
    );
  };

  /* =====================================================
     LOGO RESIZE
  ===================================================== */

  const handleLogoResize = (
    event
  ) => {
    event.preventDefault();
    event.stopPropagation();

    const startX =
      event.clientX;

    const initialSize =
      logoSize;

    const handleMove = (
      moveEvent
    ) => {
      const difference =
        moveEvent.clientX -
        startX;

      const newSize =
        initialSize +
        difference;

      setLogoSize(
        Math.max(
          50,
          Math.min(
            240,
            newSize
          )
        )
      );
    };

    const handleUp = () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      window.removeEventListener(
        "mouseup",
        handleUp
      );
    };

    window.addEventListener(
      "mousemove",
      handleMove
    );

    window.addEventListener(
      "mouseup",
      handleUp
    );
  };

  /* =====================================================
     TEXT DRAG
  ===================================================== */

  const handleTextMouseDown = (
    event
  ) => {
    event.preventDefault();

    const printArea =
      event.currentTarget.closest(
        ".print-area"
      );

    if (!printArea) {
      return;
    }

    const container =
      printArea.getBoundingClientRect();

    const startX =
      event.clientX;

    const startY =
      event.clientY;

    const initialX =
      textPosition.x;

    const initialY =
      textPosition.y;

    const handleMove = (
      moveEvent
    ) => {
      const dx =
        ((moveEvent.clientX -
          startX) /
          container.width) *
        100;

      const dy =
        ((moveEvent.clientY -
          startY) /
          container.height) *
        100;

      setTextPosition({
        x: Math.max(
          5,
          Math.min(
            95,
            initialX + dx
          )
        ),

        y: Math.max(
          5,
          Math.min(
            95,
            initialY + dy
          )
        ),
      });
    };

    const handleUp = () => {
      window.removeEventListener(
        "mousemove",
        handleMove
      );

      window.removeEventListener(
        "mouseup",
        handleUp
      );
    };

    window.addEventListener(
      "mousemove",
      handleMove
    );

    window.addEventListener(
      "mouseup",
      handleUp
    );
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetDesign = () => {
    saveHistory();

    setLogo(null);

    setLogoPosition({
      x: 50,
      y: 31,
    });

    setLogoSize(115);

    setText(
      "ANANYA TRADING"
    );

    setTextPosition({
      x: 50,
      y: 55,
    });

    setFontSize(25);

    setFontFamily(
      "Poppins"
    );

    setTextColor(
      "#102a4c"
    );

    setBold(true);

    setItalic(false);

    setUnderline(false);

    setProductColor(
      selectedProduct?.color ||
        "#ffffff"
    );

    setSize("M");

    setZoom(1);

    setSide("front");

    setCustomerDescription("");

    setCustomerNote("");

    setCartSuccess(false);
    setOrderSuccess(false);
  };

  /* =====================================================
     CREATE CUSTOM PRODUCT
  ===================================================== */

  const createCustomProduct = () => {
    const now = Date.now();

    return {
      id:
        `custom-${selectedProduct?.id || "product"}-${now}`,

      productId:
        `custom-${selectedProduct?.id || "product"}-${now}`,

      originalProductId:
        selectedProduct?.id ||
        null,

      name:
        selectedProduct?.name ||
        "Customized Product",

      category:
        selectedProduct?.category ||
        "CUSTOM",

      type:
        selectedProduct?.type ||
        "tshirt",

      image:
        productImage,

      description:
        selectedProduct?.description ||
        "",

      customerDescription:
        customerDescription.trim(),

      customerNote:
        customerNote.trim(),

      basePrice,

      customizationPrice,

      price:
        totalPrice,

      totalPrice,

      quantity: 1,

      size,

      color:
        productColor,

      side,

      logo,

      logoPosition: {
        ...logoPosition,
      },

      logoSize,

      text,

      textPosition: {
        ...textPosition,
      },

      textColor,

      fontSize,

      fontFamily,

      bold,

      italic,

      underline,

      createdAt:
        new Date().toISOString(),
    };
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = () => {
    const customProduct =
      createCustomProduct();

    let existingCart = [];

    try {
      const savedCart =
        localStorage.getItem(
          "ananyaCart"
        );

      existingCart = savedCart
        ? JSON.parse(savedCart)
        : [];

      if (
        !Array.isArray(existingCart)
      ) {
        existingCart = [];
      }
    } catch (error) {
      console.error(
        "Cart load error:",
        error
      );

      existingCart = [];
    }

    const updatedCart = [
      ...existingCart,
      customProduct,
    ];

    try {
      localStorage.setItem(
        "ananyaCart",
        JSON.stringify(
          updatedCart
        )
      );
    } catch (error) {
      console.error(
        "Cart save error:",
        error
      );

      alert(
        "Product cart me save nahi ho paya."
      );

      return;
    }

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

    setCartSuccess(true);

    setTimeout(() => {
      setCartSuccess(false);
    }, 4000);
  };

  /* =====================================================
     GET CURRENT USER
  ===================================================== */

  const getCurrentUser = () => {
    try {
      const savedUser =
        localStorage.getItem(
          "currentUser"
        );

      if (!savedUser) {
        return null;
      }

      const user =
        JSON.parse(savedUser);

      return user;
    } catch (error) {
      console.error(
        "User load error:",
        error
      );

      return null;
    }
  };

  /* =====================================================
     GET EXISTING ORDERS
  ===================================================== */

  const getExistingOrders = () => {
    try {
      const savedOrders =
        localStorage.getItem(
          "ananyaOrders"
        );

      if (!savedOrders) {
        return [];
      }

      const parsedOrders =
        JSON.parse(savedOrders);

      return Array.isArray(
        parsedOrders
      )
        ? parsedOrders
        : [];
    } catch (error) {
      console.error(
        "Orders load error:",
        error
      );

      return [];
    }
  };

  /* =====================================================
     PLACE ORDER
     
     IMPORTANT:
     YAHAN /orders PAR AUTOMATIC NAVIGATE NAHI HOGA.
     Order save hone ke baad My Orders me event ke
     through data refresh hoga.
  ===================================================== */

  const placeOrder = () => {
    if (isPlacingOrder) {
      return;
    }

    /* -----------------------------------------------
       CURRENT USER
    ----------------------------------------------- */

    const currentUser =
      getCurrentUser();

    /* -----------------------------------------------
       LOGIN CHECK
    ----------------------------------------------- */

    if (!currentUser) {
      alert(
        "Please login before placing your order."
      );

      navigate("/login", {
        state: {
          from: "/customizer",
        },
      });

      return;
    }

    setIsPlacingOrder(true);

    /* -----------------------------------------------
       CREATE CUSTOM PRODUCT
    ----------------------------------------------- */

    const customProduct =
      createCustomProduct();

    /* -----------------------------------------------
       EXISTING ORDERS
    ----------------------------------------------- */

    const existingOrders =
      getExistingOrders();

    /* -----------------------------------------------
       UNIQUE IDs
    ----------------------------------------------- */

    const timestamp =
      Date.now();

    const orderId =
      `ORD${timestamp}`;

    const orderNumber =
      `#ORD${timestamp
        .toString()
        .slice(-6)}`;

    const now =
      new Date().toISOString();

    /* -----------------------------------------------
       USER ID
    ----------------------------------------------- */

    const userId =
      currentUser?.id ||
      currentUser?.email ||
      currentUser?.phone ||
      null;

    /* -----------------------------------------------
       ORDER ITEM
    ----------------------------------------------- */

    const orderItem = {
      ...customProduct,

      id:
        customProduct.id ||
        `item-${timestamp}`,

      quantity: 1,

      customerDescription:
        customerDescription.trim(),

      customerNote:
        customerNote.trim(),

      specialNote:
        customerNote.trim(),

      instructions:
        customerNote.trim(),

      totalPrice:
        totalPrice,

      price:
        totalPrice,
    };

    /* -----------------------------------------------
       NEW ORDER
    ----------------------------------------------- */

    const newOrder = {
      id: orderId,

      orderId,

      orderNumber,

      userId,

      user: currentUser,

      status: "Confirmed",

      paymentStatus: "Pending",

      paymentMethod:
        "Cash on Delivery",

      placedAt: now,

      createdAt: now,

      date: now,

      /* IMPORTANT FOR ORDERS PAGE */

      items: [orderItem],

      products: [orderItem],

      cart: [orderItem],

      /* ORDER LEVEL CUSTOM DATA */

      customerDescription:
        customerDescription.trim(),

      userDescription:
        customerDescription.trim(),

      customDescription:
        customerDescription.trim(),

      customerNote:
        customerNote.trim(),

      specialNote:
        customerNote.trim(),

      instructions:
        customerNote.trim(),

      /* PRODUCT DESCRIPTION */

      productDescription:
        selectedProduct?.description ||
        "",

      totalQuantity: 1,

      subtotal:
        totalPrice,

      customizationCharges:
        customizationPrice,

      customizationPrice:
        customizationPrice,

      totalPrice:
        totalPrice,

      total:
        totalPrice,

      /* SHIPPING / PAYMENT */

      shipping: 0,

      currency: "INR",

      source: "customizer",

      isCustomized: true,
    };

    /* -----------------------------------------------
       SAVE ORDER
    ----------------------------------------------- */

    const updatedOrders = [
      newOrder,
      ...existingOrders,
    ];

    try {
      localStorage.setItem(
        "ananyaOrders",
        JSON.stringify(
          updatedOrders
        )
      );
    } catch (error) {
      console.error(
        "Order save error:",
        error
      );

      alert(
        "Order save nahi ho paya. Please try again."
      );

      setIsPlacingOrder(false);

      return;
    }

    /* -----------------------------------------------
       VERIFY ORDER
    ----------------------------------------------- */

    let verifyOrders = [];

    try {
      const saved =
        localStorage.getItem(
          "ananyaOrders"
        );

      verifyOrders =
        saved
          ? JSON.parse(saved)
          : [];
    } catch (error) {
      console.error(
        "Order verify error:",
        error
      );

      verifyOrders = [];
    }

    const savedSuccessfully =
      Array.isArray(
        verifyOrders
      ) &&
      verifyOrders.some(
        (order) =>
          order.id === orderId
      );

    if (!savedSuccessfully) {
      alert(
        "Order save nahi hua. Please try again."
      );

      setIsPlacingOrder(false);

      return;
    }

    /* -----------------------------------------------
       NOTIFY ALL ORDER COMPONENTS
    ----------------------------------------------- */

    window.dispatchEvent(
      new Event(
        "ananyaOrdersUpdated"
      )
    );

    window.dispatchEvent(
      new Event(
        "ordersUpdated"
      )
    );

    /* -----------------------------------------------
       SUCCESS
    ----------------------------------------------- */

    setOrderSuccess(true);

    setIsPlacingOrder(false);

    /*
      IMPORTANT:
      Pehle yahan automatically:
      
      navigate("/orders")
      
      ho raha tha.

      Ab remove kar diya hai.

      Isliye order place karne ke baad
      user current Customizer page par rahega.
    */
  };

  /* =====================================================
     GO TO MY ORDERS
  ===================================================== */

  const goToMyOrders = () => {
    navigate("/orders");
  };

  /* =====================================================
     COLORS
  ===================================================== */

  const productColors = [
    "#ffffff",
    "#17191f",
    "#112b4c",
    "#d92132",
    "#075c51",
  ];

  const textColors = [
    "#111827",
    "#ffffff",
    "#e12432",
    "#2878df",
    "#075c51",
    "#7434d1",
    "#ff7a00",
  ];

  /* =====================================================
     LOADING
  ===================================================== */

  if (!selectedProduct) {
    return (
      <div className="customizer-loading">
        <div>
          <h2>
            Loading Product...
          </h2>

          <p>
            Please wait while we
            prepare your product.
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <div className="customizer-page">

      {/* =================================================
          TITLE
      ================================================= */}

      <section className="customizer-title">

        <button
          className="back-product"
          onClick={() =>
            navigate(-1)
          }
        >
          <ArrowLeft size={18} />

          <span>
            Back to Product
          </span>
        </button>

        <div className="title-center">

          <h1>
            Customize {productName}
          </h1>

          <p>
            Design it your way and
            make it unique
          </p>

        </div>

        <div className="side-switch">

          <button
            className={
              side === "front"
                ? "selected"
                : ""
            }
            onClick={() =>
              setSide("front")
            }
          >
            Front
          </button>

          <button
            className={
              side === "back"
                ? "selected"
                : ""
            }
            onClick={() =>
              setSide("back")
            }
          >
            Back
          </button>

        </div>

      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="customizer-main">

        {/* =================================================
            LEFT TOOLBAR
        ================================================= */}

        <aside className="left-toolbar">

          <button
            className={
              activeTool === "text"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool("text")
            }
          >
            <Type />

            <span>
              Add Text
            </span>
          </button>

          <button
            className={
              activeTool === "upload"
                ? "tool-active"
                : ""
            }
            onClick={() => {
              setActiveTool("upload");

              fileInputRef.current?.click();
            }}
          >
            <UploadCloud />

            <span>
              Upload Logo
            </span>
          </button>

          <button
            className={
              activeTool === "color"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool("color")
            }
          >
            <Palette />

            <span>
              Text Color
            </span>
          </button>

          <button
            className={
              activeTool === "font"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool("font")
            }
          >
            <Type />

            <span>
              Font Style
            </span>
          </button>

          <button
            className={
              activeTool === "fontSize"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool("fontSize")
            }
          >
            <Type />

            <span>
              Font Size
            </span>
          </button>

          <button
            className={
              activeTool === "position"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool("position")
            }
          >
            <Move />

            <span>
              Position
            </span>
          </button>

          <button
            className={
              activeTool === "layers"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool("layers")
            }
          >
            <Layers />

            <span>
              Layers
            </span>
          </button>

          <button
            onClick={deleteLogo}
          >
            <Trash2 />

            <span>
              Delete
            </span>
          </button>

        </aside>

        {/* =================================================
            SETTINGS
        ================================================= */}

        <section className="settings-panel">

          {/* TEXT */}

          {activeTool === "text" && (
            <div className="settings-content">

              <h3>
                Add Your Text
              </h3>

              <input
                className="text-input"
                value={text}
                onChange={(event) =>
                  setText(
                    event.target.value
                  )
                }
                placeholder="Enter your text"
              />

              <select
                className="font-select"
                value={fontFamily}
                onChange={(event) => {
                  saveHistory();

                  setFontFamily(
                    event.target.value
                  );
                }}
              >
                <option value="Poppins">
                  Poppins
                </option>

                <option value="Arial">
                  Arial
                </option>

                <option value="Montserrat">
                  Montserrat
                </option>

                <option value="Georgia">
                  Georgia
                </option>

                <option value="Roboto">
                  Roboto
                </option>
              </select>

              <div className="format-buttons">

                <button
                  className={
                    bold
                      ? "active-format"
                      : ""
                  }
                  onClick={() => {
                    saveHistory();

                    setBold(
                      !bold
                    );
                  }}
                >
                  <Bold size={18} />
                </button>

                <button
                  className={
                    italic
                      ? "active-format"
                      : ""
                  }
                  onClick={() => {
                    saveHistory();

                    setItalic(
                      !italic
                    );
                  }}
                >
                  <Italic size={18} />
                </button>

                <button
                  className={
                    underline
                      ? "active-format"
                      : ""
                  }
                  onClick={() => {
                    saveHistory();

                    setUnderline(
                      !underline
                    );
                  }}
                >
                  <Underline size={18} />
                </button>

                <button>
                  Aa
                </button>

              </div>

              <h4>
                Text Color
              </h4>

              <div className="color-row">

                {textColors.map(
                  (color) => (
                    <button
                      key={color}
                      className={
                        textColor === color
                          ? "text-color selected-text-color"
                          : "text-color"
                      }
                      style={{
                        background:
                          color,
                      }}
                      onClick={() => {
                        saveHistory();

                        setTextColor(
                          color
                        );
                      }}
                    />
                  )
                )}

              </div>

              <h4>
                Font Size
              </h4>

              <div className="range-row">

                <span>
                  12
                </span>

                <input
                  type="range"
                  min="12"
                  max="55"
                  value={fontSize}
                  onChange={(event) =>
                    setFontSize(
                      Number(
                        event.target.value
                      )
                    )
                  }
                />

                <span>
                  {fontSize}
                </span>

              </div>

              <h4>
                Text Position
              </h4>

              <div className="alignment-buttons">

                <button
                  onClick={() =>
                    setTextPosition({
                      ...textPosition,
                      x: 32,
                    })
                  }
                >
                  <AlignLeft />
                </button>

                <button
                  onClick={() =>
                    setTextPosition({
                      ...textPosition,
                      x: 50,
                    })
                  }
                >
                  <AlignCenter />
                </button>

                <button
                  onClick={() =>
                    setTextPosition({
                      ...textPosition,
                      x: 68,
                    })
                  }
                >
                  <AlignRight />
                </button>

              </div>

            </div>
          )}

          {/* UPLOAD */}

          {activeTool === "upload" && (
            <div className="settings-content">

              <h3>
                Upload Your Logo
              </h3>

              <div
                className="upload-area"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <UploadCloud size={40} />

                <strong>
                  Upload Logo
                </strong>

                <span>
                  PNG, JPG, WEBP, SVG
                </span>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={
                  handleLogoUpload
                }
              />

              {logo && (
                <>
                  <div className="uploaded-preview">

                    <img
                      src={logo}
                      alt="Uploaded logo"
                    />

                  </div>

                  <h4>
                    Logo Size
                  </h4>

                  <div className="range-row">

                    <span>
                      50
                    </span>

                    <input
                      type="range"
                      min="50"
                      max="240"
                      value={logoSize}
                      onChange={(event) =>
                        setLogoSize(
                          Number(
                            event.target.value
                          )
                        )
                      }
                    />

                    <span>
                      {logoSize}
                    </span>

                  </div>

                  <button
                    className="delete-logo-btn"
                    onClick={
                      deleteLogo
                    }
                  >
                    <Trash2 size={17} />

                    Remove Logo
                  </button>
                </>
              )}

            </div>
          )}

          {/* COLOR */}

          {activeTool === "color" && (
            <div className="settings-content">

              <h3>
                Text Color
              </h3>

              <div className="large-color-grid">

                {textColors.map(
                  (color) => (
                    <button
                      key={color}
                      style={{
                        background:
                          color,
                      }}
                      className={
                        textColor === color
                          ? "color-selected"
                          : ""
                      }
                      onClick={() => {
                        saveHistory();

                        setTextColor(
                          color
                        );
                      }}
                    />
                  )
                )}

              </div>

            </div>
          )}

          {/* FONT */}

          {activeTool === "font" && (
            <div className="settings-content">

              <h3>
                Font Style
              </h3>

              <div className="font-options">

                {[
                  "Poppins",
                  "Arial",
                  "Montserrat",
                  "Georgia",
                  "Roboto",
                ].map(
                  (font) => (
                    <button
                      key={font}
                      style={{
                        fontFamily:
                          font,
                      }}
                      className={
                        fontFamily === font
                          ? "font-selected"
                          : ""
                      }
                      onClick={() => {
                        saveHistory();

                        setFontFamily(
                          font
                        );
                      }}
                    >
                      {font}
                    </button>
                  )
                )}

              </div>

            </div>
          )}

          {/* FONT SIZE */}

          {activeTool === "fontSize" && (
            <div className="settings-content">

              <h3>
                Font Size
              </h3>

              <input
                className="big-range"
                type="range"
                min="12"
                max="60"
                value={fontSize}
                onChange={(event) =>
                  setFontSize(
                    Number(
                      event.target.value
                    )
                  )
                }
              />

              <div className="font-size-number">
                {fontSize}px
              </div>

            </div>
          )}

          {/* POSITION */}

          {activeTool === "position" && (
            <div className="settings-content">

              <h3>
                Position
              </h3>

              <p className="position-info">
                Logo ya text ko mouse se
                directly product par
                drag karke move karein.
              </p>

              <div className="position-buttons">

                <button
                  onClick={() =>
                    setLogoPosition({
                      x: 50,
                      y: 28,
                    })
                  }
                >
                  Logo Center
                </button>

                <button
                  onClick={() =>
                    setTextPosition({
                      x: 50,
                      y: 55,
                    })
                  }
                >
                  Text Center
                </button>

              </div>

            </div>
          )}

          {/* LAYERS */}

          {activeTool === "layers" && (
            <div className="settings-content">

              <h3>
                Layers
              </h3>

              <div className="layer-item">

                <Layers size={17} />

                <span>
                  {productName}
                </span>

              </div>

              {logo && (
                <div className="layer-item">

                  <img
                    src={logo}
                    alt=""
                  />

                  <span>
                    Logo
                  </span>

                </div>
              )}

              {text && (
                <div className="layer-item">

                  <Type size={17} />

                  <span>
                    {text}
                  </span>

                </div>
              )}

            </div>
          )}

        </section>

        {/* =================================================
            PRODUCT PREVIEW
        ================================================= */}

        <section className="product-area">

          <div className="product-canvas-wrapper">

            <div
              className="product-canvas"
              style={{
                transform:
                  `scale(${zoom})`,
              }}
            >

              <div
                className="real-product-preview"
                style={{
                  "--shirt-color":
                    productColor,
                }}
              >

                {productImage ? (
                  <img
                    className="selected-product-image"
                    src={productImage}
                    alt={productName}
                    draggable="false"
                  />
                ) : (
                  <div className="product-image-fallback">

                    <div
                      className={
                        isHoodie
                          ? "hoodie"
                          : "tshirt"
                      }
                      style={{
                        "--shirt-color":
                          productColor,
                      }}
                    >

                      <div className="shirt-collar" />

                      <div className="shirt-left-sleeve" />

                      <div className="shirt-right-sleeve" />

                    </div>

                  </div>
                )}

                <div className="print-area">

                  {logo &&
                    side === "front" && (
                    <div
                      className="design-logo"
                      style={{
                        left:
                          `${logoPosition.x}%`,

                        top:
                          `${logoPosition.y}%`,

                        width:
                          `${logoSize}px`,
                      }}
                      onMouseDown={
                        handleLogoMouseDown
                      }
                    >

                      <button
                        type="button"
                        className="delete-design"
                        onClick={(event) => {
                          event.stopPropagation();

                          deleteLogo();
                        }}
                      >
                        <X size={12} />
                      </button>

                      <img
                        src={logo}
                        alt="Customer Logo"
                        draggable="false"
                      />

                      <button
                        type="button"
                        className="resize-handle"
                        onMouseDown={
                          handleLogoResize
                        }
                      >
                        ↘
                      </button>

                    </div>
                  )}

                  {text &&
                    side === "front" && (
                    <div
                      className="design-text"
                      style={{
                        left:
                          `${textPosition.x}%`,

                        top:
                          `${textPosition.y}%`,

                        fontSize:
                          `${fontSize}px`,

                        fontFamily,

                        color:
                          textColor,

                        fontWeight:
                          bold
                            ? 700
                            : 400,

                        fontStyle:
                          italic
                            ? "italic"
                            : "normal",

                        textDecoration:
                          underline
                            ? "underline"
                            : "none",
                      }}
                      onMouseDown={
                        handleTextMouseDown
                      }
                    >
                      {text}
                    </div>
                  )}

                  {side === "back" && (
                    <div className="back-preview-text">
                      BACK
                    </div>
                  )}

                </div>

              </div>

            </div>

            {/* CANVAS TOOLS */}

            <div className="canvas-tools">

              <button
                onClick={undo}
                disabled={
                  history.length === 0
                }
              >
                <RotateCcw />

                <span>
                  Undo
                </span>
              </button>

              <button
                onClick={redo}
                disabled={
                  future.length === 0
                }
              >
                <RotateCw />

                <span>
                  Redo
                </span>
              </button>

              <button
                onClick={() =>
                  setZoom(
                    Math.min(
                      1.35,
                      zoom + 0.1
                    )
                  )
                }
              >
                <ZoomIn />

                <span>
                  Zoom In
                </span>
              </button>

              <button
                onClick={() =>
                  setZoom(
                    Math.max(
                      0.7,
                      zoom - 0.1
                    )
                  )
                }
              >
                <ZoomOut />

                <span>
                  Zoom Out
                </span>
              </button>

              <button
                onClick={
                  resetDesign
                }
              >
                <RefreshCcw />

                <span>
                  Reset
                </span>
              </button>

            </div>

          </div>

        </section>

        {/* =================================================
            RIGHT SETTINGS
        ================================================= */}

        <aside className="product-settings">

          <div className="selected-product-info">

            <span>
              {selectedProduct.category ||
                "PRODUCT"}
            </span>

            <h2>
              {productName}
            </h2>

            <p>
              {selectedProduct.description ||
                "Customize this product according to your requirements."}
            </p>

          </div>

          {/* PRODUCT COLOR */}

          <h3>
            Choose Product Color
          </h3>

          <div className="product-colors">

            {productColors.map(
              (color) => (
                <button
                  key={color}
                  className={
                    productColor === color
                      ? "product-color selected-product-color"
                      : "product-color"
                  }
                  style={{
                    background:
                      color,
                  }}
                  onClick={() => {
                    saveHistory();

                    setProductColor(
                      color
                    );
                  }}
                />
              )
            )}

          </div>

          <div className="setting-divider" />

          {/* SIZE */}

          <h3>
            Choose Size
          </h3>

          <div className="size-options">

            {[
              "S",
              "M",
              "L",
              "XL",
              "XXL",
            ].map(
              (item) => (
                <button
                  key={item}
                  className={
                    size === item
                      ? "size-selected"
                      : ""
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

          <div className="setting-divider" />

          {/* DESCRIPTION */}

          <div className="customer-request-box">

            <div className="customer-request-title">

              <FileText size={18} />

              <div>

                <strong>
                  Product Description
                </strong>

                <span>
                  Tell us about your customization
                </span>

              </div>

            </div>

            <textarea
              className="customer-description-input"
              value={
                customerDescription
              }
              onChange={(event) =>
                setCustomerDescription(
                  event.target.value
                )
              }
              maxLength={500}
              placeholder="Example: Logo should be placed on the left chest area..."
            />

            <div className="character-count">

              {customerDescription.length}
              /500 characters

            </div>

          </div>

          {/* SPECIAL NOTE */}

          <div className="customer-request-box">

            <div className="customer-request-title">

              <MessageSquare size={18} />

              <div>

                <strong>
                  Customer Instructions / Special Note
                </strong>

                <span>
                  Write any special requirement
                </span>

              </div>

            </div>

            <textarea
              className="customer-description-input customer-note-input"
              value={customerNote}
              onChange={(event) =>
                setCustomerNote(
                  event.target.value
                )
              }
              maxLength={500}
              placeholder="Example: Logo left side me chahiye. Text ka color blue rakho. Delivery se pehle mujhe confirm karna hai."
            />

            <div className="character-count">

              {customerNote.length}
              /500 characters

            </div>

          </div>

          {/* INFO */}

          <div className="customer-info-message">

            <Info size={16} />

            <span>
              Your description and special
              instructions will be saved with
              this customized product.
            </span>

          </div>

          <div className="setting-divider" />

          {/* PRICE */}

          <h3>
            Price Details
          </h3>

          <div className="price-row">

            <span>
              Product Price
            </span>

            <strong>
              ₹
              {basePrice.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="price-row">

            <span>
              Customization
            </span>

            <strong>
              ₹
              {customizationPrice.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          <div className="price-divider" />

          <div className="total-price-row">

            <span>
              Total Price
            </span>

            <strong>
              ₹
              {totalPrice.toLocaleString(
                "en-IN"
              )}
            </strong>

          </div>

          {/* CART SUCCESS */}

          {cartSuccess && (
            <div className="cart-success-message">

              <CheckCircle size={19} />

              <div>

                <strong>
                  Added to Cart
                </strong>

                <span>
                  Product and your instructions
                  have been saved.
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setCartSuccess(false)
                }
              >
                <X size={16} />
              </button>

            </div>
          )}

          {/* ORDER SUCCESS */}

          {orderSuccess && (
            <div className="cart-success-message">

              <CheckCircle size={19} />

              <div>

                <strong>
                  Order Placed Successfully
                </strong>

                <span>
                  Your product description and
                  instructions are saved with
                  your order.
                </span>

              </div>

              <button
                type="button"
                onClick={() =>
                  setOrderSuccess(false)
                }
              >
                <X size={16} />
              </button>

            </div>
          )}

          {/* ADD TO CART */}

          <button
            type="button"
            className="add-cart-btn"
            onClick={addToCart}
          >
            <ShoppingCart size={20} />

            Add to Cart
          </button>

          {/* PLACE ORDER */}

          <button
            type="button"
            className="place-order-btn"
            onClick={placeOrder}
            disabled={isPlacingOrder}
          >
            <PackageCheck size={20} />

            {isPlacingOrder
              ? "Placing Order..."
              : "Place Order"}

          </button>

          {/* GO TO MY ORDERS */}

          {orderSuccess && (
            <button
              type="button"
              className="save-design-btn"
              onClick={goToMyOrders}
            >
              <ClipboardList size={20} />

              View My Orders
            </button>
          )}

          {/* SAVE DESIGN */}

          <button
            type="button"
            className="save-design-btn"
            onClick={() => {
              try {
                localStorage.setItem(
                  "savedCustomDesign",
                  JSON.stringify({
                    product:
                      selectedProduct,

                    logo,

                    logoPosition,

                    logoSize,

                    text,

                    textPosition,

                    textColor,

                    fontSize,

                    fontFamily,

                    bold,

                    italic,

                    underline,

                    productColor,

                    size,

                    side,

                    customerDescription,

                    customerNote,

                    savedAt:
                      new Date().toISOString(),
                  })
                );

                alert(
                  "Design saved successfully!"
                );
              } catch (error) {
                console.error(
                  "Design save error:",
                  error
                );

                alert(
                  "Design save nahi ho paya."
                );
              }
            }}
          >
            <Heart size={20} />

            Save Design
          </button>

        </aside>

      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="features-footer">

        <div className="feature">

          <div className="feature-icon">
            ✧
          </div>

          <div>

            <strong>
              Premium Quality
            </strong>

            <span>
              Best materials used
            </span>

          </div>

        </div>

        <div className="feature">

          <div className="feature-icon">
            🚚
          </div>

          <div>

            <strong>
              Free Shipping
            </strong>

            <span>
              On all orders above ₹999
            </span>

          </div>

        </div>

        <div className="feature">

          <div className="feature-icon">
            ♙
          </div>

          <div>

            <strong>
              Cash on Delivery
            </strong>

            <span>
              Available
            </span>

          </div>

        </div>

        <div className="feature">

          <div className="feature-icon">
            ↻
          </div>

          <div>

            <strong>
              Easy Returns
            </strong>

            <span>
              7 days return policy
            </span>

          </div>

        </div>

        <div className="feature">

          <div className="feature-icon">
            ▣
          </div>

          <div>

            <strong>
              Secure Payment
            </strong>

            <span>
              100% protected
            </span>

          </div>

        </div>

      </footer>

    </div>
  );
}

export default Customizer;
