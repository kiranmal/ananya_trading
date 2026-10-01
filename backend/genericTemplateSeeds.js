/* Generic (non-business-card) product template seeds.
   Element format matches the Customizer.jsx canvas engine:
   designs = { front: [els], back: [els] }, x/y = % of print
   area, fontSize px, colors hex + separate opacity field.
   SAMPLE placeholder content only — customer replaces it.
   Seeded only for customizable products that still have no
   templates; DB stays authoritative afterwards. */

const T = (text, x, y, o = {}) => ({
  type: "text",
  kind: o.kind || "custom",
  label: o.label || "Text",
  text, x, y,
  fontSize: o.size || 14,
  fontFamily: o.font || "Poppins",
  color: o.color || "#172033",
  bold: !!o.bold,
  italic: !!o.italic,
  underline: !!o.underline,
  align: o.align || "center",
  letterSpacing: o.ls || 0,
  rotation: o.rotation || 0,
  hidden: false,
});

const S = (shape, x, y, o = {}) => ({
  type: "shape", shape,
  label: o.label || (shape === "line" ? "Line" : shape === "circle" ? "Circle" : "Rectangle"),
  x, y,
  width: o.w || 20,
  height: o.h || 20,
  color: o.color || "#172033",
  opacity: o.opacity ?? 1,
  rotation: o.rotation || 0,
  hidden: false,
});

const Q = (x, y, w = 22) => ({
  type: "qr", label: "QR Code",
  x, y, width: w, rotation: 0, opacity: 1, hidden: false,
});

const INK = "#16324f";
const ACCENT = "#1263bd";
const GOLD = "#c9a227";
const CORAL = "#ea580c";
const MUTED = "#5b6472";
const LIGHT = "#9aa4b2";

/* ============================================================
   PER-TYPE SEED SETS — each has exactly 4 named designs.
   design = { front: [...], back: [...] }
============================================================ */

