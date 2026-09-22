import BusinessCardCustomizer from "./BusinessCardCustomizer";
import Customizer from "./Customizer";

export default function CustomizationPage() {
  const product = (() => {
    try {
      return JSON.parse(
        localStorage.getItem("selectedCustomizeProduct") || "null"
      );
    } catch {
      return null;
    }
  })();

  const identity = `${product?.name || ""} ${product?.category || ""}`.toLowerCase();
  const isBusinessCard = /(business card|visiting card|card)/.test(identity);

  return isBusinessCard
    ? <BusinessCardCustomizer />
    : <Customizer />;
}
