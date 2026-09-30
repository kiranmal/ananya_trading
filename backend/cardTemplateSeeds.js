/* Builtin business-card template seeds — exact port of the
   legacy hardcoded frontend templates. Used once at startup
   to migrate them into product_templates per business-card
   product. DB is the source of truth afterwards.
   Neutral placeholders only — never real customer data. */

let _seq = 0;
const uid = () => `el-${Date.now()}-${++_seq}`;

const makeText = (text = "Edit text", x = 50, y = 50, overrides = {}) => ({
  id: uid(), type: "text", label: overrides.label || "", text, x, y,
  width: 42, fontFamily: "Inter", fontSize: 18, fontWeight: 500,
  italic: false, underline: false, color: "#172033", align: "left",
  letterSpacing: 0, lineHeight: 1.2, rotation: 0, opacity: 1, visible: true,
  ...overrides,
});

const makeIcon = (icon = "Phone", x = 15, y = 72, overrides = {}) => ({
  id: uid(), type: "icon", label: icon, icon, x, y,
  width: 7, color: "#172033", rotation: 0, opacity: 1, visible: true,
  ...overrides,
});

const makeShape = (shape = "rectangle", x = 50, y = 50, overrides = {}) => ({
  id: uid(), type: "shape",
  label: shape === "circle" ? "Circle" : shape === "line" ? "Line" : "Rectangle",
  shape, x, y, width: 25, color: "#2563eb", rotation: 0, opacity: 1, visible: true,
  ...overrides,
});

