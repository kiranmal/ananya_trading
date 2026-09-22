import React, { useState } from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Eye,
  EyeOff,
  ArrowRight,
  User,
  Mail,
  Phone,
  LockKeyhole,
} from "lucide-react";

import "./Signup.css";


function Signup() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });


  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData({
      ...formData,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    });
  };


  const handleSubmit = (e) => {

    e.preventDefault();


    // Password validation

    if (
      formData.password !==
      formData.confirmPassword
    ) {

      alert(
        "Passwords do not match!"
      );

      return;
    }


    // Terms validation

    if (!formData.terms) {

      alert(
        "Please accept Terms & Conditions"
      );

      return;
    }


    const email =
      formData.email
        .trim()
        .toLowerCase();


    // Existing users

    const savedUsers =
      localStorage.getItem("users");

    let users = [];

    if (savedUsers) {

      try {
        users = JSON.parse(savedUsers);
      } catch (error) {
        users = [];
      }
    }


    // Check duplicate email

    const existingUser =
      users.find(
        (user) =>
          user.email.toLowerCase() === email
      );


    if (existingUser) {

      alert(
        "This email is already registered!"
      );

      return;
    }


    // New user

    const newUser = {

      id:
        "USER_" +
        Date.now(),

      name:
        formData.name.trim(),

      email,

      phone:
        formData.phone.trim(),

      password:
        formData.password,

      address: "",

      photo: "",

      createdAt:
        new Date().toISOString(),

    };


    // Save user

    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );


    alert(
      "Account created successfully!"
    );


    // Login page

    navigate("/login");

  };


  return (

    <main className="signup-page">

      <div className="signup-container">


        {/* LEFT */}

        <div className="signup-left">

          <div className="signup-brand">

            <span>
              ANANYA
            </span>

            <strong>
              TRADING COMPANY
            </strong>

          </div>


          <div className="signup-left-content">

            <span className="signup-label">
              JOIN ANANYA
            </span>

            <h1>

              Create your
              <br />

              <span>
                account.
              </span>

            </h1>

            <p>

              Join Ananya Trading Company
              and discover premium products
              for your business and brand.

            </p>

          </div>

        </div>


        {/* RIGHT */}

        <div className="signup-right">

          <div className="signup-card">


            <div className="signup-heading">

              <h2>
                Create Account
              </h2>

              <p>
                Fill in your details to get started
              </p>

            </div>


            <form onSubmit={handleSubmit}>


              {/* NAME */}

              <div className="signup-input-group">

                <label>
                  Full Name
                </label>

                <div className="signup-input">

                  <User size={18} />

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* EMAIL */}

              <div className="signup-input-group">

                <label>
                  Email Address
                </label>

                <div className="signup-input">

                  <Mail size={18} />

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* PHONE */}

              <div className="signup-input-group">

                <label>
                  Phone Number
                </label>

                <div className="signup-input">

                  <Phone size={18} />

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>


              {/* PASSWORD */}

              <div className="signup-input-group">

                <label>
                  Password
                </label>

                <div className="signup-input">

                  <LockKeyhole size={18} />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >

                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* CONFIRM PASSWORD */}

              <div className="signup-input-group">

                <label>
                  Confirm Password
                </label>

                <div className="signup-input">

                  <LockKeyhole size={18} />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    className="signup-password-toggle"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >

                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}

                  </button>

                </div>

              </div>


              {/* TERMS */}

              <label className="signup-terms">

                <input
                  type="checkbox"
                  name="terms"
                  checked={
                    formData.terms
                  }
                  onChange={handleChange}
                />

                <span>
                  I agree to the Terms &
                  Conditions and Privacy Policy.
                </span>

              </label>


              {/* BUTTON */}

              <button
                type="submit"
                className="signup-submit"
              >

                Create Account

                <ArrowRight size={18} />

              </button>

            </form>


            {/* LOGIN */}

            <div className="signup-switch">

              <span>
                Already have an account?
              </span>

              <Link to="/login">
                Sign In
              </Link>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Signup;