const SETS = {
  /* ---------- T-SHIRT ---------- */
  tshirt: [
    {
      name: "Classic Chest Print",
      front: [
        T("ANANYA", 50, 34, { size: 30, bold: true, color: "#ffffff", ls: 4 }),
        T("TRADING CO.", 50, 46, { size: 15, color: "#ffffff", ls: 5 }),
        S("line", 50, 56, { w: 40, h: 2, color: "#ffffff" }),
        T("EST. 2015 • KANPUR", 50, 63, { size: 9, color: "#ffffff", ls: 2 }),
      ],
      back: [
        T("ATC", 50, 40, { size: 34, bold: true, color: "#ffffff", ls: 6 }),
        T("www.company.com", 50, 56, { size: 10, color: "#ffffff" }),
      ],
    },
    {
      name: "Streetwear Bold",
      front: [
        T("BUILD\nCREATE\nGROW", 50, 42, { size: 34, bold: true, color: "#0f172a", ls: 2, kind: "custom" }),
        S("rect", 50, 66, { w: 34, h: 8, color: "#0f172a" }),
        T("ANANYA TRADING CO.", 50, 66, { size: 9, color: "#ffffff", ls: 3 }),
      ],
      back: [
        T("TRADING CO.", 50, 50, { size: 16, bold: true, color: "#0f172a", ls: 8 }),
      ],
    },
    {
      name: "Minimal Logo Tee",
      front: [
        S("circle", 50, 36, { w: 12, h: 12, color: "#ffffff" }),
        T("AT", 50, 36, { size: 12, bold: true, color: INK }),
        T("ANANYA TRADING CO.", 50, 52, { size: 9, color: "#ffffff", ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Retro Badge",
      front: [
        S("circle", 50, 40, { w: 30, h: 30, color: "#f59e0b" }),
        S("circle", 50, 40, { w: 26, h: 26, color: "#ffffff" }),
        T("ATC", 50, 38, { size: 16, bold: true, color: "#b45309" }),
        T("PRINTING • BRANDING", 50, 46, { size: 6.5, color: "#92400e", ls: 1 }),
        T("EST. 2015", 50, 60, { size: 8, color: "#92400e", ls: 3 }),
      ],
      back: [],
    },
  ],

  /* ---------- POLO SHIRT (left-chest branding) ---------- */
  polo: [
    {
      name: "Left-Chest Logo",
      front: [
        S("circle", 30, 30, { w: 9, h: 9, color: "#ffffff" }),
        T("AT", 30, 30, { size: 9, bold: true, color: INK }),
        T("ANANYA TRADING", 42, 27, { size: 9, bold: true, color: "#ffffff", align: "left" }),
        T("CORPORATE", 42, 34, { size: 7, color: "#ffffff", align: "left", ls: 2 }),
      ],
      back: [
        T("ANANYA TRADING CO.", 50, 24, { size: 13, bold: true, color: "#ffffff", ls: 3 }),
      ],
    },
    {
      name: "Premium Executive",
      front: [
        T("AT", 30, 30, { size: 13, bold: true, color: GOLD, font: "Georgia" }),
        S("line", 30, 38, { w: 10, h: 2, color: GOLD }),
      ],
      back: [],
    },
    {
      name: "Sports Team",
      front: [
        T("07", 30, 30, { size: 22, bold: true, color: "#ffffff", font: "Montserrat" }),
        T("TEAM ANANYA", 30, 40, { size: 8, color: "#ffffff", ls: 2 }),
      ],
      back: [
        T("SHARMA", 50, 26, { size: 18, bold: true, color: "#ffffff", ls: 3 }),
        T("07", 50, 48, { size: 42, bold: true, color: "#ffffff", font: "Montserrat" }),
      ],
    },
    {
      name: "Clean Wordmark",
      front: [
        T("ANANYA", 32, 30, { size: 12, bold: true, color: "#ffffff", ls: 1 }),
      ],
      back: [],
    },
  ],

  /* ---------- WATER BOTTLE ---------- */
  bottle: [
    {
      name: "Corporate Wrap",
      front: [
        T("ANANYA", 50, 40, { size: 15, bold: true, color: "#ffffff", ls: 3 }),
        T("TRADING CO.", 50, 52, { size: 9, color: "#ffffff", ls: 4 }),
        S("line", 50, 60, { w: 30, h: 1.5, color: "#ffffff" }),
      ],
      back: [],
    },
    {
      name: "Sports Hydration",
      front: [
        T("HYDRATE", 50, 38, { size: 15, bold: true, color: "#ffffff", ls: 2, font: "Montserrat" }),
        T("MOVE • REPEAT", 50, 50, { size: 8, color: "#ffffff", ls: 3 }),
        T("YOUR NAME", 50, 64, { size: 8, color: "#ffffff", kind: "person", label: "Name" }),
      ],
      back: [],
    },
    {
      name: "Minimal Name",
      front: [
        T("ARUN SHARMA", 50, 48, { size: 11, bold: true, color: "#ffffff", ls: 1, kind: "person", label: "Name" }),
      ],
      back: [],
    },
    {
      name: "Premium Steel",
      front: [
        T("AT", 50, 40, { size: 18, bold: true, color: "#e8e8e8", font: "Georgia" }),
        T("ANANYA TRADING CO.", 50, 54, { size: 8, color: "#e8e8e8", ls: 3 }),
        T("PREMIUM QUALITY", 50, 63, { size: 6.5, color: "#e8e8e8", ls: 3 }),
      ],
      back: [],
    },
  ],

  /* ---------- PEN ---------- */
  pen: [
    {
      name: "Corporate Logo",
      front: [
        S("circle", 22, 50, { w: 7, h: 7, color: "#ffffff" }),
        T("AT", 22, 50, { size: 7, bold: true, color: INK }),
        T("ANANYA TRADING CO.", 52, 50, { size: 8.5, bold: true, color: "#ffffff", align: "left", ls: 1 }),
      ],
      back: [],
    },
    {
      name: "Executive Name",
      front: [
        T("ARUN SHARMA", 50, 50, { size: 8.5, color: "#ffffff", kind: "person", label: "Name", ls: 1 }),
        T("+91 98765 43210", 78, 50, { size: 7, color: "#ffffff", label: "Phone" }),
      ],
      back: [],
    },
    {
      name: "Minimal Brand",
      front: [
        T("ATC", 50, 50, { size: 10, bold: true, color: "#ffffff", ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Premium Gold",
      front: [
        T("ANANYA", 50, 50, { size: 9, bold: true, color: GOLD, font: "Georgia", ls: 2 }),
      ],
      back: [],
    },
  ],

  /* ---------- GIFT SET ---------- */
  giftset: [
    {
      name: "Corporate Executive",
      front: [
        S("rect", 50, 18, { w: 60, h: 12, color: INK }),
        T("ANANYA TRADING CO.", 50, 18, { size: 10, bold: true, color: "#ffffff", ls: 3 }),
        T("CORPORATE GIFT SET", 50, 44, { size: 9, color: MUTED, ls: 4 }),
        S("line", 50, 54, { w: 26, h: 1.5, color: ACCENT }),
        T("For", 50, 66, { size: 8, color: MUTED, italic: true }),
        T("RECIPIENT NAME", 50, 74, { size: 11, bold: true, color: INK, kind: "person", label: "Name" }),
      ],
      back: [
        T("www.company.com", 50, 80, { size: 8, color: MUTED }),
      ],
    },
    {
      name: "Premium Gift",
      front: [
        S("rect", 50, 50, { w: 74, h: 74, color: GOLD, opacity: 0.12 }),
        T("AT", 50, 40, { size: 22, bold: true, color: GOLD, font: "Georgia" }),
        T("ANANYA TRADING CO.", 50, 56, { size: 9, color: INK, ls: 3 }),
        T("WITH COMPLIMENTS", 50, 66, { size: 7, color: MUTED, ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Festival Gift",
      front: [
        T("HAPPY DIWALI", 50, 36, { size: 18, bold: true, color: "#b45309", font: "Georgia" }),
        S("line", 50, 46, { w: 30, h: 1.5, color: "#d97706" }),
        T("FROM ANANYA TRADING CO.", 50, 56, { size: 9, color: INK, ls: 2 }),
        T("Wishing you prosperity", 50, 66, { size: 8, color: MUTED, italic: true }),
      ],
      back: [],
    },
    {
      name: "Minimal Branding",
      front: [
        T("ANANYA\nTRADING CO.", 50, 46, { size: 14, bold: true, color: INK, ls: 2 }),
        S("line", 50, 62, { w: 20, h: 1.5, color: ACCENT }),
      ],
      back: [],
    },
  ],

  /* ---------- MUG ---------- */
  mug: [
    {
      name: "Corporate Mug",
      front: [
        T("ANANYA", 50, 38, { size: 17, bold: true, color: INK, ls: 3 }),
        T("TRADING CO.", 50, 50, { size: 10, color: MUTED, ls: 4 }),
        S("line", 50, 60, { w: 24, h: 1.5, color: ACCENT }),
        T("www.company.com", 50, 70, { size: 7.5, color: LIGHT }),
      ],
      back: [],
    },
    {
      name: "Quote Mug",
      front: [
        T("BEST\nDAD", 50, 40, { size: 26, bold: true, color: "#0f172a" }),
        S("rect", 50, 58, { w: 40, h: 7, color: "#0f172a" }),
        T("EST. FAMILY", 50, 58, { size: 7, color: "#ffffff", ls: 2 }),
      ],
      back: [],
    },
    {
      name: "Photo Memory",
      front: [
        T("OUR\nMEMORIES", 50, 32, { size: 12, bold: true, color: INK }),
        T("22 JUNE 2024", 50, 62, { size: 8, color: MUTED, ls: 3 }),
        T("❤", 50, 74, { size: 10, color: "#dc2626" }),
      ],
      back: [],
    },
    {
      name: "Creative Coffee",
      front: [
        T("CREATE", 50, 34, { size: 15, bold: true, color: CORAL, ls: 2 }),
        T("CONNECT • GROW", 50, 46, { size: 8, color: MUTED, ls: 2 }),
        S("circle", 34, 58, { w: 3, h: 3, color: CORAL }),
        S("circle", 50, 58, { w: 3, h: 3, color: "#fbbf24" }),
        S("circle", 66, 58, { w: 3, h: 3, color: CORAL }),
        T("ANANYA TRADING CO.", 50, 70, { size: 7.5, color: INK, ls: 2 }),
      ],
      back: [],
    },
  ],

  /* ---------- CAP ---------- */
  cap: [
    {
      name: "Front Logo",
      front: [
        S("circle", 50, 34, { w: 9, h: 9, color: "#ffffff" }),
        T("AT", 50, 34, { size: 9, bold: true, color: INK }),
        T("ANANYA TRADING", 50, 48, { size: 9, bold: true, color: "#ffffff", ls: 2 }),
      ],
      back: [],
    },
    {
      name: "Sport Number",
      front: [
        T("ATC", 50, 32, { size: 16, bold: true, color: "#ffffff", ls: 4, font: "Montserrat" }),
        T("EST. 2015", 50, 44, { size: 7, color: "#ffffff", ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Corporate Clean",
      front: [
        T("ANANYA TRADING CO.", 50, 38, { size: 10, bold: true, color: "#ffffff", ls: 1 }),
        S("line", 50, 47, { w: 24, h: 1.5, color: "#ffffff" }),
      ],
      back: [],
    },
    {
      name: "Wordmark Curve",
      front: [
        T("ATC", 50, 36, { size: 20, bold: true, color: "#ffffff", font: "Georgia", ls: 3 }),
      ],
      back: [],
    },
  ],

  /* ---------- TOTE BAG ---------- */
  "tote-bag": [
    {
      name: "Minimal Logo",
      front: [
        S("circle", 50, 38, { w: 14, h: 14, color: "#2f3e50" }),
        T("AT", 50, 38, { size: 13, bold: true, color: "#ffffff" }),
        T("ANANYA TRADING CO.", 50, 55, { size: 9, color: "#2f3e50", ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Eco Statement",
      front: [
        T("CARRY\nCARE", 50, 36, { size: 24, bold: true, color: "#166534" }),
        T("100% NATURAL CANVAS", 50, 56, { size: 8, color: "#4d7c0f", ls: 2 }),
        S("line", 50, 64, { w: 22, h: 1.5, color: "#166534" }),
      ],
      back: [],
    },
    {
      name: "Bold Type",
      front: [
        T("ANANYA", 50, 34, { size: 30, bold: true, color: "#111827", ls: 2 }),
        T("TRADING CO.", 50, 48, { size: 12, color: "#111827", ls: 6 }),
        T("PRINTING • BRANDING • PACKAGING", 50, 58, { size: 7, color: MUTED, ls: 1 }),
      ],
      back: [],
    },
    {
      name: "Corporate Tote",
      front: [
        S("rect", 50, 20, { w: 44, h: 9, color: INK }),
        T("ANANYA", 50, 20, { size: 9, bold: true, color: "#ffffff", ls: 2 }),
        T("TRADING CO.", 50, 42, { size: 14, bold: true, color: INK, ls: 4 }),
        T("www.company.com", 50, 72, { size: 8, color: LIGHT }),
      ],
      back: [],
    },
  ],

  /* ---------- PAPER BAG ---------- */
  "paper-bag": [
    {
      name: "Premium Retail",
      front: [
        S("rect", 50, 14, { w: 56, h: 10, color: INK }),
        T("ANANYA", 50, 14, { size: 10, bold: true, color: "#ffffff", ls: 3 }),
        T("TRADING CO.", 50, 36, { size: 17, bold: true, color: INK, ls: 5 }),
        T("PREMIUM PRINTED GOODS", 50, 46, { size: 7.5, color: MUTED, ls: 2 }),
        T("www.company.com", 50, 80, { size: 8, color: LIGHT }),
      ],
      back: [],
    },
    {
      name: "Minimal Brand",
      front: [
        T("AT", 50, 40, { size: 26, bold: true, color: INK }),
        T("ANANYA TRADING CO.", 50, 56, { size: 8, color: MUTED, ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Luxury Gold",
      front: [
        T("AT", 50, 34, { size: 24, bold: true, color: GOLD, font: "Georgia" }),
        S("line", 50, 46, { w: 20, h: 1.5, color: GOLD }),
        T("ANANYA TRADING CO.", 50, 54, { size: 8, color: "#3f3a2e", ls: 4 }),
        T("EST. 2015", 50, 63, { size: 7, color: GOLD, ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Eco Natural",
      front: [
        S("circle", 50, 34, { w: 11, h: 11, color: "#166534", opacity: 0.15 }),
        T("AT", 50, 34, { size: 12, bold: true, color: "#166534" }),
        T("ANANYA TRADING CO.", 50, 52, { size: 9, bold: true, color: "#166534", ls: 2 }),
        T("RECYCLED • REUSABLE", 50, 62, { size: 7, color: "#4d7c0f", ls: 2 }),
      ],
      back: [],
    },
  ],

  /* ---------- PRODUCT BOX ---------- */
  box: [
    {
      name: "Premium Packaging",
      front: [
        S("rect", 50, 16, { w: 58, h: 11, color: INK }),
        T("ANANYA", 50, 16, { size: 10, bold: true, color: "#ffffff", ls: 3 }),
        T("TRADING CO.", 50, 38, { size: 16, bold: true, color: INK, ls: 4 }),
        T("PREMIUM QUALITY", 50, 48, { size: 7.5, color: MUTED, ls: 3 }),
        S("line", 50, 58, { w: 22, h: 1.5, color: ACCENT }),
        T("www.company.com", 50, 82, { size: 8, color: LIGHT }),
      ],
      back: [
        T("ANANYA TRADING CO.", 50, 20, { size: 9, bold: true, color: INK, ls: 2 }),
        T("+91 98765 43210", 50, 60, { size: 8, color: MUTED, label: "Phone" }),
        T("hello@company.com", 50, 68, { size: 8, color: MUTED, label: "Email" }),
      ],
    },
    {
      name: "Minimal Box",
      front: [
        T("AT", 50, 36, { size: 24, bold: true, color: INK }),
        T("ANANYA TRADING CO.", 50, 52, { size: 8, color: MUTED, ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Corporate Packaging",
      front: [
        S("rect", 50, 14, { w: 100, h: 10, color: "#1263bd" }),
        T("ANANYA TRADING CO.", 50, 14, { size: 8, bold: true, color: "#ffffff", ls: 3 }),
        T("PRODUCT NAME", 50, 40, { size: 14, bold: true, color: INK, label: "Product Name" }),
        T("Kanpur • Uttar Pradesh", 50, 52, { size: 7.5, color: MUTED }),
      ],
      back: [
        T("NET WT. 500g   MRP ₹XXX", 50, 60, { size: 7.5, color: MUTED, label: "Pack Info" }),
        T("BATCH: ATC-000", 50, 68, { size: 7.5, color: MUTED, label: "Batch" }),
      ],
    },
    {
      name: "Luxury Packaging",
      front: [
        T("AT", 50, 32, { size: 22, bold: true, color: GOLD, font: "Georgia" }),
        S("line", 50, 44, { w: 18, h: 1.5, color: GOLD }),
        T("ANANYA", 50, 52, { size: 12, bold: true, color: "#2c2c2c", ls: 5 }),
        T("HANDCRAFTED QUALITY", 50, 62, { size: 6.5, color: GOLD, ls: 3 }),
      ],
      back: [],
    },
  ],

  /* ---------- VINYL STICKER ---------- */
  sticker: [
    {
      name: "Logo Sticker",
      front: [
        S("circle", 50, 44, { w: 34, h: 34, color: "#ffffff" }),
        S("circle", 50, 44, { w: 30, h: 30, color: INK }),
        T("ATC", 50, 44, { size: 18, bold: true, color: "#ffffff", ls: 2 }),
      ],
      back: [],
    },
    {
      name: "Product Sticker",
      front: [
        S("rect", 50, 50, { w: 76, h: 60, color: "#ffffff" }),
        T("ANANYA", 50, 30, { size: 14, bold: true, color: INK, ls: 2 }),
        T("PRODUCT NAME", 50, 44, { size: 12, bold: true, color: "#0f172a", label: "Product Name" }),
        T("NET WT. 250g  |  MRP ₹XXX", 50, 56, { size: 7, color: MUTED, label: "Pack Info" }),
        S("line", 50, 64, { w: 40, h: 1.5, color: ACCENT }),
      ],
      back: [],
    },
    {
      name: "Promo Burst",
      front: [
        S("circle", 50, 44, { w: 40, h: 40, color: "#dc2626" }),
        T("SALE", 50, 38, { size: 22, bold: true, color: "#ffffff" }),
        T("50% OFF", 50, 52, { size: 11, bold: true, color: "#fecaca" }),
      ],
      back: [],
    },
    {
      name: "Die-Cut Creative",
      front: [
        S("circle", 50, 40, { w: 30, h: 30, color: CORAL }),
        T("ATC", 50, 40, { size: 15, bold: true, color: "#ffffff" }),
        T("STICK WITH US", 50, 62, { size: 9, bold: true, color: CORAL, ls: 2 }),
      ],
      back: [],
    },
  ],

  /* ---------- PRODUCT LABEL ---------- */
  label: [
    {
      name: "Premium Label",
      front: [
        S("rect", 50, 50, { w: 84, h: 80, color: "#ffffff" }),
        S("rect", 50, 14, { w: 84, h: 8, color: INK }),
        T("ANANYA", 50, 14, { size: 8, bold: true, color: "#ffffff", ls: 2 }),
        T("PRODUCT NAME", 50, 30, { size: 14, bold: true, color: INK, label: "Product Name" }),
        T("Premium Quality", 50, 40, { size: 8, color: MUTED, italic: true }),
        S("line", 50, 48, { w: 30, h: 1.5, color: GOLD }),
        T("NET WT. 250g   MRP ₹XXX", 50, 60, { size: 7, color: "#374151", label: "Pack Info" }),
        T("BATCH: ATC-000   MFG: 2024", 50, 68, { size: 7, color: "#374151", label: "Batch" }),
        T("Kanpur, UP • +91 98765 43210", 50, 80, { size: 6.5, color: MUTED, label: "Contact" }),
      ],
      back: [],
    },
    {
      name: "Minimal Label",
      front: [
        S("rect", 50, 50, { w: 84, h: 80, color: "#ffffff" }),
        T("ANANYA", 50, 26, { size: 12, bold: true, color: INK, ls: 3 }),
        T("PRODUCT NAME", 50, 40, { size: 11, bold: true, color: "#0f172a", label: "Product Name" }),
        T("NET WT. 250g", 50, 56, { size: 7.5, color: MUTED, label: "Pack Info" }),
        T("MRP ₹XXX", 50, 64, { size: 7.5, color: MUTED }),
      ],
      back: [],
    },
    {
      name: "Retail Label",
      front: [
        S("rect", 50, 50, { w: 84, h: 80, color: "#0f172a" }),
        T("ANANYA TRADING", 50, 22, { size: 9, bold: true, color: "#ffffff", ls: 2 }),
        S("line", 50, 30, { w: 24, h: 1.5, color: GOLD }),
        T("PRODUCT NAME", 50, 44, { size: 13, bold: true, color: GOLD, label: "Product Name" }),
        T("NET WT. 250g | MRP ₹XXX", 50, 58, { size: 7, color: "#cbd5e1", label: "Pack Info" }),
        T("BATCH ATC-000", 50, 68, { size: 6.5, color: "#94a3b8", label: "Batch" }),
      ],
      back: [],
    },
    {
      name: "Heritage Label",
      front: [
        S("rect", 50, 50, { w: 84, h: 80, color: "#fdf6e8" }),
        S("rect", 50, 50, { w: 78, h: 74, color: "#fdf6e8" }),
        T("ATC", 50, 26, { size: 16, bold: true, color: "#92400e", font: "Georgia" }),
        T("PRODUCT NAME", 50, 40, { size: 11, bold: true, color: "#7c2d12", label: "Product Name" }),
        S("line", 50, 48, { w: 22, h: 1, color: "#b45309" }),
        T("NET WT. 250g  MRP ₹XXX", 50, 58, { size: 7, color: "#92400e", label: "Pack Info" }),
        T("BATCH: ATC-000", 50, 66, { size: 6.5, color: "#92400e", label: "Batch" }),
      ],
      back: [],
    },
  ],

  /* ---------- POSTER ---------- */
  poster: [
    {
      name: "Corporate Event",
      front: [
        S("rect", 50, 10, { w: 100, h: 16, color: INK }),
        T("ANANYA TRADING CO.", 50, 10, { size: 10, bold: true, color: "#ffffff", ls: 3 }),
        T("ANNUAL\nMEET", 50, 34, { size: 30, bold: true, color: INK, ls: 2, label: "Event Title" }),
        S("line", 50, 52, { w: 30, h: 2, color: ACCENT }),
        T("SATURDAY • 15 MARCH", 50, 60, { size: 11, bold: true, color: "#0f172a", label: "Date" }),
        T("10:00 AM ONWARDS", 50, 68, { size: 9, color: MUTED, label: "Time" }),
        T("HOTEL GRAND, KANPUR", 50, 76, { size: 9, color: MUTED, label: "Venue" }),
        T("RSVP: +91 98765 43210", 50, 88, { size: 8, color: ACCENT, label: "Contact" }),
      ],
      back: [],
    },
    {
      name: "Promo Event",
      front: [
        S("rect", 50, 20, { w: 86, h: 24, color: "#dc2626" }),
        T("BIG SALE", 50, 20, { size: 26, bold: true, color: "#ffffff", ls: 2, label: "Event Title" }),
        T("UP TO 50% OFF", 50, 40, { size: 13, bold: true, color: INK, label: "Offer" }),
        T("15–20 MARCH", 50, 52, { size: 10, color: MUTED, label: "Date" }),
        T("ALL STORES + ONLINE", 50, 62, { size: 9, color: MUTED, label: "Venue" }),
        T("www.company.com", 50, 80, { size: 9, color: ACCENT, label: "Website" }),
      ],
      back: [],
    },
    {
      name: "Festival",
      front: [
        S("circle", 50, 16, { w: 8, h: 8, color: "#f59e0b" }),
        T("DIWALI\nFEST", 50, 38, { size: 32, bold: true, color: "#b45309", font: "Georgia", label: "Event Title" }),
        T("MEGA DISCOUNT WEEK", 50, 56, { size: 10, color: "#92400e", ls: 2, label: "Offer" }),
        T("25–31 OCTOBER", 50, 66, { size: 10, bold: true, color: INK, label: "Date" }),
        T("+91 98765 43210", 50, 82, { size: 9, color: MUTED, label: "Contact" }),
      ],
      back: [],
    },
    {
      name: "Grand Launch",
      front: [
        T("SOMETHING NEW", 50, 16, { size: 9, color: MUTED, ls: 4 }),
        S("line", 50, 24, { w: 26, h: 1.5, color: ACCENT }),
        T("LAUNCHING\nSOON", 50, 42, { size: 30, bold: true, color: INK, label: "Event Title" }),
        T("APRIL 2025", 50, 60, { size: 12, bold: true, color: ACCENT, label: "Date" }),
        T("ANANYA TRADING CO.", 50, 84, { size: 9, color: MUTED, ls: 2 }),
      ],
      back: [],
    },
  ],

  /* ---------- BROCHURE ---------- */
  brochure: [
    {
      name: "Corporate Brochure",
      front: [
        S("rect", 50, 18, { w: 100, h: 22, color: INK }),
        T("ANANYA", 50, 18, { size: 14, bold: true, color: "#ffffff", ls: 4 }),
        T("CORPORATE\nPROFILE", 50, 44, { size: 22, bold: true, color: INK, ls: 2, label: "Title" }),
        S("line", 50, 60, { w: 24, h: 1.5, color: ACCENT }),
        T("PRINTING • BRANDING • PACKAGING", 50, 70, { size: 8, color: MUTED, ls: 2 }),
        T("www.company.com", 50, 86, { size: 8, color: ACCENT, label: "Website" }),
      ],
      back: [
        T("OUR SERVICES", 50, 20, { size: 14, bold: true, color: INK, label: "Title" }),
        T("Visiting Cards • Flyers • Brochures", 50, 34, { size: 9, color: MUTED }),
        T("T-Shirts • Mugs • Bottles • Pens", 50, 42, { size: 9, color: MUTED }),
        T("+91 98765 43210", 50, 78, { size: 8, color: MUTED, label: "Phone" }),
        T("hello@company.com", 50, 86, { size: 8, color: MUTED, label: "Email" }),
      ],
    },
    {
      name: "Product Brochure",
      front: [
        T("ANANYA TRADING CO.", 50, 14, { size: 9, bold: true, color: INK, ls: 3 }),
        T("PRODUCT\nCATALOG", 50, 36, { size: 24, bold: true, color: "#0f172a", label: "Title" }),
        S("rect", 50, 52, { w: 40, h: 8, color: "#f59e0b" }),
        T("2025 EDITION", 50, 52, { size: 9, bold: true, color: "#ffffff", ls: 2 }),
        T("www.company.com", 50, 84, { size: 8, color: MUTED, label: "Website" }),
      ],
      back: [],
    },
    {
      name: "Minimal Brochure",
      front: [
        T("AT", 50, 30, { size: 30, bold: true, color: INK }),
        T("ANANYA TRADING CO.", 50, 46, { size: 10, color: MUTED, ls: 3 }),
        S("line", 50, 56, { w: 20, h: 1.5, color: INK }),
        T("CORPORATE PROFILE 2025", 50, 64, { size: 7.5, color: LIGHT, ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Creative Brochure",
      front: [
        S("circle", 82, 20, { w: 18, h: 18, color: CORAL, opacity: 0.15 }),
        T("THINK\nPRINT\nGROW", 40, 38, { size: 26, bold: true, color: CORAL, align: "left", label: "Title" }),
        T("ANANYA TRADING CO.", 40, 64, { size: 9, color: INK, align: "left", ls: 2 }),
        T("hello@company.com", 40, 74, { size: 8, color: MUTED, align: "left", label: "Email" }),
      ],
      back: [],
    },
  ],

  /* ---------- FLYER ---------- */
  flyer: [
    {
      name: "Promo Flyer",
      front: [
        S("rect", 50, 22, { w: 90, h: 26, color: "#dc2626" }),
        T("MEGA\nSALE", 50, 22, { size: 24, bold: true, color: "#ffffff", label: "Title" }),
        T("FLAT 40% OFF EVERYTHING", 50, 42, { size: 11, bold: true, color: INK, label: "Offer" }),
        T("ANANYA TRADING CO.", 50, 56, { size: 9, color: MUTED, ls: 2 }),
        T("www.company.com | +91 98765 43210", 50, 82, { size: 8, color: ACCENT, label: "Contact" }),
      ],
      back: [],
    },
    {
      name: "Event Flyer",
      front: [
        T("ANANYA TRADING", 50, 12, { size: 9, bold: true, color: INK, ls: 3 }),
        S("line", 50, 20, { w: 30, h: 1.5, color: ACCENT }),
        T("OPEN\nHOUSE", 50, 38, { size: 30, bold: true, color: INK, label: "Title" }),
        T("15 MARCH • 10 AM", 50, 56, { size: 11, bold: true, color: "#0f172a", label: "Date" }),
        T("HOTEL GRAND, KANPUR", 50, 66, { size: 9, color: MUTED, label: "Venue" }),
        T("RSVP: hello@company.com", 50, 84, { size: 8, color: MUTED, label: "Contact" }),
      ],
      back: [],
    },
    {
      name: "Sale Burst",
      front: [
        S("circle", 50, 30, { w: 32, h: 32, color: "#f59e0b" }),
        T("50%", 50, 26, { size: 24, bold: true, color: "#ffffff" }),
        T("OFF", 50, 36, { size: 14, bold: true, color: "#ffffff" }),
        T("THIS WEEKEND ONLY", 50, 52, { size: 10, bold: true, color: INK, label: "Offer" }),
        T("ANANYA TRADING CO.", 50, 80, { size: 8, color: MUTED, ls: 2 }),
      ],
      back: [],
    },
    {
      name: "Corporate Flyer",
      front: [
        S("rect", 50, 10, { w: 100, h: 10, color: INK }),
        T("ANANYA TRADING CO.", 50, 10, { size: 8, bold: true, color: "#ffffff", ls: 2 }),
        T("WE PRINT\nEVERYTHING", 50, 34, { size: 24, bold: true, color: INK, label: "Title" }),
        T("Cards • Flyers • Apparel • Gifts", 50, 54, { size: 9, color: MUTED }),
        S("line", 50, 64, { w: 24, h: 1.5, color: ACCENT }),
        T("+91 98765 43210", 50, 76, { size: 9, color: INK, bold: true, label: "Phone" }),
        T("www.company.com", 50, 84, { size: 8, color: ACCENT, label: "Website" }),
      ],
      back: [],
    },
  ],

  /* ---------- ENVELOPE ---------- */
  envelope: [
    {
      name: "Corporate Envelope",
      front: [
        S("rect", 18, 22, { w: 26, h: 14, color: INK }),
        T("AT", 18, 22, { size: 10, bold: true, color: "#ffffff" }),
        T("ANANYA TRADING CO.", 50, 18, { size: 10, bold: true, color: INK, align: "right", ls: 1 }),
        T("Kanpur, Uttar Pradesh 208001", 50, 26, { size: 7.5, color: MUTED, align: "right" }),
        T("+91 98765 43210 • hello@company.com", 50, 33, { size: 7, color: MUTED, align: "right" }),
        S("line", 50, 44, { w: 90, h: 1, color: "#d8dce2" }),
      ],
      back: [
        T("ANANYA TRADING CO.", 50, 60, { size: 9, bold: true, color: INK }),
        T("www.company.com", 50, 68, { size: 7.5, color: MUTED }),
      ],
    },
    {
      name: "Minimal Envelope",
      front: [
        T("ATC", 16, 24, { size: 12, bold: true, color: INK }),
        T("ANANYA TRADING CO.  •  KANPUR", 52, 24, { size: 7.5, color: MUTED, align: "right" }),
        S("line", 50, 32, { w: 88, h: 1, color: "#d8dce2" }),
      ],
      back: [],
    },
    {
      name: "Classic Business",
      front: [
        T("ANANYA TRADING CO.", 16, 16, { size: 10, bold: true, color: INK }),
        T("Kanpur, Uttar Pradesh", 16, 24, { size: 7.5, color: MUTED }),
        T("hello@company.com", 16, 31, { size: 7.5, color: MUTED }),
        S("rect", 84, 20, { w: 12, h: 14, color: "#e5e7eb" }),
        T("STAMP", 84, 20, { size: 6, color: LIGHT }),
      ],
      back: [],
    },
    {
      name: "Branded Mailer",
      front: [
        S("rect", 50, 14, { w: 100, h: 12, color: "#1263bd" }),
        T("ANANYA TRADING CO.", 50, 14, { size: 9, bold: true, color: "#ffffff", ls: 2 }),
        T("www.company.com", 50, 92, { size: 7, color: MUTED }),
      ],
      back: [],
    },
  ],

  /* ---------- NOTEBOOK COVER ---------- */
  "spiral-notebook": [
    {
      name: "Corporate Cover",
      front: [
        S("rect", 50, 14, { w: 100, h: 12, color: INK }),
        T("ANANYA", 50, 14, { size: 9, bold: true, color: "#ffffff", ls: 3 }),
        T("TRADING CO.", 50, 40, { size: 22, bold: true, color: INK, ls: 3 }),
        T("NOTES & IDEAS", 50, 52, { size: 9, color: MUTED, ls: 4 }),
        S("line", 50, 62, { w: 24, h: 1.5, color: ACCENT }),
        T("www.company.com", 50, 84, { size: 8, color: LIGHT }),
      ],
      back: [
        T("ANANYA TRADING CO.", 50, 44, { size: 10, bold: true, color: INK, ls: 2 }),
        T("hello@company.com", 50, 54, { size: 8, color: MUTED }),
      ],
    },
    {
      name: "Minimal Cover",
      front: [
        T("NOTES", 50, 40, { size: 26, bold: true, color: "#0f172a", ls: 6 }),
        S("line", 50, 52, { w: 30, h: 1.5, color: "#0f172a" }),
        T("ANANYA TRADING CO.", 50, 62, { size: 8, color: MUTED, ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Creative Cover",
      front: [
        S("circle", 80, 18, { w: 16, h: 16, color: "#fbbf24", opacity: 0.35 }),
        T("IDEAS", 44, 36, { size: 30, bold: true, color: CORAL, align: "left" }),
        T("START HERE", 44, 50, { size: 11, color: "#9a3412", align: "left", ls: 3 }),
        T("ANANYA TRADING CO.", 44, 82, { size: 8, color: MUTED, align: "left", ls: 2 }),
      ],
      back: [],
    },
    {
      name: "Monogram Cover",
      front: [
        S("rect", 50, 42, { w: 34, h: 34, color: "#f3f4f6" }),
        T("AT", 50, 42, { size: 30, bold: true, color: INK, font: "Georgia" }),
        T("ANANYA TRADING CO.", 50, 66, { size: 8.5, color: MUTED, ls: 3 }),
      ],
      back: [],
    },
  ],

  /* ---------- LETTERHEAD ---------- */
  letterhead: [
    {
      name: "Corporate Letterhead",
      front: [
        S("rect", 50, 8, { w: 100, h: 10, color: INK }),
        T("ANANYA TRADING CO.", 24, 8, { size: 10, bold: true, color: "#ffffff", align: "left", ls: 1 }),
        T("Kanpur, Uttar Pradesh", 24, 15, { size: 7, color: MUTED }),
        S("line", 50, 20, { w: 92, h: 1.5, color: ACCENT }),
        S("rect", 50, 94, { w: 100, h: 8, color: "#f1f5f9" }),
        T("+91 98765 43210  |  hello@company.com  |  www.company.com", 50, 94, { size: 6.5, color: MUTED, label: "Contact" }),
      ],
      back: [],
    },
    {
      name: "Minimal Letterhead",
      front: [
        T("AT", 12, 10, { size: 16, bold: true, color: INK }),
        T("ANANYA TRADING CO.", 80, 9, { size: 10, bold: true, color: INK, align: "right" }),
        T("Printing • Branding • Packaging", 80, 15, { size: 7, color: MUTED, align: "right" }),
        S("line", 50, 20, { w: 92, h: 1, color: "#d8dce2" }),
        T("www.company.com", 50, 95, { size: 7, color: LIGHT }),
      ],
      back: [],
    },
    {
      name: "Executive Letterhead",
      front: [
        T("AT", 12, 10, { size: 15, bold: true, color: GOLD, font: "Georgia" }),
        T("ANANYA TRADING CO.", 80, 8, { size: 11, bold: true, color: "#111827", align: "right", font: "Georgia" }),
        T("Kanpur, Uttar Pradesh • India", 80, 15, { size: 6.5, color: MUTED, align: "right" }),
        S("line", 50, 20, { w: 92, h: 1.5, color: GOLD }),
        S("rect", 50, 95, { w: 100, h: 7, color: "#111827" }),
        T("hello@company.com • +91 98765 43210", 50, 95, { size: 6.5, color: "#d1d5db", label: "Contact" }),
      ],
      back: [],
    },
    {
      name: "Modern Letterhead",
      front: [
        S("rect", 8, 10, { w: 14, h: 14, color: "#6d28d9" }),
        T("AT", 8, 10, { size: 11, bold: true, color: "#ffffff" }),
        T("ANANYA TRADING CO.", 78, 8, { size: 11, bold: true, color: INK, align: "right" }),
        T("printing.branding.packaging", 78, 14, { size: 6.5, color: "#6d28d9", align: "right" }),
        S("line", 50, 22, { w: 92, h: 1, color: "#e2e8f0" }),
        T("www.company.com", 50, 95, { size: 7, color: MUTED }),
      ],
      back: [],
    },
  ],

  /* ---------- GENERIC FALLBACK (any other customizable
     product) — centered brand block ---------------------- */
  generic: [
    {
      name: "Corporate Brand",
      front: [
        T("ANANYA", 50, 36, { size: 22, bold: true, color: INK, ls: 3 }),
        T("TRADING CO.", 50, 48, { size: 11, color: MUTED, ls: 5 }),
        S("line", 50, 58, { w: 26, h: 1.5, color: ACCENT }),
        T("www.company.com", 50, 70, { size: 8, color: LIGHT }),
      ],
      back: [],
    },
    {
      name: "Minimal Mark",
      front: [
        T("AT", 50, 44, { size: 28, bold: true, color: INK }),
        T("ANANYA TRADING CO.", 50, 60, { size: 8, color: MUTED, ls: 3 }),
      ],
      back: [],
    },
    {
      name: "Bold Type",
      front: [
        T("ANANYA\nTRADING CO.", 50, 44, { size: 22, bold: true, color: "#0f172a", ls: 2 }),
      ],
      back: [],
    },
    {
      name: "Premium Gold",
      front: [
        T("AT", 50, 38, { size: 26, bold: true, color: GOLD, font: "Georgia" }),
        T("ANANYA TRADING CO.", 50, 54, { size: 9, color: "#3f3a2e", ls: 3 }),
      ],
      back: [],
    },
  ],
};

/* pick the right seed set for a product */
const setForProduct = (product) => {
  const type = String(
    product.customizationType ||
      product.customization_type ||
      product.type ||
      ""
  ).toLowerCase();
  const name = String(product.name || "").toLowerCase();

  if (type === "tshirt") return /polo/.test(name) ? SETS.polo : SETS.tshirt;
  if (type === "sticker") return /label/.test(name) ? SETS.label : SETS.sticker;
  if (SETS[type]) return SETS[type];
  return SETS.generic;
};

/* seed format → product_templates.design rows */
const genericSeedsFor = (product) =>
  setForProduct(product).map((t, i) => ({
    name: t.name,
    sortOrder: i,
    design: { front: t.front || [], back: t.back || [] },
  }));

module.exports = { genericSeedsFor, SETS };