const TEMPLATES = {
  Minimal: {
    frontDesign: {
      background: "#ffffff", gradient: "", backgroundImage: "",
      elements: [
        makeShape("line", 50, 58, { width: 30, color: "#e2e8f0", label: "Divider" }),
        makeText("YOUR NAME", 50, 30, { fontSize: 24, fontWeight: 700, width: 80, align: "center", label: "Name" }),
        makeText("YOUR DESIGNATION", 50, 44, { fontSize: 10, letterSpacing: 3, color: "#64748b", width: 60, align: "center", label: "Designation" }),
        makeIcon("Phone", 30, 70, { width: 4, color: "#94a3b8" }),
        makeText("+91 00000 00000", 50, 70, { fontSize: 9, width: 30, color: "#475569", align: "center", label: "Phone" }),
        makeIcon("Mail", 30, 82, { width: 4, color: "#94a3b8" }),
        makeText("you@example.com", 50, 82, { fontSize: 9, width: 30, color: "#475569", align: "center", label: "Email" }),
      ],
    },
    backDesign: {
      background: "#ffffff", gradient: "", backgroundImage: "",
      elements: [
        makeText("YN", 50, 40, { fontSize: 48, fontWeight: 800, color: "#e2e8f0", align: "center", width: 40, label: "Monogram" }),
        makeText("www.example.com", 50, 70, { fontSize: 9, color: "#94a3b8", align: "center", width: 60, label: "Website" }),
      ],
    },
  },
  Luxury: {
    frontDesign: {
      background: "#111111", gradient: "linear-gradient(135deg, #090909, #26211a)", backgroundImage: "",
      elements: [
        makeShape("line", 50, 46, { width: 20, color: "#d4af37", label: "Gold Line" }),
        makeText("YN", 50, 25, { fontSize: 36, fontWeight: 700, color: "#d4af37", align: "center", width: 30, letterSpacing: 4, label: "Monogram" }),
        makeText("YOUR NAME", 50, 58, { fontSize: 18, color: "#ffffff", align: "center", width: 70, letterSpacing: 3, label: "Name" }),
        makeText("YOUR DESIGNATION", 50, 70, { fontSize: 9, color: "#d4af37", align: "center", width: 50, letterSpacing: 3, label: "Designation" }),
        makeIcon("Phone", 28, 86, { width: 3.5, color: "#d4af37" }),
        makeText("+91 00000 00000", 42, 86, { fontSize: 8, color: "#a89060", width: 22, label: "Phone" }),
        makeIcon("Mail", 62, 86, { width: 3.5, color: "#d4af37" }),
        makeText("you@example.com", 76, 86, { fontSize: 8, color: "#a89060", width: 22, label: "Email" }),
      ],
    },
    backDesign: {
      background: "#111111", gradient: "linear-gradient(135deg, #090909, #26211a)", backgroundImage: "",
      elements: [
        makeShape("rectangle", 50, 50, { width: 92, color: "rgba(212,175,55,0.08)", label: "Border" }),
        makeText("YN", 50, 42, { fontSize: 56, fontWeight: 800, color: "#d4af37", align: "center", width: 40, letterSpacing: 6, label: "Monogram" }),
        makeText("YOUR COMPANY", 50, 68, { fontSize: 9, color: "#a89060", align: "center", width: 50, letterSpacing: 4, label: "Tagline" }),
      ],
    },
  },
  Corporate: {
    frontDesign: {
      background: "#f8fafc", gradient: "linear-gradient(120deg, #0f3d68 0 34%, #f8fafc 34%)", backgroundImage: "",
      elements: [
        makeText("YN", 16, 42, { fontSize: 32, fontWeight: 700, color: "#ffffff", align: "center", width: 25, label: "Monogram" }),
        makeText("Your Name", 60, 24, { fontSize: 22, fontWeight: 700, width: 48, label: "Name" }),
        makeText("Your Designation", 60, 38, { fontSize: 11, color: "#2563eb", width: 42, label: "Designation" }),
        makeShape("line", 60, 48, { width: 15, color: "#2563eb", label: "Divider" }),
        makeIcon("Phone", 44, 58, { width: 3.5, color: "#2563eb" }),
        makeText("+91 00000 00000", 62, 58, { fontSize: 9, color: "#475569", width: 30, label: "Phone" }),
        makeIcon("Mail", 44, 68, { width: 3.5, color: "#2563eb" }),
        makeText("you@example.com", 62, 68, { fontSize: 9, color: "#475569", width: 30, label: "Email" }),
        makeIcon("Globe", 44, 78, { width: 3.5, color: "#2563eb" }),
        makeText("www.example.com", 62, 78, { fontSize: 9, color: "#475569", width: 30, label: "Website" }),
        makeIcon("MapPin", 44, 88, { width: 3.5, color: "#2563eb" }),
        makeText("Your City, India", 62, 88, { fontSize: 9, color: "#475569", width: 30, label: "Address" }),
      ],
    },
    backDesign: {
      background: "#0f3d68", gradient: "", backgroundImage: "",
      elements: [
        makeText("COMPANY", 50, 35, { fontSize: 28, fontWeight: 800, color: "#ffffff", align: "center", width: 80, letterSpacing: 5, label: "Company" }),
        makeText("TAGLINE", 50, 52, { fontSize: 14, color: "#60a5fa", align: "center", width: 60, letterSpacing: 6, label: "Tagline" }),
        makeShape("line", 50, 65, { width: 20, color: "#60a5fa", label: "Divider" }),
        makeText("www.example.com", 50, 78, { fontSize: 9, color: "#93c5fd", align: "center", width: 50, label: "Website" }),
      ],
    },
  },
  Modern: {
    frontDesign: {
      background: "#ffffff", gradient: "linear-gradient(145deg, #ffffff 0 72%, #7c3aed 72%)", backgroundImage: "",
      elements: [
        makeText("YOUR", 12, 22, { fontSize: 30, fontWeight: 800, width: 40, lineHeight: 1, label: "First Name" }),
        makeText("NAME", 12, 36, { fontSize: 30, fontWeight: 800, width: 45, lineHeight: 1, label: "Last Name" }),
        makeText("YOUR DESIGNATION", 12, 52, { fontSize: 9, color: "#7c3aed", letterSpacing: 3, width: 40, label: "Designation" }),
        makeShape("line", 12, 62, { width: 12, color: "#7c3aed", label: "Accent Line" }),
        makeIcon("Mail", 8, 74, { width: 3.5, color: "#7c3aed" }),
        makeText("you@example.com", 22, 74, { fontSize: 9, color: "#64748b", width: 35, label: "Email" }),
        makeIcon("Phone", 8, 84, { width: 3.5, color: "#7c3aed" }),
        makeText("+91 00000 00000", 22, 84, { fontSize: 9, color: "#64748b", width: 35, label: "Phone" }),
        makeText("YN", 84, 86, { fontSize: 22, fontWeight: 800, color: "#ffffff", align: "center", width: 15, label: "Monogram" }),
      ],
    },
    backDesign: {
      background: "#7c3aed", gradient: "", backgroundImage: "",
      elements: [
        makeText("YN", 50, 40, { fontSize: 60, fontWeight: 800, color: "rgba(255,255,255,0.12)", align: "center", width: 50, label: "Monogram" }),
        makeText("www.example.com", 50, 72, { fontSize: 10, color: "#e9d5ff", align: "center", width: 60, label: "Website" }),
      ],
    },
  },
  Creative: {
    frontDesign: {
      background: "#fff7ed", gradient: "radial-gradient(circle at 85% 20%, #fb7185 0 18%, transparent 18%), linear-gradient(135deg, #fff7ed, #fef3c7)", backgroundImage: "",
      elements: [
        makeShape("circle", 87, 20, { width: 5, color: "#fbbf24", label: "Dot Accent" }),
        makeText("Your", 14, 24, { fontSize: 28, fontWeight: 800, color: "#7c2d12", width: 45, label: "First Name" }),
        makeText("Name", 14, 40, { fontSize: 28, fontWeight: 800, color: "#ea580c", width: 45, label: "Last Name" }),
        makeText("Your Designation", 14, 56, { fontSize: 11, color: "#ea580c", width: 50, label: "Designation" }),
        makeShape("line", 14, 65, { width: 10, color: "#fb923c", label: "Accent Line" }),
        makeIcon("Mail", 10, 76, { width: 3.5, color: "#ea580c" }),
        makeText("you@example.com", 22, 76, { fontSize: 9, color: "#9a3412", width: 35, label: "Email" }),
        makeIcon("Instagram", 10, 86, { width: 3.5, color: "#ea580c" }),
        makeText("@yourhandle", 22, 86, { fontSize: 9, color: "#9a3412", width: 35, label: "Social" }),
      ],
    },
    backDesign: {
      background: "#fff7ed", gradient: "linear-gradient(135deg, #fff7ed, #fef3c7)", backgroundImage: "",
      elements: [
        makeShape("circle", 80, 25, { width: 28, color: "rgba(251,113,133,0.15)", label: "Circle Accent" }),
        makeShape("circle", 20, 75, { width: 16, color: "rgba(251,191,36,0.15)", label: "Circle Accent 2" }),
        makeText("YOUR\nCOMPANY", 50, 40, { fontSize: 24, fontWeight: 800, color: "#7c2d12", align: "center", width: 70, lineHeight: 1.1, label: "Company" }),
        makeText("www.example.com", 50, 70, { fontSize: 9, color: "#9a3412", align: "center", width: 50, label: "Website" }),
      ],
    },
  },
};

/* Built as an ordered array for the DB seed */
const CARD_TEMPLATE_SEEDS = Object.entries(TEMPLATES).map(
  ([name, design], index) => ({
    name,
    sortOrder: index,
    design: {
      frontDesign: design.frontDesign,
      backDesign: design.backDesign,
    },
  })
);

module.exports = { CARD_TEMPLATE_SEEDS };
