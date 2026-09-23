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
  Building2,
  User,
  Briefcase,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Image,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { saveOrderToServer } from "../services/orderApi";

import "./Customizer.css";

/* =====================================================
   HELPERS
===================================================== */

const uid = () =>
  `el-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;

const isDarkColor = (hex) => {
  const c = String(hex || "#ffffff").replace("#", "");

  if (c.length < 6) return false;

  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);

  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.55;
};

const printColorFor = (shirtColor) =>
  isDarkColor(shirtColor) ? "#f5f7fa" : "#102a4c";

const FONT_OPTIONS = [
  "Poppins",
  "Arial",
  "Montserrat",
  "Georgia",
  "Roboto",
];

const TEXT_KINDS = [
  { key: "company", label: "Company Name", placeholder: "ANANYA TRADING" },
  { key: "person", label: "Person Name", placeholder: "ARUN RAJ" },
  { key: "designation", label: "Designation", placeholder: "SALES EXECUTIVE" },
  { key: "custom", label: "Custom Text", placeholder: "YOUR TEXT" },
];

/* =====================================================
   GARMENT MOCKUP (vector T-shirt — color changeable)
===================================================== */

function GarmentSvg({ color, back }) {
  const dark = isDarkColor(color);
  const seam = dark
    ? "rgba(0,0,0,0.35)"
    : "rgba(0,0,0,0.12)";
  const shade = dark
    ? "rgba(0,0,0,0.28)"
    : "rgba(0,0,0,0.10)";
  const light = dark
    ? "rgba(255,255,255,0.10)"
    : "rgba(255,255,255,0.45)";

  const body =
    "M150 32 " +
    "C162 50 238 50 250 32 " +
    "L296 46 L372 120 L330 207 L298 181 " +
    "L301 384 C301 400 292 406 277 406 " +
    "L123 406 C108 406 99 400 99 384 " +
    "L102 181 L70 207 L28 120 L104 46 Z";

  return (
    <svg
      viewBox="0 0 400 430"
      className="garment-svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient
          id="gshade"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={light} />
          <stop offset="35%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor={shade} />
        </linearGradient>
      </defs>

      {/* shirt silhouette */}
      <path d={body} fill={color} />
      <path d={body} fill="url(#gshade)" />

      {/* sleeve seams */}
      <path
        d="M104 46 L70 207 M296 46 L330 207"
        stroke={seam}
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* sleeve hems */}
      <path
        d="M33 132 L75 218 M367 132 L325 218"
        stroke={seam}
        strokeWidth="2"
        fill="none"
        opacity="0.35"
      />

      {/* fabric folds */}
      <path
        d="M130 240 Q200 255 270 240"
        stroke={seam}
        strokeWidth="2.5"
        fill="none"
        opacity="0.28"
      />
      <path
        d="M135 300 Q200 315 265 300"
        stroke={seam}
        strokeWidth="2.5"
        fill="none"
        opacity="0.22"
      />

      {/* bottom hem */}
      <path
        d="M101 388 Q200 396 299 388"
        stroke={seam}
        strokeWidth="2.5"
        fill="none"
        opacity="0.45"
      />

      {/* collar */}
      {back ? (
        <path
          d="M152 32 C165 42 235 42 248 32"
          stroke={seam}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M150 32 C162 50 238 50 250 32"
            stroke={seam}
            strokeWidth="9"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M156 34 C168 49 232 49 244 34"
            stroke={shade}
            strokeWidth="4"
            fill="none"
            opacity="0.6"
          />
        </>
      )}
    </svg>
  );
}

/* =====================================================
   DEFAULT DESIGN
===================================================== */

const makeDefaultDesigns = (shirtColor) => {
  const ink = printColorFor(shirtColor);

  return {
    front: [
      {
        id: uid(),
        type: "text",
        kind: "company",
        label: "Company Name",
        text: "ANANYA TRADING",
        x: 50,
        y: 42,
        fontSize: 26,
        fontFamily: "Poppins",
        color: ink,
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        letterSpacing: 1,
        rotation: 0,
        hidden: false,
      },
    ],
    back: [
      {
        id: uid(),
        type: "text",
        kind: "company",
        label: "Company Name",
        text: "ANANYA TRADING",
        x: 50,
        y: 28,
        fontSize: 32,
        fontFamily: "Poppins",
        color: ink,
        bold: true,
        italic: false,
        underline: false,
        align: "center",
        letterSpacing: 1,
        rotation: 0,
        hidden: false,
      },
      {
        id: uid(),
        type: "text",
        kind: "person",
        label: "Person Name",
        text: "ARUN RAJ",
        x: 50,
        y: 48,
        fontSize: 20,
        fontFamily: "Poppins",
        color: ink,
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        letterSpacing: 1,
        rotation: 0,
        hidden: false,
      },
      {
        id: uid(),
        type: "text",
        kind: "designation",
        label: "Designation",
        text: "SALES EXECUTIVE",
        x: 50,
        y: 62,
        fontSize: 14,
        fontFamily: "Poppins",
        color: ink,
        bold: false,
        italic: false,
        underline: false,
        align: "center",
        letterSpacing: 1,
        rotation: 0,
        hidden: false,
      },
    ],
  };
};

function Customizer() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const printAreaRef = useRef(null);

  /* =====================================================
     SELECTED PRODUCT
  ===================================================== */

  const [selectedProduct, setSelectedProduct] =
    useState(null);

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

  const [preview, setPreview] =
    useState(false);

  /* =====================================================
     DESIGN ELEMENTS (front + back independent)
  ===================================================== */

  const [designs, setDesigns] = useState({
    front: [],
    back: [],
  });

  const [selectedId, setSelectedId] =
    useState(null);

  const elements = designs[side] || [];

  const selectedElement =
    elements.find((e) => e.id === selectedId) ||
    null;

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
     HISTORY
  ===================================================== */

  const [history, setHistory] =
    useState([]);

  const [future, setFuture] =
    useState([]);

  /* =====================================================
     LOAD PRODUCT + SAVED DESIGN
  ===================================================== */

  useEffect(() => {
    const savedProduct = localStorage.getItem("selectedCustomizeProduct");

    if (!savedProduct) return;

    try {
      const product = JSON.parse(savedProduct);

      setSelectedProduct(product);

      const shirtColor =
        product?.color || "#ffffff";

      setProductColor(shirtColor);

      /* per-product saved design restore */
      let restored = null;

      try {
        const raw = localStorage.getItem(
          `savedDesign_${product.id}`
        );

        if (raw) {
          restored = JSON.parse(raw);
        }
      } catch {
        restored = null;
      }

      if (
        restored &&
        restored.designs &&
        (restored.designs.front?.length ||
          restored.designs.back?.length)
      ) {
        setDesigns(restored.designs);

        if (restored.productColor) {
          setProductColor(restored.productColor);
        }

        if (restored.size) {
          setSize(restored.size);
        }

        setCustomerDescription(
          restored.customerDescription || ""
        );

        setCustomerNote(
          restored.customerNote || ""
        );
      } else {
        setDesigns(makeDefaultDesigns(shirtColor));
      }
    } catch (error) {
      console.error("Selected product load error:", error);
    }
  }, []);

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

  const isApparel = ["tshirt", "hoodie"].includes(
    String(productType).toLowerCase()
  );

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
     CURRENT STATE / HISTORY
  ===================================================== */

  const getCurrentState = () => ({
    designs: JSON.parse(JSON.stringify(designs)),
    productColor,
    size,
    side,
  });

  const saveHistory = () => {
    setHistory((prev) => [
      ...prev.slice(-25),
      getCurrentState(),
    ]);

    setFuture([]);
  };

  const restoreState = (state) => {
    if (!state) return;

    setDesigns(
      state.designs || { front: [], back: [] }
    );

    setProductColor(
      state.productColor || "#ffffff"
    );

    setSize(state.size || "M");

    setSide(state.side || "front");

    setSelectedId(null);
  };

  const undo = () => {
    if (history.length === 0) return;

    const previous =
      history[history.length - 1];

    setFuture((prev) => [
      ...prev,
      getCurrentState(),
    ]);

    setHistory((prev) => prev.slice(0, -1));

    restoreState(previous);
  };

  const redo = () => {
    if (future.length === 0) return;

    const next =
      future[future.length - 1];

    setHistory((prev) => [
      ...prev,
      getCurrentState(),
    ]);

    setFuture((prev) => prev.slice(0, -1));

    restoreState(next);
  };

  /* =====================================================
     ELEMENT OPERATIONS
  ===================================================== */

  const updateElement = (id, patch, record = true) => {
    if (record) saveHistory();

    setDesigns((prev) => ({
      ...prev,
      [side]: prev[side].map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }));
  };

  /* drag ke dauran history spam na ho — move bina record */
  const moveElementLive = (id, patch) => {
    setDesigns((prev) => ({
      ...prev,
      [side]: prev[side].map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }));
  };

  const deleteElement = (id) => {
    saveHistory();

    setDesigns((prev) => ({
      ...prev,
      [side]: prev[side].filter(
        (e) => e.id !== id
      ),
    }));

    if (selectedId === id) setSelectedId(null);
  };

  const reorderElement = (id, dir) => {
    saveHistory();

    setDesigns((prev) => {
      const list = [...prev[side]];
      const idx = list.findIndex(
        (e) => e.id === id
      );
      const swap = idx + dir;

      if (
        idx < 0 ||
        swap < 0 ||
        swap >= list.length
      ) {
        return prev;
      }

      [list[idx], list[swap]] = [
        list[swap],
        list[idx],
      ];

      return { ...prev, [side]: list };
    });
  };

  const addTextElement = (kind) => {
    saveHistory();

    const preset = TEXT_KINDS.find(
      (k) => k.key === kind
    );

    /* same kind dobara add ho toh y thoda neeche */
    const sameKind = elements.filter(
      (e) => e.kind === kind
    ).length;

    const newEl = {
      id: uid(),
      type: "text",
      kind,
      label: preset.label,
      text: preset.placeholder,
      x: 50,
      y: Math.min(
        85,
        42 + sameKind * 14
      ),
      fontSize:
        kind === "company"
          ? 26
          : kind === "designation"
          ? 14
          : 20,
      fontFamily: "Poppins",
      color: printColorFor(productColor),
      bold: kind === "company",
      italic: false,
      underline: false,
      align: "center",
      letterSpacing: 1,
      rotation: 0,
      hidden: false,
    };

    setDesigns((prev) => ({
      ...prev,
      [side]: [...prev[side], newEl],
    }));

    setSelectedId(newEl.id);
    setActiveTool("text");
  };

  /* =====================================================
     LOGO / IMAGE UPLOAD
  ===================================================== */

  const handleLogoUpload = (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      saveHistory();

      const newEl = {
        id: uid(),
        type: "image",
        kind: "logo",
        label: file.name || "Logo",
        src: e.target.result,
        x: 50,
        y: 32,
        width: 38,
        rotation: 0,
        opacity: 1,
        hidden: false,
      };

      setDesigns((prev) => ({
        ...prev,
        [side]: [...prev[side], newEl],
      }));

      setSelectedId(newEl.id);
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  /* =====================================================
     DRAG (pointer — mouse + touch)
  ===================================================== */

  const startDrag = (el) => (event) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedId(el.id);
    saveHistory();

    const area = printAreaRef.current;
    if (!area) return;

    const rect =
      area.getBoundingClientRect();

    const startX = event.clientX;
    const startY = event.clientY;
    const initX = el.x;
    const initY = el.y;

    const onMove = (ev) => {
      const dx =
        ((ev.clientX - startX) / rect.width) *
        100;
      const dy =
        ((ev.clientY - startY) / rect.height) *
        100;

      moveElementLive(el.id, {
        x: Math.max(
          0,
          Math.min(100, initX + dx)
        ),
        y: Math.max(
          0,
          Math.min(100, initY + dy)
        ),
      });
    };

    const onUp = () => {
      window.removeEventListener(
        "pointermove",
        onMove
      );
      window.removeEventListener(
        "pointerup",
        onUp
      );
    };

    window.addEventListener(
      "pointermove",
      onMove
    );
    window.addEventListener(
      "pointerup",
      onUp
    );
  };

  /* =====================================================
     RESIZE HANDLE
  ===================================================== */

  const startResize = (el) => (event) => {
    event.preventDefault();
    event.stopPropagation();

    saveHistory();

    const area = printAreaRef.current;
    const rect = area
      ? area.getBoundingClientRect()
      : { width: 200 };

    const startX = event.clientX;
    const initSize =
      el.type === "image"
        ? el.width
        : el.fontSize;

    const onMove = (ev) => {
      const dx = ev.clientX - startX;

      if (el.type === "image") {
        const delta =
          (dx / rect.width) * 100;

        moveElementLive(el.id, {
          width: Math.max(
            10,
            Math.min(
              100,
              initSize + delta
            )
          ),
        });
      } else {
        moveElementLive(el.id, {
          fontSize: Math.max(
            10,
            Math.min(
              80,
              initSize + dx / 4
            )
          ),
        });
      }
    };

    const onUp = () => {
      window.removeEventListener(
        "pointermove",
        onMove
      );
      window.removeEventListener(
        "pointerup",
        onUp
      );
    };

    window.addEventListener(
      "pointermove",
      onMove
    );
    window.addEventListener(
      "pointerup",
      onUp
    );
  };

  /* =====================================================
     RESET
  ===================================================== */

  const resetDesign = () => {
    saveHistory();

    const shirtColor =
      selectedProduct?.color || "#ffffff";

    setDesigns(makeDefaultDesigns(shirtColor));

    setProductColor(shirtColor);

    setSize("M");

    setZoom(1);

    setSide("front");

    setSelectedId(null);

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

    const firstText =
      designs.front.find(
        (e) => e.type === "text"
      ) ||
      designs.back.find(
        (e) => e.type === "text"
      ) ||
      null;

    const firstImage =
      designs.front.find(
        (e) => e.type === "image"
      ) ||
      designs.back.find(
        (e) => e.type === "image"
      ) ||
      null;

    const findText = (kind) =>
      designs.front.find(
        (e) => e.kind === kind
      )?.text ||
      designs.back.find(
        (e) => e.kind === kind
      )?.text ||
      "";

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

      /* full design data */
      designs,

      companyName:
        findText("company"),

      personName:
        findText("person"),

      designation:
        findText("designation"),

      /* legacy fields (cart/orders compatibility) */
      logo:
        firstImage?.src || null,

      logoPosition: firstImage
        ? { x: firstImage.x, y: firstImage.y }
        : { x: 50, y: 31 },

      logoSize:
        firstImage?.width || 0,

      text:
        firstText?.text || "",

      textPosition: firstText
        ? { x: firstText.x, y: firstText.y }
        : { x: 50, y: 55 },

      textColor:
        firstText?.color || "#102a4c",

      fontSize:
        firstText?.fontSize || 25,

      fontFamily:
        firstText?.fontFamily || "Poppins",

      bold:
        firstText?.bold ?? true,

      italic:
        firstText?.italic ?? false,

      underline:
        firstText?.underline ?? false,

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
  ===================================================== */

  const placeOrder = () => {
    if (isPlacingOrder) {
      return;
    }

    const currentUser =
      getCurrentUser();

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

    const customProduct =
      createCustomProduct();

    const existingOrders =
      getExistingOrders();

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

    const userId =
      currentUser?.id ||
      currentUser?.email ||
      currentUser?.phone ||
      null;

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

      items: [orderItem],

      products: [orderItem],

      cart: [orderItem],

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

      shipping: 0,

      currency: "INR",

      source: "customizer",

      isCustomized: true,
    };

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

      saveOrderToServer(newOrder);
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

    setOrderSuccess(true);

    setIsPlacingOrder(false);
  };

  /* =====================================================
     GO TO MY ORDERS
  ===================================================== */

  const goToMyOrders = () => {
    navigate("/orders");
  };

  /* =====================================================
     SAVE DESIGN (per product)
  ===================================================== */

  const saveDesign = () => {
    try {
      const payload = {
        product: selectedProduct,
        designs,
        productColor,
        size,
        side,
        customerDescription,
        customerNote,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        `savedDesign_${selectedProduct?.id}`,
        JSON.stringify(payload)
      );

      localStorage.setItem(
        "savedCustomDesign",
        JSON.stringify(payload)
      );

      alert("Design saved successfully!");
    } catch (error) {
      console.error(
        "Design save error:",
        error
      );

      alert("Design save nahi ho paya.");
    }
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
     CANVAS (shared by editor + preview)
  ===================================================== */

  const renderCanvas = () => (
    <div
      className="product-canvas"
      style={{
        transform: `scale(${zoom})`,
      }}
    >
      <div className="real-product-preview">
        {isApparel ? (
          <GarmentSvg
            color={productColor}
            back={side === "back"}
          />
        ) : productImage ? (
          <img
            className="selected-product-image"
            src={productImage}
            alt={productName}
            draggable="false"
          />
        ) : (
          <GarmentSvg
            color={productColor}
            back={side === "back"}
          />
        )}

        {/* PRINTABLE AREA — design clipped inside */}
        <div
          ref={printAreaRef}
          className={
            preview
              ? "print-area preview-clean"
              : "print-area editing"
          }
          onPointerDown={() =>
            setSelectedId(null)
          }
        >
          {elements
            .filter((el) => !el.hidden)
            .map((el) =>
              el.type === "image" ? (
                <div
                  key={el.id}
                  className={`design-el design-image-el${
                    selectedId === el.id &&
                    !preview
                      ? " el-selected"
                      : ""
                  }`}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    width: `${el.width}%`,
                    opacity: el.opacity ?? 1,
                    transform: `translate(-50%,-50%) rotate(${el.rotation || 0}deg)`,
                  }}
                  onPointerDown={
                    preview
                      ? undefined
                      : startDrag(el)
                  }
                >
                  <img
                    src={el.src}
                    alt={el.label}
                    draggable="false"
                  />

                  {selectedId === el.id &&
                    !preview && (
                      <>
                        <button
                          type="button"
                          className="el-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(el.id);
                          }}
                        >
                          <X size={11} />
                        </button>

                        <button
                          type="button"
                          className="el-resize"
                          onPointerDown={startResize(el)}
                        >
                          ↘
                        </button>
                      </>
                    )}
                </div>
              ) : (
                <div
                  key={el.id}
                  className={`design-el design-text${
                    selectedId === el.id &&
                    !preview
                      ? " el-selected"
                      : ""
                  }`}
                  style={{
                    left: `${el.x}%`,
                    top: `${el.y}%`,
                    fontSize: `${el.fontSize}px`,
                    fontFamily: el.fontFamily,
                    color: el.color,
                    fontWeight: el.bold ? 700 : 400,
                    fontStyle: el.italic
                      ? "italic"
                      : "normal",
                    textDecoration: el.underline
                      ? "underline"
                      : "none",
                    letterSpacing: `${el.letterSpacing || 0}px`,
                    textAlign: el.align || "center",
                    transform: `translate(-50%,-50%) rotate(${el.rotation || 0}deg)`,
                  }}
                  onPointerDown={
                    preview
                      ? undefined
                      : startDrag(el)
                  }
                >
                  {el.text}

                  {selectedId === el.id &&
                    !preview && (
                      <>
                        <button
                          type="button"
                          className="el-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(el.id);
                          }}
                        >
                          <X size={11} />
                        </button>

                        <button
                          type="button"
                          className="el-resize"
                          onPointerDown={startResize(el)}
                        >
                          ↘
                        </button>
                      </>
                    )}
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );

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
     PREVIEW MODE
  ===================================================== */

  if (preview) {
    return (
      <div className="customizer-page">
        <section className="customizer-title">
          <button
            className="back-product"
            onClick={() => setPreview(false)}
          >
            <ArrowLeft size={18} />

            <span>Edit Design</span>
          </button>

          <div className="title-center">
            <h1>
              {productName} — {side === "front" ? "Front" : "Back"} Preview
            </h1>

            <p>
              This is how your print will
              look on the product
            </p>
          </div>

          <div className="side-switch">
            <button
              className={
                side === "front" ? "selected" : ""
              }
              onClick={() => setSide("front")}
            >
              Front
            </button>

            <button
              className={
                side === "back" ? "selected" : ""
              }
              onClick={() => setSide("back")}
            >
              Back
            </button>
          </div>
        </section>

        <main className="preview-main">
          <div className="preview-stage">
            {renderCanvas()}
          </div>

          <div className="preview-actions">
            <button
              type="button"
              className="save-design-btn"
              onClick={() => setPreview(false)}
            >
              <Type size={18} />
              Edit Design
            </button>

            <button
              type="button"
              className="add-cart-btn"
              onClick={addToCart}
            >
              <ShoppingCart size={18} />
              Add to Cart — ₹{totalPrice.toLocaleString("en-IN")}
            </button>
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     RETURN (EDITOR)
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
            onClick={() => {
              setSide("front");
              setSelectedId(null);
            }}
          >
            Front
          </button>

          <button
            className={
              side === "back"
                ? "selected"
                : ""
            }
            onClick={() => {
              setSide("back");
              setSelectedId(null);
            }}
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
              Add Logo
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
            onClick={() => {
              if (selectedElement) {
                deleteElement(
                  selectedElement.id
                );
              }
            }}
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

          {/* TEXT TOOL — quick add + selected text controls */}

          {activeTool === "text" && (
            <div className="settings-content">

              <h3>
                Add to Design
              </h3>

              <div className="quick-add-list">
                {TEXT_KINDS.map((kind) => (
                  <button
                    key={kind.key}
                    type="button"
                    className="quick-add-btn"
                    onClick={() =>
                      addTextElement(kind.key)
                    }
                  >
                    {kind.key === "company" && (
                      <Building2 size={16} />
                    )}
                    {kind.key === "person" && (
                      <User size={16} />
                    )}
                    {kind.key === "designation" && (
                      <Briefcase size={16} />
                    )}
                    {kind.key === "custom" && (
                      <Type size={16} />
                    )}
                    + {kind.label}
                  </button>
                ))}
              </div>

              {selectedElement?.type ===
                "text" && (
                <>
                  <h4>
                    {selectedElement.label}
                  </h4>

                  <input
                    className="text-input"
                    value={selectedElement.text}
                    onChange={(event) =>
                      moveElementLive(
                        selectedElement.id,
                        {
                          text:
                            event.target.value,
                        }
                      )
                    }
                    onBlur={() => saveHistory()}
                    placeholder="Enter your text"
                  />

                  <h4>Font</h4>

                  <select
                    className="font-select"
                    value={selectedElement.fontFamily}
                    onChange={(event) =>
                      updateElement(
                        selectedElement.id,
                        {
                          fontFamily:
                            event.target.value,
                        }
                      )
                    }
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>

                  <div className="format-buttons">
                    <button
                      className={
                        selectedElement.bold
                          ? "active-format"
                          : ""
                      }
                      onClick={() =>
                        updateElement(
                          selectedElement.id,
                          {
                            bold: !selectedElement.bold,
                          }
                        )
                      }
                    >
                      <Bold size={18} />
                    </button>

                    <button
                      className={
                        selectedElement.italic
                          ? "active-format"
                          : ""
                      }
                      onClick={() =>
                        updateElement(
                          selectedElement.id,
                          {
                            italic:
                              !selectedElement.italic,
                          }
                        )
                      }
                    >
                      <Italic size={18} />
                    </button>

                    <button
                      className={
                        selectedElement.underline
                          ? "active-format"
                          : ""
                      }
                      onClick={() =>
                        updateElement(
                          selectedElement.id,
                          {
                            underline:
                              !selectedElement.underline,
                          }
                        )
                      }
                    >
                      <Underline size={18} />
                    </button>

                    <button
                      onClick={() =>
                        updateElement(
                          selectedElement.id,
                          {
                            text:
                              selectedElement.text ===
                              selectedElement.text.toUpperCase()
                                ? selectedElement.text
                                    .toLowerCase()
                                    .replace(
                                      /(^|\s)\S/g,
                                      (c) =>
                                        c.toUpperCase()
                                    )
                                : selectedElement.text.toUpperCase(),
                          }
                        )
                      }
                    >
                      Aa
                    </button>
                  </div>

                  <h4>Text Color</h4>

                  <div className="color-row">
                    {textColors.map((color) => (
                      <button
                        key={color}
                        className={
                          selectedElement.color ===
                          color
                            ? "text-color selected-text-color"
                            : "text-color"
                        }
                        style={{
                          background: color,
                        }}
                        onClick={() =>
                          updateElement(
                            selectedElement.id,
                            { color }
                          )
                        }
                      />
                    ))}
                  </div>

                  <h4>Font Size</h4>

                  <div className="range-row">
                    <span>12</span>

                    <input
                      type="range"
                      min="12"
                      max="70"
                      value={selectedElement.fontSize}
                      onChange={(event) =>
                        moveElementLive(
                          selectedElement.id,
                          {
                            fontSize: Number(
                              event.target.value
                            ),
                          }
                        )
                      }
                      onMouseUp={() => saveHistory()}
                    />

                    <span>
                      {Math.round(
                        selectedElement.fontSize
                      )}
                    </span>
                  </div>

                  <h4>Letter Spacing</h4>

                  <div className="range-row">
                    <span>0</span>

                    <input
                      type="range"
                      min="0"
                      max="12"
                      value={
                        selectedElement.letterSpacing || 0
                      }
                      onChange={(event) =>
                        moveElementLive(
                          selectedElement.id,
                          {
                            letterSpacing: Number(
                              event.target.value
                            ),
                          }
                        )
                      }
                      onMouseUp={() => saveHistory()}
                    />

                    <span>
                      {selectedElement.letterSpacing || 0}
                    </span>
                  </div>

                  <h4>Rotation</h4>

                  <div className="range-row">
                    <span>-90°</span>

                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={selectedElement.rotation || 0}
                      onChange={(event) =>
                        moveElementLive(
                          selectedElement.id,
                          {
                            rotation: Number(
                              event.target.value
                            ),
                          }
                        )
                      }
                      onMouseUp={() => saveHistory()}
                    />

                    <span>
                      {selectedElement.rotation || 0}°
                    </span>
                  </div>

                  <h4>Alignment</h4>

                  <div className="alignment-buttons">
                    <button
                      className={
                        selectedElement.align === "left"
                          ? "selected-align"
                          : ""
                      }
                      onClick={() =>
                        updateElement(
                          selectedElement.id,
                          { align: "left" }
                        )
                      }
                    >
                      <AlignLeft />
                    </button>

                    <button
                      className={
                        selectedElement.align ===
                          "center" ||
                        !selectedElement.align
                          ? "selected-align"
                          : ""
                      }
                      onClick={() =>
                        updateElement(
                          selectedElement.id,
                          { align: "center" }
                        )
                      }
                    >
                      <AlignCenter />
                    </button>

                    <button
                      className={
                        selectedElement.align === "right"
                          ? "selected-align"
                          : ""
                      }
                      onClick={() =>
                        updateElement(
                          selectedElement.id,
                          { align: "right" }
                        )
                      }
                    >
                      <AlignRight />
                    </button>
                  </div>
                </>
              )}

            </div>
          )}

          {/* UPLOAD */}

          {activeTool === "upload" && (
            <div className="settings-content">

              <h3>
                Upload Logo / Image
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
                  PNG, JPG, WEBP, SVG —
                  transparent PNG recommended
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

              {selectedElement?.type ===
                "image" && (
                <>
                  <div className="uploaded-preview">
                    <img
                      src={selectedElement.src}
                      alt="Uploaded"
                    />
                  </div>

                  <h4>Logo Size</h4>

                  <div className="range-row">
                    <span>10%</span>

                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={selectedElement.width}
                      onChange={(event) =>
                        moveElementLive(
                          selectedElement.id,
                          {
                            width: Number(
                              event.target.value
                            ),
                          }
                        )
                      }
                      onMouseUp={() => saveHistory()}
                    />

                    <span>
                      {Math.round(
                        selectedElement.width
                      )}
                      %
                    </span>
                  </div>

                  <h4>Rotation</h4>

                  <div className="range-row">
                    <span>-90°</span>

                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={selectedElement.rotation || 0}
                      onChange={(event) =>
                        moveElementLive(
                          selectedElement.id,
                          {
                            rotation: Number(
                              event.target.value
                            ),
                          }
                        )
                      }
                      onMouseUp={() => saveHistory()}
                    />

                    <span>
                      {selectedElement.rotation || 0}°
                    </span>
                  </div>

                  <h4>Opacity</h4>

                  <div className="range-row">
                    <span>0.3</span>

                    <input
                      type="range"
                      min="0.3"
                      max="1"
                      step="0.05"
                      value={selectedElement.opacity ?? 1}
                      onChange={(event) =>
                        moveElementLive(
                          selectedElement.id,
                          {
                            opacity: Number(
                              event.target.value
                            ),
                          }
                        )
                      }
                      onMouseUp={() => saveHistory()}
                    />

                    <span>
                      {(
                        selectedElement.opacity ?? 1
                      ).toFixed(2)}
                    </span>
                  </div>

                  <button
                    className="delete-logo-btn"
                    onClick={() =>
                      deleteElement(
                        selectedElement.id
                      )
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

              {selectedElement?.type === "text" ? (
                <div className="large-color-grid">
                  {textColors.map((color) => (
                    <button
                      key={color}
                      style={{
                        background: color,
                      }}
                      className={
                        selectedElement.color === color
                          ? "color-selected"
                          : ""
                      }
                      onClick={() =>
                        updateElement(
                          selectedElement.id,
                          { color }
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="position-info">
                  Pehle shirt par kisi text ko
                  select karein, phir color
                  choose karein.
                </p>
              )}

            </div>
          )}

          {/* POSITION */}

          {activeTool === "position" && (
            <div className="settings-content">

              <h3>
                Position
              </h3>

              <p className="position-info">
                Shirt par element ko directly
                drag karke move karein. Ya
                quick position buttons use karein.
              </p>

              {selectedElement ? (
                <div className="position-buttons">
                  <button
                    onClick={() =>
                      updateElement(
                        selectedElement.id,
                        { x: 50, y: 30 }
                      )
                    }
                  >
                    Top Center
                  </button>

                  <button
                    onClick={() =>
                      updateElement(
                        selectedElement.id,
                        { x: 50, y: 50 }
                      )
                    }
                  >
                    Center
                  </button>

                  <button
                    onClick={() =>
                      updateElement(
                        selectedElement.id,
                        { x: 50, y: 70 }
                      )
                    }
                  >
                    Bottom Center
                  </button>

                  <button
                    onClick={() =>
                      updateElement(
                        selectedElement.id,
                        { x: 18, y: 22 }
                      )
                    }
                  >
                    Left Chest
                  </button>
                </div>
              ) : (
                <p className="position-info">
                  Koi element select nahi hai.
                  Shirt par click karke select
                  karein.
                </p>
              )}

            </div>
          )}

          {/* LAYERS */}

          {activeTool === "layers" && (
            <div className="settings-content">

              <h3>
                Layers — {side === "front" ? "Front" : "Back"}
              </h3>

              {elements.length === 0 && (
                <p className="position-info">
                  Is side par koi design element
                  nahi hai. Text ya logo add
                  karein.
                </p>
              )}

              {[...elements]
                .reverse()
                .map((el, i, arr) => {
                  const realIndex =
                    elements.indexOf(el);

                  return (
                    <div
                      key={el.id}
                      className={`layer-item${
                        selectedId === el.id
                          ? " layer-selected"
                          : ""
                      }`}
                      onClick={() =>
                        setSelectedId(el.id)
                      }
                    >
                      {el.type === "image" ? (
                        <img src={el.src} alt="" />
                      ) : (
                        <Type size={17} />
                      )}

                      <span className="layer-label">
                        {el.type === "image"
                          ? "Image"
                          : el.text ||
                            el.label}
                      </span>

                      <div className="layer-actions">
                        <button
                          type="button"
                          title="Move up"
                          disabled={i === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderElement(el.id, 1);
                          }}
                        >
                          <ChevronUp size={14} />
                        </button>

                        <button
                          type="button"
                          title="Move down"
                          disabled={i === arr.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            reorderElement(el.id, -1);
                          }}
                        >
                          <ChevronDown size={14} />
                        </button>

                        <button
                          type="button"
                          title={el.hidden ? "Show" : "Hide"}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateElement(el.id, {
                              hidden: !el.hidden,
                            });
                          }}
                        >
                          {el.hidden ? (
                            <EyeOff size={14} />
                          ) : (
                            <Eye size={14} />
                          )}
                        </button>

                        <button
                          type="button"
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteElement(el.id);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}

            </div>
          )}

        </section>

        {/* =================================================
            PRODUCT PREVIEW
        ================================================= */}

        <section className="product-area">

          <div className="product-canvas-wrapper">

            {renderCanvas()}

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
                      1.4,
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
                onClick={() =>
                  setPreview(true)
                }
              >
                <Eye />

                <span>
                  Preview
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
            onClick={saveDesign}
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
