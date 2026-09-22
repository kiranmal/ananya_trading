import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Heart,
  Star,
  SlidersHorizontal,
  ChevronDown,
  Truck,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

import products from "../data/products";

import {
  getProducts,
  getFavorites,
  toggleFavorite,
} from "../data/productStorage";

import "../styles/Category.css";

function Category() {

  /* =====================================================
     STATES
  ===================================================== */

  const [sort, setSort] = useState("popular");

  const [allProducts, setAllProducts] = useState([]);

  const [favorites, setFavorites] = useState([]);

  const [maxPrice, setMaxPrice] = useState(2000);

  const [selectedCategories, setSelectedCategories] =
    useState([]);

  const [selectedPaperTypes, setSelectedPaperTypes] =
    useState([]);

  const [showMobileFilter, setShowMobileFilter] =
    useState(false);


  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  const loadProducts = () => {

    try {

      /*
       * IMPORTANT
       *
       * productStorage.js ka same storage use hoga:
       *
       * ananya_products
       */

      const storedProducts = getProducts();

      const adminProducts =
        Array.isArray(storedProducts)
          ? storedProducts
          : [];


      /*
       * Static products + Admin products
       *
       * Admin products FIRST
       */

      const combinedProducts = [
        ...adminProducts,
        ...products,
      ];


      /*
       * Duplicate IDs remove
       */

      const uniqueProducts = [];

      const usedIds = new Set();


      combinedProducts.forEach(
        (product, index) => {

          const id =
            product.id ??
            `product-${index}`;


          if (!usedIds.has(String(id))) {

            usedIds.add(String(id));

            uniqueProducts.push({

              ...product,

              id: id,

              name:
                product.name ||
                "Premium Visiting Card",

              category:
                product.category ||
                "Visiting Cards",

              price:
                Number(
                  String(
                    product.price || 0
                  ).replace(/[₹,]/g, "")
                ),

              oldPrice:
                Number(
                  String(
                    product.oldPrice ||
                    product.price ||
                    0
                  ).replace(/[₹,]/g, "")
                ),

              rating:
                Number(
                  product.rating || 5
                ),

              reviews:
                Number(
                  product.reviews || 0
                ),

              badge:
                product.badge || "New",

              discount:
                product.discount || "",

              images:
                Array.isArray(
                  product.images
                ) &&
                product.images.length > 0

                  ? product.images

                  : product.image
                    ? [product.image]

                    : [
                        "https://via.placeholder.com/600x600?text=Product"
                      ],

              paperTypes:
                Array.isArray(
                  product.paperTypes
                )
                  ? product.paperTypes
                  : [
                      "Matte",
                      "Glossy"
                    ],

              sizes:
                Array.isArray(
                  product.sizes
                )
                  ? product.sizes
                  : [
                      "Standard"
                    ],

            });

          }

        }
      );


      setAllProducts(
        uniqueProducts
      );

    } catch (error) {

      console.error(
        "Error loading products:",
        error
      );

      setAllProducts(
        Array.isArray(products)
          ? products
          : []
      );

    }

  };


  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {

    loadProducts();

    setFavorites(
      getFavorites()
    );


    const handleProductsUpdate = () => {

      loadProducts();

    };


    const handleFavoritesUpdate = () => {

      setFavorites(
        getFavorites()
      );

    };


    window.addEventListener(
      "ananyaProductsUpdated",
      handleProductsUpdate
    );

    window.addEventListener(
      "storage",
      handleProductsUpdate
    );

    window.addEventListener(
      "ananyaFavoritesUpdated",
      handleFavoritesUpdate
    );


    return () => {

      window.removeEventListener(
        "ananyaProductsUpdated",
        handleProductsUpdate
      );

      window.removeEventListener(
        "storage",
        handleProductsUpdate
      );

      window.removeEventListener(
        "ananyaFavoritesUpdated",
        handleFavoritesUpdate
      );

    };

  }, []);


  /* =====================================================
     CATEGORY LIST
  ===================================================== */

  const categories = useMemo(() => {

    const categoryList =
      allProducts
        .map(
          (product) =>
            product.category
        )
        .filter(Boolean);


    return [
      ...new Set(
        categoryList
      ),
    ];

  }, [allProducts]);


  /* =====================================================
     PAPER TYPE LIST
  ===================================================== */

  const paperTypes = useMemo(() => {

    const paperList = [];


    allProducts.forEach(
      (product) => {

        if (
          Array.isArray(
            product.paperTypes
          )
        ) {

          paperList.push(
            ...product.paperTypes
          );

        }

      }
    );


    return [
      ...new Set(
        paperList
      ),
    ];

  }, [allProducts]);


  /* =====================================================
     CATEGORY FILTER
  ===================================================== */

  const handleCategoryChange = (
    category
  ) => {

    setSelectedCategories(
      (previous) => {

        if (
          previous.includes(
            category
          )
        ) {

          return previous.filter(
            (item) =>
              item !== category
          );

        }


        return [
          ...previous,
          category,
        ];

      }
    );

  };


  /* =====================================================
     PAPER FILTER
  ===================================================== */

  const handlePaperChange = (
    paper
  ) => {

    setSelectedPaperTypes(
      (previous) => {

        if (
          previous.includes(
            paper
          )
        ) {

          return previous.filter(
            (item) =>
              item !== paper
          );

        }


        return [
          ...previous,
          paper,
        ];

      }
    );

  };


  /* =====================================================
     FILTER + SORT
  ===================================================== */

  const sortedProducts = useMemo(() => {

    let filtered =
      [...allProducts];


    /* ================= CATEGORY ================= */

    if (
      selectedCategories.length > 0
    ) {

      filtered =
        filtered.filter(
          (product) =>
            selectedCategories.includes(
              product.category
            )
        );

    }


    /* ================= PAPER TYPE ================= */

    if (
      selectedPaperTypes.length > 0
    ) {

      filtered =
        filtered.filter(
          (product) => {

            const productPapers =
              Array.isArray(
                product.paperTypes
              )
                ? product.paperTypes
                : [];


            return productPapers.some(
              (paper) =>
                selectedPaperTypes.includes(
                  paper
                )
            );

          }
        );

    }


    /* ================= PRICE ================= */

    filtered =
      filtered.filter(
        (product) =>
          Number(
            product.price || 0
          ) <= maxPrice
      );


    /* ================= SORT ================= */

    filtered.sort(
      (a, b) => {

        if (
          sort === "low"
        ) {

          return (
            Number(a.price || 0) -
            Number(b.price || 0)
          );

        }


        if (
          sort === "high"
        ) {

          return (
            Number(b.price || 0) -
            Number(a.price || 0)
          );

        }


        if (
          sort === "rating"
        ) {

          return (
            Number(b.rating || 0) -
            Number(a.rating || 0)
          );

        }


        /* POPULAR */

        return (
          Number(b.reviews || 0) -
          Number(a.reviews || 0)
        );

      }
    );


    return filtered;

  }, [

    allProducts,

    selectedCategories,

    selectedPaperTypes,

    maxPrice,

    sort,

  ]);


  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const handleClearFilters = () => {

    setSelectedCategories([]);

    setSelectedPaperTypes([]);

    setMaxPrice(2000);

  };


  /* =====================================================
     FAVORITE
  ===================================================== */

  const handleFavorite = (
    event,
    productId
  ) => {

    event.preventDefault();

    event.stopPropagation();


    const isNowFavorite =
      toggleFavorite(
        productId
      );


    setFavorites(
      getFavorites()
    );


    console.log(
      isNowFavorite
        ? "Added to favorites"
        : "Removed from favorites"
    );

  };


  /* =====================================================
     CHECK FAVORITE
  ===================================================== */

  const isProductFavorite = (
    productId
  ) => {

    return favorites.some(
      (id) =>
        Number(id) ===
        Number(productId)
    );

  };


  /* =====================================================
     RETURN
  ===================================================== */

  return (

    <div className="category-page">


      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="breadcrumb">

        <Link to="/">
          Home
        </Link>

        <span>
          ›
        </span>

        <span>
          Products
        </span>

      </div>


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <section className="category-header">

        <div>

          <span className="category-small-title">

            ANANYA TRADING COMPANY

          </span>


          <h1>

            Our Products

          </h1>


          <p>

            Premium quality products designed
            to make your brand unforgettable.

          </p>

        </div>


        {/* SORT */}

        <div className="sort-box">

          <span>
            Sort by
          </span>


          <div className="sort-select">

            <select
              value={sort}
              onChange={(event) =>
                setSort(
                  event.target.value
                )
              }
            >

              <option value="popular">
                Popular
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

            </select>


            <ChevronDown
              size={16}
            />

          </div>

        </div>

      </section>


      {/* =================================================
          BENEFITS
      ================================================= */}

      <div className="benefits-row">


        <div className="benefit">

          <Truck />

          <div>

            <strong>
              Free Delivery
            </strong>

            <span>
              On orders above ₹999
            </span>

          </div>

        </div>


        <div className="benefit">

          <ShieldCheck />

          <div>

            <strong>
              Premium Quality
            </strong>

            <span>
              100% Quality Assured
            </span>

          </div>

        </div>


        <div className="benefit">

          <CreditCard />

          <div>

            <strong>
              Secure Payment
            </strong>

            <span>
              100% Secure Checkout
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          MAIN LAYOUT
      ================================================= */}

      <div className="category-layout">


        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside
          className={
            showMobileFilter
              ? "filter-sidebar mobile-show"
              : "filter-sidebar"
          }
        >


          <div className="filter-title">

            <h3>
              Filters
            </h3>


            <button
              type="button"
              onClick={
                handleClearFilters
              }
            >

              Clear All

            </button>

          </div>


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="filter-group">

            <h4>
              Category
            </h4>


            {categories.length === 0 ? (

              <p>
                No categories
              </p>

            ) : (

              categories.map(
                (category) => (

                  <label
                    key={category}
                  >

                    <input
                      type="checkbox"
                      checked={
                        selectedCategories.includes(
                          category
                        )
                      }
                      onChange={() =>
                        handleCategoryChange(
                          category
                        )
                      }
                    />

                    {category}

                  </label>

                )
              )

            )}

          </div>


          {/* =================================================
              PRICE
          ================================================= */}

          <div className="filter-group">

            <h4>
              Price Range
            </h4>


            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(event) =>
                setMaxPrice(
                  Number(
                    event.target.value
                  )
                )
              }
            />


            <div className="price-range">

              <span>
                ₹100
              </span>

              <span>
                ₹{maxPrice}+
              </span>

            </div>

          </div>


          {/* =================================================
              PAPER TYPE
          ================================================= */}

          <div className="filter-group">

            <h4>
              Paper Type
            </h4>


            {paperTypes.length === 0 ? (

              <p>
                No paper types
              </p>

            ) : (

              paperTypes.map(
                (paper) => (

                  <label
                    key={paper}
                  >

                    <input
                      type="checkbox"
                      checked={
                        selectedPaperTypes.includes(
                          paper
                        )
                      }
                      onChange={() =>
                        handlePaperChange(
                          paper
                        )
                      }
                    />

                    {paper}

                  </label>

                )
              )

            )}

          </div>


          {/* =================================================
              HELP
          ================================================= */}

          <div className="filter-help">

            <SlidersHorizontal />

            <h4>
              Need Custom Design?
            </h4>

            <p>

              Our design experts can create
              your perfect business card.

            </p>

            <button
              type="button"
              onClick={() =>
                alert(
                  "Design help feature coming soon."
                )
              }
            >

              Get Design Help

            </button>

          </div>


        </aside>


        {/* =================================================
            PRODUCTS
        ================================================= */}

        <main className="products-section">


          <div className="products-top">

            <span>

              Showing{" "}
              {sortedProducts.length}{" "}
              of{" "}
              {allProducts.length}{" "}
              products

            </span>


            <button
              className="mobile-filter"
              type="button"
              onClick={() =>
                setShowMobileFilter(
                  !showMobileFilter
                )
              }
            >

              <SlidersHorizontal
                size={16}
              />

              Filters

            </button>

          </div>


          {/* =================================================
              NO PRODUCTS
          ================================================= */}

          {sortedProducts.length === 0 ? (

            <div className="no-products">

              <h2>
                No Products Found
              </h2>

              <p>
                Try changing your filters.
              </p>


              <button
                type="button"
                onClick={
                  handleClearFilters
                }
              >

                Clear Filters

              </button>

            </div>

          ) : (

            <div className="product-grid">


              {sortedProducts.map(
                (product, index) => {


                  /*
                   * IMPORTANT
                   *
                   * Admin product ka original ID
                   * preserve rahega.
                   */

                  const productId =
                    product.id ??
                    `product-${index}`;


                  const image =
                    product.images?.[0] ||
                    product.image ||
                    "https://via.placeholder.com/600x600?text=Product";


                  const favorite =
                    isProductFavorite(
                      productId
                    );


                  return (

                    <article
                      className="product-card"
                      key={String(
                        productId
                      )}
                    >


                      {/* =================================================
                          IMAGE
                      ================================================= */}

                      <div className="product-image">


                        <Link
                          to={`/product/${productId}`}
                        >

                          <img
                            src={image}
                            alt={
                              product.name ||
                              "Product"
                            }
                            loading="lazy"
                          />

                        </Link>


                        {/* BADGE */}

                        <span className="product-badge">

                          {product.badge ||
                            "New"}

                        </span>


                        {/* FAVORITE */}

                        <button
                          type="button"
                          className={
                            favorite
                              ? "wishlist active"
                              : "wishlist"
                          }
                          onClick={(
                            event
                          ) =>
                            handleFavorite(
                              event,
                              productId
                            )
                          }
                          aria-label={
                            favorite
                              ? "Remove from favorites"
                              : "Add to favorites"
                          }
                        >

                          <Heart
                            size={19}
                            fill={
                              favorite
                                ? "currentColor"
                                : "none"
                            }
                          />

                        </button>

                      </div>


                      {/* =================================================
                          CONTENT
                      ================================================= */}

                      <div className="product-content">


                        <div className="product-category">

                          {product.category ||
                            "General"}

                        </div>


                        {/* PRODUCT NAME */}

                        <Link
                          to={`/product/${productId}`}
                          className="product-name"
                        >

                          {product.name ||
                            "Premium Product"}

                        </Link>


                        {/* RATING */}

                        <div className="rating">

                          <Star
                            size={14}
                            fill="currentColor"
                          />

                          <strong>

                            {product.rating ||
                              "5.0"}

                          </strong>

                          <span>

                            (
                            {product.reviews ||
                              0}
                            )

                          </span>

                        </div>


                        {/* PRICE */}

                        <div className="price">

                          <strong>

                            ₹
                            {Number(
                              product.price ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}

                          </strong>


                          {Number(
                            product.oldPrice ||
                              0
                          ) >
                            Number(
                              product.price ||
                                0
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


                          {product.discount && (

                            <span>

                              {
                                product.discount
                              }

                            </span>

                          )}

                        </div>


                        {/* VIEW DETAILS */}

                        <Link
                          to={`/product/${productId}`}
                          className="view-details"
                        >

                          View Details

                        </Link>


                      </div>


                    </article>

                  );

                }
              )}

            </div>

          )}

        </main>

      </div>

    </div>

  );

}


export default Category;