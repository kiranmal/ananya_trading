const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  pool,
} = require("../config/db");


// =====================================================
// CREATE JWT
// =====================================================

const generateToken = (user) => {

  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};


// =====================================================
// SIGNUP
// =====================================================

const signup = async (req, res) => {

  try {

    const {
      name,
      email,
      phone,
      password,
    } = req.body;


    // -----------------------------------------------
    // Required fields
    // -----------------------------------------------

    if (
      !name ||
      !email ||
      !phone ||
      !password
    ) {

      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });

    }


    const cleanName =
      name.trim();

    const cleanEmail =
      email
        .trim()
        .toLowerCase();

    const cleanPhone =
      phone.trim();


    // -----------------------------------------------
    // Password length
    // -----------------------------------------------

    if (password.length < 6) {

      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });

    }


    // -----------------------------------------------
    // Check existing email
    // -----------------------------------------------

    const [existingUsers] =
      await pool.execute(
        `
        SELECT id
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [cleanEmail]
      );


    if (existingUsers.length > 0) {

      return res.status(409).json({
        success: false,
        message:
          "This email is already registered!",
      });

    }


    // -----------------------------------------------
    // Hash password
    // -----------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );


    // -----------------------------------------------
    // Insert user
    // -----------------------------------------------

    const [result] =
      await pool.execute(
        `
        INSERT INTO users
        (
          name,
          email,
          phone,
          password,
          role
        )
        VALUES (?, ?, ?, ?, 'user')
        `,

        [
          cleanName,
          cleanEmail,
          cleanPhone,
          hashedPassword,
        ]
      );


    // -----------------------------------------------
    // Response
    // -----------------------------------------------

    res.status(201).json({

      success: true,

      message:
        "Account created successfully!",

      user: {

        id: result.insertId,

        name: cleanName,

        email: cleanEmail,

        phone: cleanPhone,

        address: "",

        photo: "",

        role: "user",

      },

    });

  } catch (error) {

    console.error(
      "Signup Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Server error during signup",

    });

  }
};


// =====================================================
// LOGIN
// =====================================================

const login = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;


    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required",

      });

    }


    const cleanEmail =
      email
        .trim()
        .toLowerCase();


    // -----------------------------------------------
    // Find user
    // -----------------------------------------------

    const [users] =
      await pool.execute(
        `
        SELECT
          id,
          name,
          email,
          phone,
          password,
          address,
          photo,
          role
        FROM users
        WHERE email = ?
        LIMIT 1
        `,
        [cleanEmail]
      );


    if (users.length === 0) {

      return res.status(401).json({

        success: false,

        message:
          "Account not found. Please create an account first.",

      });

    }


    const user =
      users[0];


    // -----------------------------------------------
    // Password compare
    // -----------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password!",

      });

    }


    // -----------------------------------------------
    // JWT
    // -----------------------------------------------

    const token =
      generateToken(user);


    // -----------------------------------------------
    // Response
    // -----------------------------------------------

    res.json({

      success: true,

      message:
        user.role === "admin"
          ? "Admin Login Successful!"
          : `Welcome back, ${user.name}!`,

      token,

      user: {

        id: user.id,

        name: user.name,

        email: user.email,

        phone: user.phone,

        address:
          user.address || "",

        photo:
          user.photo || "",

        role: user.role,

      },

    });

  } catch (error) {

    console.error(
      "Login Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Server error during login",

    });

  }
};


// =====================================================
// CURRENT USER
// =====================================================

const getMe = async (
  req,
  res
) => {

  try {

    const [users] =
      await pool.execute(
        `
        SELECT
          id,
          name,
          email,
          phone,
          address,
          photo,
          role
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [req.user.id]
      );


    if (users.length === 0) {

      return res.status(404).json({

        success: false,

        message:
          "User not found",

      });

    }


    res.json({

      success: true,

      user: users[0],

    });

  } catch (error) {

    console.error(
      "Get User Error:",
      error
    );


    res.status(500).json({

      success: false,

      message:
        "Server error",

    });

  }
};


module.exports = {
  signup,
  login,
  getMe,
};