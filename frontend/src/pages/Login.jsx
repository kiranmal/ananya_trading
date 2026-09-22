
import { useState } from "react";

import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  ArrowRight,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "./Login.css";


/*
|--------------------------------------------------------------------------
| BACKEND API
|--------------------------------------------------------------------------
*/

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";


/*
|--------------------------------------------------------------------------
| ADMIN LOGIN
|--------------------------------------------------------------------------
|
| Ye aapke existing admin credentials hain.
|
*/

function Login() {

  const navigate = useNavigate();

  const location = useLocation();

  const { login } = useAuth();


  /*
  |--------------------------------------------------------------------------
  | PASSWORD VISIBILITY
  |--------------------------------------------------------------------------
  */

  const [showPassword, setShowPassword] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });


  /*
  |--------------------------------------------------------------------------
  | INPUT CHANGE
  |--------------------------------------------------------------------------
  */

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;


    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };


  /*
  |--------------------------------------------------------------------------
  | REDIRECT PATH
  |--------------------------------------------------------------------------
  */

  const getRedirectPath = () => {

    /*
    |--------------------------------------------------------------------------
    | Checkout se login
    |--------------------------------------------------------------------------
    */

    if (
      location.state?.from ===
      "/checkout" ||
      location.state?.redirectTo ===
        "/checkout"
    ) {
      return "/checkout";
    }


    /*
    |--------------------------------------------------------------------------
    | Generic redirectTo (Cart Buy Now etc.)
    |--------------------------------------------------------------------------
    */

    if (
      location.state?.redirectTo
    ) {
      return location.state.redirectTo;
    }


    /*
    |--------------------------------------------------------------------------
    | React Router location object
    |--------------------------------------------------------------------------
    */

    if (
      location.state?.from?.pathname
    ) {

      return (
        location.state.from.pathname
      );
    }


    /*
    |--------------------------------------------------------------------------
    | Checkout pending
    |--------------------------------------------------------------------------
    */

    const checkoutPending =
      localStorage.getItem(
        "checkoutPending"
      );


    if (
      checkoutPending === "true"
    ) {

      localStorage.removeItem(
        "checkoutPending"
      );

      return "/checkout";
    }


    /*
    |--------------------------------------------------------------------------
    | Normal login
    |--------------------------------------------------------------------------
    */

    return "/profile";
  };


  /*
  |--------------------------------------------------------------------------
  | LOGIN SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e) => {

    e.preventDefault();


    if (loading) {
      return;
    }


    const email =
      formData.email
        .trim()
        .toLowerCase();

    const password =
      formData.password;


    /*
    |--------------------------------------------------------------------------
    | EMAIL VALIDATION
    |--------------------------------------------------------------------------
    */

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

      alert(
        "Please enter a valid email address."
      );

      return;
    }


    setLoading(true);


    try {

      /*
      |--------------------------------------------------------------------------
      | Node.js / MySQL API
      |--------------------------------------------------------------------------
      */

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );


      /*
      |--------------------------------------------------------------------------
      | RESPONSE
      |--------------------------------------------------------------------------
      */

      const data =
        await response.json();


      /*
      |--------------------------------------------------------------------------
      | LOGIN ERROR
      |--------------------------------------------------------------------------
      */

      if (!response.ok) {

        alert(
          data.message ||
          "Invalid email or password!"
        );

        return;
      }


      /*
      |--------------------------------------------------------------------------
      | USER CHECK
      |--------------------------------------------------------------------------
      */

      if (!data.user) {

        alert(
          "User information was not received from server."
        );

        return;
      }


      /*
      |--------------------------------------------------------------------------
      | LOGIN CONTEXT
      |--------------------------------------------------------------------------
      */

      login(
        data.user,
        data.token,
        formData.remember
      );


      localStorage.setItem(
        "currentUser",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "ananyaUser",
        JSON.stringify(data.user)
      );

      const isAdmin =
        data.user.role === "admin";

      if (isAdmin) {
        localStorage.setItem(
          "adminLoggedIn",
          "true"
        );
        localStorage.removeItem(
          "checkoutPending"
        );
      } else {
        localStorage.removeItem(
          "adminLoggedIn"
        );
      }

      alert(
        `Welcome back, ${
          data.user.name || "User"
        }!`
      );

      const redirectPath =
        isAdmin
          ? "/admin"
          : getRedirectPath();

      navigate(
        redirectPath,
        {
          replace: true,
          state:
            redirectPath ===
              "/checkout" &&
            location.state?.checkoutData
              ? {
                  cart:
                    location.state
                      .checkoutData.cart,
                  totalPrice:
                    location.state
                      .checkoutData.totalPrice,
                  totalQuantity:
                    location.state
                      .checkoutData
                      .totalQuantity,
                  user: data.user,
                }
              : location.state?.orderProduct
                ? {
                    orderProduct:
                      location.state
                        .orderProduct,
                  }
                : undefined,
        }
      );

    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      alert(
        "Unable to connect to server. Please make sure the Node.js backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <main className="auth-page">

      <div className="auth-container">


        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="auth-left">


          {/* BRAND */}

          <div className="auth-brand">

            <span>
              ANANYA
            </span>

            <strong>
              TRADING COMPANY
            </strong>

          </div>


          {/* CONTENT */}

          <div className="auth-left-content">

            <span className="auth-label">
              WELCOME BACK
            </span>


            <h1>

              Welcome back to

              <br />

              <span>
                Ananya.
              </span>

            </h1>


            <p>

              Login to access your account,
              manage your orders and explore
              our premium products.

            </p>


            {/* FEATURES */}

            <div className="auth-features">


              <div>

                <span>
                  ✓
                </span>

                <p>
                  Premium Products
                </p>

              </div>


              <div>

                <span>
                  ✓
                </span>

                <p>
                  Secure Account
                </p>

              </div>


              <div>

                <span>
                  ✓
                </span>

                <p>
                  Easy Order Management
                </p>

              </div>


            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="auth-right">

          <div className="auth-card">


            {/* HEADING */}

            <div className="auth-heading">

              <h2>
                Sign In
              </h2>

              <p>

                {location.state?.from ===
                  "/checkout" ||
                location.state?.redirectTo ===
                  "/checkout"

                  ? "Login to continue with your order"

                  : "Enter your details to continue"}

              </p>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >


              {/* =================================================
                  EMAIL
              ================================================= */}

              <div className="input-group">

                <label>
                  Email Address
                </label>

                <div className="input-wrapper">

                  <Mail
                    size={18}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={
                      formData.email
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="email"
                    required
                  />

                </div>

              </div>


              {/* =================================================
                  PASSWORD
              ================================================= */}

              <div className="input-group">

                <label>
                  Password
                </label>

                <div className="input-wrapper">

                  <LockKeyhole
                    size={18}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Enter your password"
                    value={
                      formData.password
                    }
                    onChange={
                      handleChange
                    }
                    autoComplete="current-password"
                    required
                  />


                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >

                    {showPassword ? (

                      <EyeOff
                        size={18}
                      />

                    ) : (

                      <Eye
                        size={18}
                      />

                    )}

                  </button>

                </div>

              </div>


              {/* =================================================
                  OPTIONS
              ================================================= */}

              <div className="auth-options">

                <label
                  className="remember"
                >

                  <input
                    type="checkbox"
                    name="remember"
                    checked={
                      formData.remember
                    }
                    onChange={
                      handleChange
                    }
                  />

                  <span>
                    Remember me
                  </span>

                </label>


                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert(
                      "Forgot password feature will be available soon."
                    )
                  }
                >

                  Forgot Password?

                </button>

              </div>


              {/* =================================================
                  LOGIN BUTTON
              ================================================= */}

              <button
                type="submit"
                className="auth-submit"
                disabled={loading}
              >

                {loading

                  ? "Signing In..."

                  : location.state?.from ===
                      "/checkout" ||
                    location.state?.redirectTo ===
                      "/checkout"

                    ? "Login & Continue"

                    : "Sign In"

                }


                {!loading && (
                  <ArrowRight
                    size={18}
                  />
                )}

              </button>


            </form>


            {/* =================================================
                SIGNUP
            ================================================= */}

            <div className="auth-switch">

              <span>
                Don't have an account?
              </span>


              <Link
                to="/signup"
                state={
                  location.state
                }
              >

                Create Account

              </Link>

            </div>


          </div>

        </div>

      </div>

    </main>
  );
}


export default Login;
