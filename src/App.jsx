
import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ================= COMPONENTS =================

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// ================= PAGES =================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";
import Customizer from "./pages/Customizer";

// ================= ADMIN =================

import AdminApp from "./admin/AdminApp";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            HOME
        ================================================== */}

        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />


        {/* ==================================================
            LOGIN
        ================================================== */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ==================================================
            SIGNUP
        ================================================== */}

        <Route
          path="/signup"
          element={<Signup />}
        />


        {/* ==================================================
            PROFILE
        ================================================== */}

        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
              <Footer />
            </>
          }
        />


        {/* ==================================================
            CATEGORY
        ================================================== */}

        <Route
          path="/category"
          element={
            <>
              <Navbar />
              <Category />
              <Footer />
            </>
          }
        />


        {/* ==================================================
            PRODUCT DETAILS
        ================================================== */}

        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <ProductDetails />
              <Footer />
            </>
          }
        />


        {/* ==================================================
            CART
        ================================================== */}

        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
              <Footer />
            </>
          }
        />


        {/* ==================================================
            FAVORITES
        ================================================== */}

        <Route
          path="/favorites"
          element={
            <>
              <Navbar />
              <Favorites />
              <Footer />
            </>
          }
        />


        {/* ==================================================
            CHECKOUT
        ================================================== */}

        <Route
          path="/checkout"
          element={<Checkout />}
        />


        {/* ==================================================
            ADMIN
        ================================================== */}

        <Route
          path="/admin/*"
          element={<AdminApp />}
        />


        {/* ==================================================
            CUSTOMIZER
        ================================================== */}

        <Route
          path="/customize"
          element={<Customizer />}
        />


        {/* ==================================================
            PAGE NOT FOUND
        ================================================== */}

        <Route
          path="*"
          element={
            <div
              style={{
                minHeight: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                padding: "40px",
                textAlign: "center",
              }}
            >
              <h1>404</h1>

              <p>
                Page not found
              </p>
            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;
