import React from "react";
import { useNavigate } from "react-router-dom";
import { Palette, ArrowRight } from "lucide-react";
import "./CustomizeProducts.css";

const customizeProducts = [
  {
    id: "custom-tshirt-white",
    name: "Custom T-Shirt",
    category: "APPAREL",
    price: 599,
    oldPrice: 799,
    badge: "POPULAR",
    description:
      "Upload your logo, add text and create your own premium T-shirt.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900",
    color: "#ffffff",
    type: "tshirt",
    customizationPrice: 199,
  },

  {
    id: "custom-tshirt-black",
    name: "Premium Black T-Shirt",
    category: "APPAREL",
    price: 699,
    oldPrice: 899,
    badge: "TRENDING",
    description:
      "Create a professional black T-shirt with your custom branding.",
    image:
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=900",
    color: "#17191f",
    type: "tshirt",
    customizationPrice: 199,
  },

  {
    id: "custom-tshirt-navy",
    name: "Corporate Navy T-Shirt",
    category: "CORPORATE",
    price: 699,
    oldPrice: 899,
    badge: "NEW",
    description:
      "Perfect branded T-shirt for teams, companies and events.",
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f37f2096?w=900",
    color: "#102c4c",
    type: "tshirt",
    customizationPrice: 199,
  },

  {
    id: "custom-hoodie",
    name: "Custom Premium Hoodie",
    category: "HOODIES",
    price: 899,
    oldPrice: 1199,
    badge: "PREMIUM",
    description:
      "Design a premium hoodie with your own logo and personalized text.",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900",
    color: "#eeeeee",
    type: "hoodie",
    customizationPrice: 249,
  },
];

function CustomizeProducts() {
  const navigate = useNavigate();

  /*
  ============================================================
  OPEN CUSTOMIZER
  ============================================================
  */

  const openCustomizer = (product) => {
    // Selected product browser storage mein save hoga
    localStorage.setItem(
      "selectedCustomizeProduct",
      JSON.stringify(product)
    );

    // Customizer page open
    navigate("/customize");
  };

  return (
    <section
      className="customize-products-section"
      id="customize-products"
    >
      {/* =====================================================
          SECTION HEADING
      ===================================================== */}

      <div className="section-heading customize-heading">
        <div>
          <span>CUSTOMIZE YOUR STYLE</span>

          <h2>
            Create Products
            <br />
            Your Way
          </h2>
        </div>

        <p>
          Choose any product and make it completely yours.
          Upload your logo, add text and create a unique
          product instantly.
        </p>
      </div>

      {/* =====================================================
          PRODUCT GRID
      ===================================================== */}

      <div className="customize-product-grid">
        {customizeProducts.map((product) => (
          <article
            className="customize-product-card"
            key={product.id}
            onClick={() => openCustomizer(product)}
          >
            {/* =================================================
                PRODUCT IMAGE
            ================================================= */}

            <div className="customize-product-image">
              <img
                src={product.image}
                alt={product.name}
                loading="lazy"
              />

              {/* BADGE */}

              <span className="customize-product-badge">
                {product.badge}
              </span>

              {/* OVERLAY */}

              <div className="customize-image-overlay">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCustomizer(product);
                  }}
                >
                  <Palette size={17} />
                  Customize Now
                </button>
              </div>
            </div>

            {/* =================================================
                PRODUCT CONTENT
            ================================================= */}

            <div className="customize-product-content">
              {/* CATEGORY */}

              <span className="customize-product-category">
                {product.category}
              </span>

              {/* RATING */}

              <div className="customize-product-rating">
                <span>★★★★★</span>
                <small>4.9</small>
              </div>

              {/* NAME */}

              <h3>{product.name}</h3>

              {/* DESCRIPTION */}

              <p>{product.description}</p>

              {/* PRICE */}

              <div className="customize-price-row">
                <div className="customize-price">
                  <strong>
                    ₹{product.price.toLocaleString("en-IN")}
                  </strong>

                  <del>
                    ₹{product.oldPrice.toLocaleString("en-IN")}
                  </del>
                </div>
              </div>

              {/* BUTTON */}

              <div className="customize-product-actions">
                <button
                  type="button"
                  className="customize-view-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCustomizer(product);
                  }}
                >
                  Customize Product

                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <div className="customize-bottom-cta">
        <div>
          <strong>Have your own design?</strong>

          <span>
            Upload your logo and start customizing in seconds.
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            openCustomizer(customizeProducts[0])
          }
        >
          Start Designing

          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}

export default CustomizeProducts;