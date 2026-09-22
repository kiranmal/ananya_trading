import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Category from "./pages/Category";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";
import AdminApp from "./admin/AdminApp";
import Checkout from "./pages/Checkout";
import { AuthProvider } from "./context/AuthContext";

import Customizer from "./pages/Customizer";




function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <Routes>


          {/* ================= HOME ================= */}

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


          {/* ================= LOGIN ================= */}

          <Route
            path="/login"
            element={
              <Login />
            }
          />


          {/* ================= SIGNUP ================= */}

          <Route
            path="/signup"
            element={
              <Signup />
            }
          />


          {/* ================= PROFILE ================= */}

          <Route
            path="/profile"
            element={
              <>
                <Navbar />
                <Profile />
              </>
            }
          />


          {/* ================= CATEGORY ================= */}

          <Route
            path="/category"
            element={
              <>
                <Navbar />
                <Category />
              </>
            }
          />


          {/* ================= PRODUCT DETAILS ================= */}

          <Route
            path="/product/:id"
            element={
              <>
                <Navbar />
                <ProductDetails />
              </>
            }
          />


          {/* ================= CART ================= */}

          <Route
            path="/cart"
            element={
              <>
                <Navbar />
                <Cart />
              </>
            }
          />


          {/* ================= FAVORITES ================= */}

          <Route
            path="/favorites"
            element={
              <>
                <Navbar />
                <Favorites />
              </>
            }
          />


          {/* ================= ADMIN ================= */}

          <Route
            path="/admin/*"
            element={
              <AdminApp />
            }
          />



          <Route
  path="/checkout"
  element={<Checkout />}
/>



<Route path="/customize" element={<Customizer />} />
        </Routes>

      </BrowserRouter>

    </AuthProvider>

  );
}

export default App;