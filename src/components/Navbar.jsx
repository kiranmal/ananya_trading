import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./Navbar.css";
import ananyaLogo from "../assets/ananya-logo.png";

import { getProducts } from "../data/productStorage";

/* =====================================================
   CATEGORIES
===================================================== */

const categories = [
  {
    name: "Visiting Cards",
    items: [
      "Premium Business Cards",
      "Standard Cards",
      "Matte Cards",
      "Glossy Cards",
    ],
  },

  {
    name: "Stationery & Office",
    items: [
      "Letterheads",
      "Notebooks",
      "Envelopes",
      "Office Files",
      "Stamps",
    ],
  },

  {
    name: "Marketing Materials",
    items: [
      "Flyers",
      "Brochures",
      "Posters",
      "Leaflets",
      "Calendars",
    ],
  },

  {
    name: "Stickers & Labels",
    items: [
      "Product Labels",
      "Vinyl Stickers",
      "Round Stickers",
      "Packaging Labels",
    ],
  },

  {
    name: "Packaging",
    items: [
      "Paper Bags",
      "Boxes",
      "Food Packaging",
      "Product Packaging",
    ],
  },

  {
    name: "Clothing & Bags",
    items: [
      "T-Shirts",
      "Caps",
      "Tote Bags",
      "Corporate Bags",
    ],
  },

  {
    name: "Mugs & Gifts",
    items: [
      "Coffee Mugs",
      "Photo Mugs",
      "Keychains",
      "Corporate Gifts",
    ],
  },

  {
    name: "Pens & Drinkware",
    items: [
      "Ball Pens",
      "Premium Pens",
      "Water Bottles",
      "Travel Mugs",
    ],
  },

  {
    name: "Custom Polo T-Shirts",
    items: [
      "Corporate Polo",
      "Printed Polo",
      "Custom T-Shirts",
    ],
  },
];

/* =====================================================
   SEARCH ICON
===================================================== */

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="nav-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

/* =====================================================
   USER ICON
===================================================== */

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="nav-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c.7-4.2 3.3-6.5 8-6.5s7.3 2.3 8 6.5" />
    </svg>
  );
}

/* =====================================================
   HEART ICON
===================================================== */

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="nav-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M20.8 8.8c0 5.5-8.8 10.2-8.8 10.2S3.2 14.3 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" />
    </svg>
  );
}

/* =====================================================
   CART ICON
===================================================== */

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="nav-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 4h2l2.1 11h10.7L21 7H6" />

      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

/* =====================================================
   MENU ICON
===================================================== */

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="nav-svg"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

/* =====================================================
   NAVBAR
===================================================== */

