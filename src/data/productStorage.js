import defaultProducts from "./products";

const STORAGE_KEY = "ananyaProducts";
const FAVORITES_KEY = "ananyaFavorites";

/* =====================================================
   GET PRODUCTS
===================================================== */

export const getProducts = () => {
  try {
    const savedProducts =
      localStorage.getItem(STORAGE_KEY);

    if (savedProducts) {
      return JSON.parse(savedProducts);
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(defaultProducts)
    );

    return defaultProducts;

  } catch (error) {

    console.error(
      "Error loading products:",
      error
    );

    return defaultProducts;
  }
};


/* =====================================================
   SAVE PRODUCTS
===================================================== */

export const saveProducts = (productList) => {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(productList)
  );

  window.dispatchEvent(
    new Event("ananyaProductsUpdated")
  );
};


/* =====================================================
   ADD PRODUCT
===================================================== */

export const addProduct = (product) => {

  const currentProducts =
    getProducts();

  const newProduct = {

    ...product,

    id: Date.now(),

    name:
      product.name ||
      "Untitled Product",

    category:
      product.category ||
      "General",

    price:
      Number(product.price || 0),

    rating:
      Number(product.rating || 4.8),

    reviews:
      Number(product.reviews || 0),

    badge:
      product.badge || "NEW",

    oldPrice:
      Number(
        product.oldPrice ||
        product.price ||
        0
      ),

    discount:
      product.discount || "",

    description:
      product.description ||
      "Premium quality customized product made for your brand and business.",

    images:
      Array.isArray(product.images) &&
      product.images.length > 0
        ? product.images
        : product.image
          ? [product.image]
          : [
              "https://via.placeholder.com/600x600?text=Product"
            ],

    paperTypes:
      Array.isArray(product.paperTypes) &&
      product.paperTypes.length > 0
        ? product.paperTypes
        : ["Standard"],

    sizes:
      Array.isArray(product.sizes) &&
      product.sizes.length > 0
        ? product.sizes
        : ["Standard"],

    features:
      Array.isArray(product.features) &&
      product.features.length > 0
        ? product.features
        : [
            "Premium Quality",
            "High Quality Material",
            "Fast Delivery"
          ],

  };


  const updatedProducts = [
    ...currentProducts,
    newProduct,
  ];


  saveProducts(
    updatedProducts
  );


  return newProduct;
};


/* =====================================================
   GET PRODUCT BY ID
===================================================== */

export const getProductById = (id) => {

  const currentProducts =
    getProducts();

  return currentProducts.find(
    (product) =>
      String(product.id) ===
      String(id)
  );

};


/* =====================================================
   UPDATE PRODUCT
===================================================== */

export const updateProduct = (
  id,
  updatedData
) => {

  const currentProducts =
    getProducts();

  const updatedProducts =
    currentProducts.map(
      (product) => {

        if (
          String(product.id) ===
          String(id)
        ) {

          return {
            ...product,
            ...updatedData,
            id: product.id,
          };

        }

        return product;

      }
    );


  saveProducts(
    updatedProducts
  );


  return updatedProducts.find(
    (product) =>
      String(product.id) ===
      String(id)
  );

};


/* =====================================================
   DELETE PRODUCT
===================================================== */

export const deleteProduct = (
  id
) => {

  const currentProducts =
    getProducts();

  const updatedProducts =
    currentProducts.filter(
      (product) =>
        String(product.id) !==
        String(id)
    );

  saveProducts(
    updatedProducts
  );

};


/* =====================================================
   FAVORITES
===================================================== */

export const getFavorites = () => {

  try {

    const savedFavorites =
      localStorage.getItem(
        FAVORITES_KEY
      );

    return savedFavorites
      ? JSON.parse(savedFavorites)
      : [];

  } catch (error) {

    console.error(
      "Error loading favorites:",
      error
    );

    return [];
  }

};


/* =====================================================
   CHECK FAVORITE
===================================================== */

export const isFavorite = (
  productId
) => {

  const favorites =
    getFavorites();

  return favorites.some(
    (id) =>
      String(id) ===
      String(productId)
  );

};


/* =====================================================
   TOGGLE FAVORITE
===================================================== */

export const toggleFavorite = (
  productId
) => {

  let favorites =
    getFavorites();

  const id =
    Number(productId);


  const exists =
    favorites.some(
      (favoriteId) =>
        Number(favoriteId) === id
    );


  if (exists) {

    favorites =
      favorites.filter(
        (favoriteId) =>
          Number(favoriteId) !== id
      );

  } else {

    favorites.push(id);

  }


  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(
      favorites
    )
  );


  window.dispatchEvent(
    new Event(
      "ananyaFavoritesUpdated"
    )
  );


  return !exists;

};


/* =====================================================
   CLEAR FAVORITES
===================================================== */

export const clearFavorites = () => {

  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify([])
  );

  window.dispatchEvent(
    new Event(
      "ananyaFavoritesUpdated"
    )
  );

};