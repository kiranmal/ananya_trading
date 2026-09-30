import BusinessCardCustomizer from "./BusinessCardCustomizer";
import Customizer from "./Customizer";
import { useNavigate } from "react-router-dom";

/* ============================================================
   CUSTOMIZATION PAGE

   customizationType ke hisaab se sahi editor load hota hai.
   Sirf customizable === true products hi editor kholte hain.
============================================================ */

const EDITOR_BY_TYPE = {
  "business-card": "card",
  "spiral-notebook": "notebook",
  notebook: "notebook",
  tshirt: "apparel",
  hoodie: "apparel",
};

export default function CustomizationPage() {
  const navigate = useNavigate();

  const product = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("selectedCustomizeProduct") || "null"
      );
    } catch {
      return null;
    }
  })();

  /* ── product not found ── */
  if (!product || (!product.id && !product.name)) {
    return (
      <div className="customizer-loading">
        <div>
          <h2>Product not found.</h2>
          <p>
            Pehle product listing se koi product
            select karein.
          </p>
          <button onClick={() => navigate("/")}>
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  /* ── customizable check ── */
  const custType = String(
    product.customizationType ||
      product.type ||
      ""
  ).toLowerCase();

  const isCustomizable = Boolean(
    product.customizable ||
      product.isCustomizable ||
      product.customizationType ||
      custType
  );

  if (!isCustomizable) {
    return (
      <div className="customizer-loading">
        <div>
          <h2>
            This product does not support
            customization.
          </h2>
          <p>
            {product.name} ke liye
            customization available nahi hai.
          </p>
          <button onClick={() => navigate(-1)}>
            Back to Product
          </button>
        </div>
      </div>
    );
  }

  /* ── editor pick: field first, then name fallback ── */
  const identity =
    `${product.name || ""} ${product.category || ""}`.toLowerCase();

  const editorKind =
    EDITOR_BY_TYPE[custType] ||
    (/(business card|visiting card)/.test(identity)
      ? "card"
      : /notebook/.test(identity)
      ? "notebook"
      : "apparel");

  return editorKind === "card" ? (
    <BusinessCardCustomizer />
  ) : (
    <Customizer />
  );
}
