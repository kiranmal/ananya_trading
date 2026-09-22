import React, { useState } from "react";

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


// =====================================================
// ADMIN LOGIN DETAILS
// =====================================================

const ADMIN_EMAIL = "admin@ananyatrading.com";
const ADMIN_PASSWORD = "Admin@123";


// =====================================================
// LOGIN COMPONENT
// =====================================================

function Login() {

  const navigate = useNavigate();

  const location = useLocation();

  const { login } = useAuth();


  // =====================================================
  // PASSWORD VISIBILITY
  // =====================================================

  const [showPassword, setShowPassword] =
    useState(false);


  // =====================================================
  // FORM STATE
  // =====================================================

  const [formData, setFormData] = useState({

    email: "",

    password: "",

    remember: false,

  });


  // =====================================================
  // INPUT CHANGE
  // =====================================================

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


  // =====================================================
  // AFTER LOGIN REDIRECT
  // =====================================================

  const getRedirectPath = () => {

    /*
      Agar user checkout se login page par aaya hai
      to login ke baad checkout par bhejna hai.
    */

    if (
      location.state?.from === "/checkout"
    ) {

      return "/checkout";

    }


    /*
      Agar location.state me from object hai
      jaise:
      {
        from: {
          pathname: "/checkout"
        }
      }
    */

    if (
      location.state?.from?.pathname
    ) {

      return location.state.from.pathname;

    }


    /*
      Agar session me checkout pending hai
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
      Normal login
    */

    return "/profile";

  };


  // =====================================================
  // LOGIN SUBMIT
  // =====================================================

  const handleSubmit = (e) => {

    e.preventDefault();


    // =================================================
    // CLEAN EMAIL
    // =================================================

    const email =
      formData.email
        .trim()
        .toLowerCase();


    const password =
      formData.password;


    // =================================================
    // ADMIN LOGIN
    // =================================================

    if (
      email ===
        ADMIN_EMAIL.toLowerCase() &&
      password ===
        ADMIN_PASSWORD
    ) {

      const adminUser = {

        id: "admin",

        name: "Administrator",

        email: ADMIN_EMAIL,

        phone: "",

        address: "",

        photo: "",

        role: "admin",

      };


      // Login context

      login(adminUser);


      // Admin session

      localStorage.setItem(
        "adminLoggedIn",
        "true"
      );


      // Current user

      localStorage.setItem(
        "currentUser",
        JSON.stringify(
          adminUser
        )
      );


      // Remove pending checkout

      localStorage.removeItem(
        "checkoutPending"
      );


      alert(
        "Admin Login Successful!"
      );


      // Admin dashboard

      navigate("/admin");

      return;

    }


    // =================================================
    // NORMAL USER LOGIN
    // =================================================

    const savedUsers =
      localStorage.getItem(
        "users"
      );


    if (!savedUsers) {

      alert(
        "Account not found. Please create an account first."
      );

      return;

    }


    // =================================================
    // PARSE USERS
    // =================================================

    let users = [];


    try {

      users =
        JSON.parse(
          savedUsers
        );

    } catch (error) {

      console.error(
        "Users parsing error:",
        error
      );


      alert(
        "Something went wrong. Please signup again."
      );

      return;

    }


    // =================================================
    // FIND USER
    // =================================================

    const user =
      users.find(
        (item) =>

          item.email &&

          item.email
            .toLowerCase()
            .trim() === email &&

          item.password ===
            password
      );


    // =================================================
    // INVALID LOGIN
    // =================================================

    if (!user) {

      alert(
        "Invalid email or password!"
      );

      return;

    }


    // =================================================
    // USER DATA
    // =================================================

    const loggedInUser = {

      id:
        user.id ||
        Date.now(),

      name:
        user.name ||
        "User",

      email:
        user.email,

      phone:
        user.phone ||
        "",

      address:
        user.address ||
        "",

      photo:
        user.photo ||
        "",

      role:
        "user",

    };


    // =================================================
    // LOGIN CONTEXT
    // =================================================

    login(
      loggedInUser
    );


    // =================================================
    // REMOVE ADMIN SESSION
    // =================================================

    localStorage.removeItem(
      "adminLoggedIn"
    );


    // =================================================
    // SAVE CURRENT USER
    // =================================================

    localStorage.setItem(
      "currentUser",
      JSON.stringify(
        loggedInUser
      )
    );


    // =================================================
    // REMEMBER ME
    // =================================================

    if (formData.remember) {

      localStorage.setItem(
        "rememberMe",
        "true"
      );

    } else {

      localStorage.removeItem(
        "rememberMe"
      );

    }


    // =================================================
    // CHECKOUT REDIRECT
    // =================================================

    const redirectPath =
      getRedirectPath();


    // =================================================
    // SUCCESS MESSAGE
    // =================================================

    alert(
      `Welcome back, ${loggedInUser.name}!`
    );


    // =================================================
    // REDIRECT
    // =================================================

    navigate(
      redirectPath,
      {
        replace: true,
      }
    );

  };


  // =====================================================
  // UI
  // =====================================================

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


            {/* =================================================
                HEADING
            ================================================= */}

            <div className="auth-heading">

              <h2>
                Sign In
              </h2>

              <p>

                {location.state?.from ===
                "/checkout"
                  ? "Login to continue with your order"
                  : "Enter your details to continue"}

              </p>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
              onSubmit={
                handleSubmit
              }
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
                        !showPassword
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

              >

                {location.state?.from ===
                "/checkout"
                  ? "Login & Continue"
                  : "Sign In"}


                <ArrowRight
                  size={18}
                />

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