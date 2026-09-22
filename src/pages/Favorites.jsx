import React, { useEffect, useState } from "react";
import { Heart, ShoppingCart, ArrowRight, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Favorites.css";

function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);

  /* =====================================================
     LOAD FAVORITES
  ===================================================== */

  const loadFavorites = () => {
    try {
      const saved =
        localStorage.getItem("ananyaFavorites");

      const data = saved
        ? JSON.parse(saved)
        : [];

      setFavorites(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(
        "Favorites loading error:",
        error
      );

      setFavorites([]);
    }
  };

  /* =====================================================
     INITIAL LOAD + LISTENER
  ===================================================== */

  useEffect(() => {
    loadFavorites();

    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener(
      "ananyaFavoritesUpdated",
      handleFavoritesUpdate
    );

    window.addEventListener(
      "storage",
      handleFavoritesUpdate
    );

    return () => {
      window.removeEventListener(
        "ananyaFavoritesUpdated",
        handleFavoritesUpdate
      );

      window.removeEventListener(
        "storage",
        handleFavoritesUpdate
      );
    };
  }, []);

  /* =====================================================
     REMOVE FAVORITE
  ===================================================== */

  const removeFavorite = (id) => {
    const updatedFavorites =
      favorites.filter(
        (product) =>
          String(product.id) !== String(id)
      );

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "ananyaFavorites",
      JSON.stringify(updatedFavorites)
    );

    window.dispatchEvent(
      new Event("ananyaFavoritesUpdated")
    );
  };

  /* =====================================================
     PRODUCT CLICK
  ===================================================== */

  const openProduct = (product) => {
    navigate(`/product/${product.id}`, {
      state: {
        product,
      },
    });
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <main className="favorites-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="favorites-header">

        <div>

          <span className="favorites-label">
            YOUR COLLECTION
          </span>

          <h1>
            My Favorites
          </h1>

          <p>
            Products you love and want to
            keep for later.
          </p>

        </div>

        <div className="favorites-count">

          <Heart size={20} />

          <strong>
            {favorites.length}
          </strong>

          <span>
            Saved Items
          </span>

        </div>

      </section>


      {/* =================================================
          EMPTY FAVORITES
      ================================================= */}

      {favorites.length === 0 ? (

        <section className="empty-favorites">

          <div className="empty-heart">
            <Heart size={42} />
          </div>

          <h2>
            No Favorites Yet
          </h2>

          <p>
            You haven't added any products
            to your favorites.
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
          >
            Explore Products

            <ArrowRight size={18} />

          </button>

        </section>

      ) : (

        /* =================================================
           FAVORITES GRID
        ================================================= */

        <section className="favorites-products">

          <div className="favorites-grid">

            {favorites.map((product) => (

              <article
                className="favorite-card"
                key={product.id}
              >

                {/* IMAGE */}

                <div
                  className="favorite-image"
                  onClick={() =>
                    openProduct(product)
                  }
                >

                  <img
                    src={
                      product.images?.[0] ||
                      product.image ||
                      "https://via.placeholder.com/600x500?text=Product"
                    }
                    alt={
                      product.name ||
                      "Product"
                    }
                  />

                  {product.badge && (
                    <span className="favorite-badge">
                      {product.badge}
                    </span>
                  )}

                </div>


                {/* REMOVE */}

                <button
                  type="button"
                  className="remove-favorite"
                  onClick={() =>
                    removeFavorite(product.id)
                  }
                  title="Remove from favorites"
                >
                  <Trash2 size={17} />
                </button>


                {/* CONTENT */}

                <div className="favorite-content">

                  <span className="favorite-category">
                    {product.category ||
                      "General"}
                  </span>

                  <h3
                    onClick={() =>
                      openProduct(product)
                    }
                  >
                    {product.name ||
                      "Untitled Product"}
                  </h3>

                  <div className="favorite-rating">

                    <span>
                      ★★★★★
                    </span>

                    <small>
                      ({product.reviews || 0})
                    </small>

                  </div>

                  <p>
                    {product.description ||
                      "Premium quality customized product made for your brand and business."}
                  </p>


                  {/* PRICE */}

                  <div className="favorite-bottom">

                    <div className="favorite-price">

                      <strong>
                        ₹
                        {Number(
                          product.price || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      {Number(
                        product.oldPrice || 0
                      ) >
                        Number(
                          product.price || 0
                        ) && (

                        <del>
                          ₹
                          {Number(
                            product.oldPrice
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </del>

                      )}

                    </div>


                    <button
                      type="button"
                      className="view-product-btn"
                      onClick={() =>
                        openProduct(product)
                      }
                    >
                      <ShoppingCart
                        size={17}
                      />

                      View

                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        </section>

      )}

    </main>
  );
}

export default Favorites;