function Navbar() {
  const navigate = useNavigate();

  /* =====================================================
     CATEGORY STATES
  ===================================================== */

  const [openCategory, setOpenCategory] = useState(null);

  const [mobileMenu, setMobileMenu] = useState(false);

  /* =====================================================
     SEARCH STATES
  ===================================================== */

  const [searchText, setSearchText] = useState("");

  const [products, setProducts] = useState([]);

  const [showSearchResults, setShowSearchResults] =
    useState(false);

  /* =====================================================
     CART COUNT
  ===================================================== */

  const [cartCount, setCartCount] = useState(0);

  /* =====================================================
     FAVORITE COUNT
  ===================================================== */

  const [favoriteCount, setFavoriteCount] =
    useState(0);

  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  const loadProducts = () => {
    try {
      const allProducts = getProducts();

      setProducts(
        Array.isArray(allProducts)
          ? allProducts
          : []
      );
    } catch (error) {
      console.error(
        "Search products loading error:",
        error
      );

      setProducts([]);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadProducts();

    const handleProductsUpdate = () => {
      loadProducts();
    };

    window.addEventListener(
      "ananyaProductsUpdated",
      handleProductsUpdate
    );

    return () => {
      window.removeEventListener(
        "ananyaProductsUpdated",
        handleProductsUpdate
      );
    };
  }, []);

  /* =====================================================
     SEARCH RESULTS
  ===================================================== */

  const searchResults =
    searchText.trim().length === 0
      ? []
      : products
          .filter((product) => {
            const search =
              searchText
                .trim()
                .toLowerCase();

            const name =
              String(
                product.name || ""
              ).toLowerCase();

            const category =
              String(
                product.category || ""
              ).toLowerCase();

            const description =
              String(
                product.description || ""
              ).toLowerCase();

            const badge =
              String(
                product.badge || ""
              ).toLowerCase();

            return (
              name.includes(search) ||
              category.includes(search) ||
              description.includes(search) ||
              badge.includes(search)
            );
          })
          .slice(0, 8);

  /* =====================================================
     SEARCH INPUT
  ===================================================== */

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setSearchText(value);

    setShowSearchResults(
      value.trim().length > 0
    );
  };

  /* =====================================================
     SEARCH SUBMIT
  ===================================================== */

  const handleSearchSubmit = (e) => {
    e.preventDefault();

    const query = searchText.trim();

    if (!query) return;

    setShowSearchResults(false);

    navigate(
      `/category?search=${encodeURIComponent(
        query
      )}`
    );
  };

  /* =====================================================
     OPEN PRODUCT
  ===================================================== */

  const handleProductClick = (product) => {
    setSearchText("");

    setShowSearchResults(false);

    navigate(
      `/product/${product.id}`
    );
  };

  /* =====================================================
     CART COUNT
  ===================================================== */

  const updateCartCount = () => {
    try {
      const savedCart =
        localStorage.getItem(
          "ananyaCart"
        );

      const cart = savedCart
        ? JSON.parse(savedCart)
        : [];

      setCartCount(
        Array.isArray(cart)
          ? cart.length
          : 0
      );
    } catch (error) {
      console.error(
        "Cart count error:",
        error
      );

      setCartCount(0);
    }
  };

  /* =====================================================
     FAVORITE COUNT
  ===================================================== */

  const updateFavoriteCount = () => {
    try {
      const savedFavorites =
        localStorage.getItem(
          "ananyaFavorites"
        );

      const favorites =
        savedFavorites
          ? JSON.parse(savedFavorites)
          : [];

      setFavoriteCount(
        Array.isArray(favorites)
          ? favorites.length
          : 0
      );
    } catch (error) {
      console.error(
        "Favorite count error:",
        error
      );

      setFavoriteCount(0);
    }
  };

  /* =====================================================
     CART + FAVORITE LISTENERS
  ===================================================== */

  useEffect(() => {
    updateCartCount();

    updateFavoriteCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    const handleFavoriteUpdate = () => {
      updateFavoriteCount();
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
      "ananyaFavoritesUpdated",
      handleFavoriteUpdate
    );

    window.addEventListener(
      "storage",
      handleCartUpdate
    );

    window.addEventListener(
      "storage",
      handleFavoriteUpdate
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
        "ananyaFavoritesUpdated",
        handleFavoriteUpdate
      );

      window.removeEventListener(
        "storage",
        handleCartUpdate
      );

      window.removeEventListener(
        "storage",
        handleFavoriteUpdate
      );
    };
  }, []);

  /* =====================================================
     CLOSE SEARCH ON OUTSIDE CLICK
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        !e.target.closest(
          ".search-wrapper"
        )
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  /* =====================================================
     DESKTOP CATEGORY
  ===================================================== */

  const handleCategoryMouseEnter = (
    index
  ) => {
    if (window.innerWidth > 768) {
      setOpenCategory(index);
    }
  };

  const handleCategoryMouseLeave = () => {
    if (window.innerWidth > 768) {
      setOpenCategory(null);
    }
  };

  /* =====================================================
     MOBILE CATEGORY
  ===================================================== */

  const handleCategoryClick = (
    index
  ) => {
    if (window.innerWidth <= 768) {
      setOpenCategory(
        openCategory === index
          ? null
          : index
      );
    }
  };

  /* =====================================================
     CART
  ===================================================== */

  const handleCartClick = () => {
    navigate("/cart");
  };

  /* =====================================================
     FAVORITES
  ===================================================== */

  const handleFavoritesClick = () => {
    navigate("/favorites");
  };

  /* =====================================================
     PROFILE
  ===================================================== */

  const handleProfileClick = () => {
    navigate("/profile");
  };

  /* =====================================================
     PRODUCT LINK
  ===================================================== */

  const getProductLink = (item) => {
    return `/category?type=${encodeURIComponent(
      item
    )}`;
  };

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <>
      {/* =================================================
          TOP BAR
      ================================================= */}

      <div className="top-bar">
        <div className="top-left">
          <span>☎ +91 9123456789</span>

          <span className="top-divider"></span>

          <span>
            ✉ support@ananyatrading.com
          </span>
        </div>

        <div className="top-right">
          <span>♧ Help & Support</span>

          <span>🚚 Track Order</span>

          <span>♧ Bulk Order</span>
        </div>
      </div>

      {/* =================================================
          MAIN NAVBAR
      ================================================= */}

      <header className="main-navbar">
        <div className="nav-main">

          {/* LOGO */}

          <Link
            to="/"
            className="brand"
          >
            <img
              src={ananyaLogo}
              alt="Ananya Trading Company Logo"
              className="brand-logo"
            />

            <div className="brand-content">
              <h1>ANANYA</h1>

              <h2>
                TRADING COMPANY
              </h2>

              <span>
                Solution Of Uniqueness
              </span>
            </div>
          </Link>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="search-wrapper">

            <form
              className="search-box"
              onSubmit={
                handleSearchSubmit
              }
            >
              <input
                type="text"
                value={searchText}
                onChange={
                  handleSearchChange
                }
                onFocus={() => {
                  if (
                    searchText.trim()
                  ) {
                    setShowSearchResults(
                      true
                    );
                  }
                }}
                placeholder="Search for products, categories and more..."
                autoComplete="off"
              />

              <button
                type="submit"
                aria-label="Search"
              >
                <SearchIcon />
              </button>
            </form>

            {/* =================================================
                SEARCH RESULTS
            ================================================= */}

            {showSearchResults &&
              searchText.trim() && (
                <div className="search-results-dropdown">

                  {searchResults.length >
                  0 ? (
                    <>
                      <div className="search-results-header">
                        <span>
                          Related Products
                        </span>

                        <small>
                          {
                            searchResults.length
                          } found
                        </small>
                      </div>

                      {searchResults.map(
                        (product) => (
                          <button
                            type="button"
                            className="search-product-item"
                            key={
                              product.id
                            }
                            onClick={() =>
                              handleProductClick(
                                product
                              )
                            }
                          >

                            <div className="search-product-image">
                              <img
                                src={
                                  product
                                    .images
                                    ?.length
                                    ? product
                                        .images[0]
                                    : product.image ||
                                      "https://via.placeholder.com/80x80?text=Product"
                                }
                                alt={
                                  product.name
                                }
                              />
                            </div>

                            <div className="search-product-info">

                              <strong>
                                {
                                  product.name
                                }
                              </strong>

                              <span>
                                {
                                  product.category ||
                                  "General"
                                }
                              </span>

                              <b>
                                ₹
                                {Number(
                                  product.price ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}
                              </b>

                            </div>

                          </button>
                        )
                      )}

                      <button
                        type="button"
                        className="search-view-all"
                        onClick={() => {
                          setShowSearchResults(
                            false
                          );

                          navigate(
                            `/category?search=${encodeURIComponent(
                              searchText.trim()
                            )}`
                          );
                        }}
                      >
                        View all search results →
                      </button>
                    </>
                  ) : (
                    <div className="search-no-results">

                      <div className="search-no-results-icon">
                        🔍
                      </div>

                      <strong>
                        No products found
                      </strong>

                      <span>
                        Try another product
                        name or category.
                      </span>

                    </div>
                  )}

                </div>
              )}
          </div>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="nav-actions">

            {/* FAVORITES */}

            <button
              type="button"
              className="nav-action favorite-nav-btn"
              onClick={
                handleFavoritesClick
              }
              aria-label={`Favorites with ${favoriteCount} items`}
            >
              <HeartIcon />

              <span>
                Favorites
              </span>

              {favoriteCount > 0 && (
                <b className="favorite-badge">
                  {favoriteCount}
                </b>
              )}
            </button>

            {/* SIGN IN */}

            <Link
              to="/login"
              className="nav-action signup-link"
            >
              <UserIcon />

              <span>
                Sign In
              </span>
            </Link>

            {/* SIGN UP */}

            <Link
              to="/signup"
              className="nav-action signup-link"
            >
              <UserIcon />

              <span>
                Sign Up
              </span>
            </Link>

            {/* CART */}

            <button
              type="button"
              className="nav-action cart-btn"
              onClick={
                handleCartClick
              }
              aria-label={`Cart with ${cartCount} items`}
            >
              <CartIcon />

              <span>
                Cart
              </span>

              {cartCount > 0 && (
                <b className="cart-badge">
                  {cartCount}
                </b>
              )}
            </button>

            {/* PROFILE */}

            <button
              type="button"
              className="nav-action profile-nav-btn"
              onClick={
                handleProfileClick
              }
              aria-label="Open Profile"
            >
              <UserIcon />

              <span>
                Profile
              </span>
            </button>

          </div>

          {/* MOBILE MENU */}

          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => {
              setMobileMenu(
                !mobileMenu
              );

              setShowSearchResults(
                false
              );
            }}
            aria-label="Open menu"
          >
            <MenuIcon />
          </button>

        </div>

        {/* =================================================
            CATEGORY NAVBAR
        ================================================= */}

        <div
          className={`category-navbar ${
            mobileMenu
              ? "mobile-open"
              : ""
          }`}
        >

          <div className="category-list">

            {categories.map(
              (
                category,
                index
              ) => (
                <div
                  key={
                    category.name
                  }
                  className={`category-item ${
                    openCategory ===
                    index
                      ? "category-active"
                      : ""
                  }`}
                  onMouseEnter={() =>
                    handleCategoryMouseEnter(
                      index
                    )
                  }
                  onMouseLeave={
                    handleCategoryMouseLeave
                  }
                >

                  <button
                    type="button"
                    className="category-button"
                    onClick={() =>
                      handleCategoryClick(
                        index
                      )
                    }
                  >
                    <span>
                      {
                        category.name
                      }
                    </span>

                    <span className="category-arrow">
                      ⌄
                    </span>
                  </button>

                  {openCategory ===
                    index && (
                    <div
                      className="category-dropdown"
                      onMouseEnter={() =>
                        setOpenCategory(
                          index
                        )
                      }
                      onMouseLeave={
                        handleCategoryMouseLeave
                      }
                    >

                      <div className="dropdown-title">
                        {
                          category.name
                        }
                      </div>

                      {category.items.map(
                        (item) => (
                          <Link
                            key={item}
                            to={getProductLink(
                              item
                            )}
                            onClick={() => {
                              setOpenCategory(
                                null
                              );

                              setMobileMenu(
                                false
                              );
                            }}
                          >
                            {item}
                          </Link>
                        )
                      )}

                      <Link
                        to={`/category?category=${encodeURIComponent(
                          category.name
                        )}`}
                        className="view-all"
                        onClick={() => {
                          setOpenCategory(
                            null
                          );

                          setMobileMenu(
                            false
                          );
                        }}
                      >
                        View All →
                      </Link>

                    </div>
                  )}

                </div>
              )
            )}

          </div>

        </div>
      </header>

      {/* =================================================
          OFFER BAR
      ================================================= */}

      <div className="offer-bar">

        <span className="offer-tag">
          SPECIAL OFFER
        </span>

        <strong>
          Buy More, Save More!
        </strong>

        <span>
          Flat 5% OFF on Orders ₹10,000+
        </span>

        <span>
          Use Code:
          <b>SAVE5</b>
        </span>

        <button
          type="button"
          onClick={() =>
            navigator.clipboard?.writeText(
              "SAVE5"
            )
          }
        >
          Copy
        </button>

      </div>
    </>
  );
}

export default Navbar;