import React, { useEffect, useRef, useState } from "react";

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
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import "./Customizer.css";

function Customizer() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  /* =====================================================
     SELECTED PRODUCT
  ===================================================== */

  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const savedProduct = localStorage.getItem(
      "selectedCustomizeProduct"
    );

    if (!savedProduct) {
      return;
    }

    try {
      const product = JSON.parse(savedProduct);

      console.log("CUSTOMIZER SELECTED PRODUCT:", product);

      setSelectedProduct(product);

      if (product.color) {
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

  const [activeTool, setActiveTool] = useState("text");

  const [side, setSide] = useState("front");

  const [productColor, setProductColor] =
    useState("#ffffff");

  const [size, setSize] = useState("M");

  const [zoom, setZoom] = useState(1);

  /* =====================================================
     LOGO
  ===================================================== */

  const [logo, setLogo] = useState(null);

  const [logoPosition, setLogoPosition] = useState({
    x: 50,
    y: 31,
  });

  const [logoSize, setLogoSize] = useState(115);

  /* =====================================================
     TEXT
  ===================================================== */

  const [text, setText] =
    useState("ANANYA TRADING");

  const [textPosition, setTextPosition] = useState({
    x: 50,
    y: 55,
  });

  const [fontSize, setFontSize] = useState(25);

  const [fontFamily, setFontFamily] =
    useState("Poppins");

  const [textColor, setTextColor] =
    useState("#102a4c");

  const [bold, setBold] = useState(true);

  const [italic, setItalic] = useState(false);

  const [underline, setUnderline] =
    useState(false);

  /* =====================================================
     HISTORY
  ===================================================== */

  const [history, setHistory] = useState([]);

  const [future, setFuture] = useState([]);

  /* =====================================================
     PRODUCT PRICE
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
     PRODUCT TYPE
  ===================================================== */

  const productType =
    selectedProduct?.type || "tshirt";

  const isHoodie =
    productType.toLowerCase() === "hoodie";

  /* =====================================================
     PRODUCT NAME
  ===================================================== */

  const productName =
    selectedProduct?.name ||
    "Custom Product";

  /* =====================================================
     PRODUCT IMAGE
  ===================================================== */

  const productImage =
    selectedProduct?.image ||
    selectedProduct?.img ||
    selectedProduct?.productImage ||
    selectedProduct?.thumbnail ||
    "";

  /*
    Debug ke liye browser console me check kar sakte ho.
  */

  useEffect(() => {
    if (selectedProduct) {
      console.log(
        "Selected Product:",
        selectedProduct
      );

      console.log(
        "Selected Product Image:",
        productImage
      );
    }
  }, [selectedProduct, productImage]);

  /* =====================================================
     SAVE CURRENT STATE
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
    };
  };

  const saveHistory = () => {
    setHistory((prev) => [
      ...prev.slice(-20),
      getCurrentState(),
    ]);

    setFuture([]);
  };

  /* =====================================================
     RESTORE
  ===================================================== */

  const restoreState = (state) => {
    if (!state) return;

    setLogo(state.logo);

    setLogoPosition(
      state.logoPosition || {
        x: 50,
        y: 31,
      }
    );

    setLogoSize(state.logoSize || 115);

    setText(state.text || "");

    setTextPosition(
      state.textPosition || {
        x: 50,
        y: 55,
      }
    );

    setFontSize(state.fontSize || 25);

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
  };

  /* =====================================================
     UNDO
  ===================================================== */

  const undo = () => {
    if (history.length === 0) return;

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

  /* =====================================================
     REDO
  ===================================================== */

  const redo = () => {
    if (future.length === 0) return;

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
     UPLOAD LOGO
  ===================================================== */

  const handleLogoUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith("image/")
    ) {
      alert(
        "Please select a valid image."
      );

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

  /* =====================================================
     DELETE LOGO
  ===================================================== */

  const deleteLogo = () => {
    if (!logo) return;

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

    if (!printArea) return;

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

    if (!printArea) return;

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

    setFontFamily("Poppins");

    setTextColor("#102a4c");

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
  };

  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = () => {
    const customProduct = {
      productId:
        "custom-" +
        (selectedProduct?.id ||
          "product") +
        "-" +
        Date.now(),

      originalProductId:
        selectedProduct?.id,

      name:
        selectedProduct?.name ||
        "Customized Product",

      category:
        selectedProduct?.category ||
        "CUSTOM",

      type:
        selectedProduct?.type ||
        "tshirt",

      /*
        IMPORTANT:
        Same selected product image
        cart me save hogi.
      */

      image:
        productImage,

      description:
        selectedProduct?.description ||
        "",

      basePrice,

      customizationPrice,

      price:
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

    const existingCart =
      JSON.parse(
        localStorage.getItem(
          "ananyaCart"
        )
      ) || [];

    const updatedCart = [
      ...existingCart,
      customProduct,
    ];

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

  /* =====================================================
     PRODUCT COLORS
  ===================================================== */

  const productColors = [
    "#ffffff",
    "#17191f",
    "#112b4c",
    "#d92132",
    "#075c51",
  ];

  /* =====================================================
     TEXT COLORS
  ===================================================== */

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
          TITLE BAR
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
            Customize{" "}
            {productName}
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
          MAIN CUSTOMIZER
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
              setActiveTool(
                "upload"
              );

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
              setActiveTool(
                "color"
              )
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
              setActiveTool(
                "font"
              )
            }
          >
            <Type />

            <span>
              Font Style
            </span>
          </button>

          <button
            className={
              activeTool ===
              "fontSize"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool(
                "fontSize"
              )
            }
          >
            <Type />

            <span>
              Font Size
            </span>
          </button>

          <button
            className={
              activeTool ===
              "position"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool(
                "position"
              )
            }
          >
            <Move />

            <span>
              Position
            </span>
          </button>

          <button
            className={
              activeTool ===
              "layers"
                ? "tool-active"
                : ""
            }
            onClick={() =>
              setActiveTool(
                "layers"
              )
            }
          >
            <Layers />

            <span>
              Layers
            </span>
          </button>

          <button
            onClick={
              deleteLogo
            }
          >
            <Trash2 />

            <span>
              Delete
            </span>
          </button>

        </aside>

        {/* =================================================
            SETTINGS PANEL
        ================================================= */}

        <section className="settings-panel">

          {/* TEXT */}

          {activeTool ===
            "text" && (
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
                value={
                  fontFamily
                }
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
                  <Bold
                    size={18}
                  />
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
                  <Italic
                    size={18}
                  />
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
                  <Underline
                    size={18}
                  />
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
                        textColor ===
                        color
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
                  value={
                    fontSize
                  }
                  onChange={(event) =>
                    setFontSize(
                      Number(
                        event.target
                          .value
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
                  className="selected-align"
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

          {activeTool ===
            "upload" && (
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
                <UploadCloud
                  size={40}
                />

                <strong>
                  Upload Logo
                </strong>

                <span>
                  PNG, JPG, WEBP, SVG
                </span>
              </div>

              <input
                ref={
                  fileInputRef
                }
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
                      value={
                        logoSize
                      }
                      onChange={(
                        event
                      ) =>
                        setLogoSize(
                          Number(
                            event.target
                              .value
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
                    <Trash2
                      size={17}
                    />

                    Remove Logo
                  </button>
                </>
              )}

            </div>
          )}

          {/* COLOR */}

          {activeTool ===
            "color" && (
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
                        textColor ===
                        color
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

          {activeTool ===
            "font" && (
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
                        fontFamily ===
                        font
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

          {activeTool ===
            "fontSize" && (
            <div className="settings-content">

              <h3>
                Font Size
              </h3>

              <input
                className="big-range"
                type="range"
                min="12"
                max="60"
                value={
                  fontSize
                }
                onChange={(event) =>
                  setFontSize(
                    Number(
                      event.target
                        .value
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

          {activeTool ===
            "position" && (
            <div className="settings-content">

              <h3>
                Position
              </h3>

              <p className="position-info">
                Logo ya text ko mouse
                se directly product
                par drag karke move
                karein.
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

          {activeTool ===
            "layers" && (
            <div className="settings-content">

              <h3>
                Layers
              </h3>

              <div className="layer-item">

                <Layers
                  size={17}
                />

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

                  <Type
                    size={17}
                  />

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

              {/* =================================================
                  IMPORTANT PRODUCT IMAGE
              ================================================= */}

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
                    onError={(event) => {
                      console.error(
                        "Product image failed:",
                        productImage
                      );

                      event.currentTarget.style.display =
                        "none";

                      const fallback =
                        event.currentTarget.parentElement.querySelector(
                          ".product-image-fallback"
                        );

                      if (fallback) {
                        fallback.style.display =
                          "block";
                      }
                    }}
                  />
                ) : null}

                {/* =================================================
                    FALLBACK PRODUCT
                ================================================= */}

                <div
                  className="product-image-fallback"
                  style={{
                    display:
                      productImage
                        ? "none"
                        : "block",
                  }}
                >

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

                {/* =================================================
                    PRINT AREA
                ================================================= */}

                <div className="print-area">

                  {/* =================================================
                      LOGO
                  ================================================= */}

                  {logo &&
                    side ===
                      "front" && (
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
                        className="delete-design"
                        onClick={(
                          event
                        ) => {
                          event.stopPropagation();

                          deleteLogo();
                        }}
                      >
                        <X
                          size={12}
                        />
                      </button>

                      <img
                        src={logo}
                        alt="Customer Logo"
                        draggable="false"
                      />

                      <button
                        className="resize-handle"
                        onMouseDown={
                          handleLogoResize
                        }
                      >
                        ↘
                      </button>

                    </div>
                  )}

                  {/* =================================================
                      TEXT
                  ================================================= */}

                  {text &&
                    side ===
                      "front" && (
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

                  {/* =================================================
                      BACK
                  ================================================= */}

                  {side ===
                    "back" && (
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
                  history.length ===
                  0
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
                  future.length ===
                  0
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

          {/* PRODUCT THUMBNAIL */}

          <div className="product-thumbnails">

            <div className="thumb active-thumb">

              {productImage ? (
                <img
                  src={productImage}
                  alt={productName}
                  className="thumbnail-product-image"
                />
              ) : (
                <div
                  className="mini-shirt"
                  style={{
                    background:
                      productColor,
                  }}
                />
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            PRODUCT SETTINGS
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

          <h3>
            Choose Product Color
          </h3>

          <div className="product-colors">

            {productColors.map(
              (color) => (
                <button
                  key={color}
                  className={
                    productColor ===
                    color
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
                    size ===
                    item
                      ? "size-selected"
                      : ""
                  }
                  onClick={() =>
                    setSize(
                      item
                    )
                  }
                >
                  {item}
                </button>
              )
            )}

          </div>

          <div className="setting-divider" />

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

          <button
            className="add-cart-btn"
            onClick={
              addToCart
            }
          >
            <ShoppingCart
              size={20}
            />

            Add to Cart
          </button>

          <button
            className="save-design-btn"
           
          >
            <Heart
              size={20}
            />

            Save Design
          </button>

        </aside>

      </main>

      {/* =================================================
          BOTTOM FEATURES
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