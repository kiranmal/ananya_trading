
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

const PORT = Number(process.env.PORT) || 5000;

const JWT_SECRET =
  process.env.JWT_SECRET || "ananya_trading_secret_key_2026";

/* =========================================================
   MIDDLEWARE
========================================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman / direct server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

      // Local development ke liye request allow kar rahe hain
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================================================
   MYSQL DATABASE
========================================================= */

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ananya_trading",
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/* =========================================================
   DATABASE CONNECTION TEST
========================================================= */

async function testDatabaseConnection() {
  try {
    const connection = await db.getConnection();

    console.log("=================================");
    console.log("MySQL Database Connected");
    console.log(
      "Database:",
      process.env.DB_NAME || "ananya_trading"
    );
    console.log("=================================");

    connection.release();
  } catch (error) {
    console.error("=================================");
    console.error("MySQL Connection Failed");
    console.error("Error:", error.message);
    console.error("=================================");
  }
}

testDatabaseConnection();

/* =========================================================
   HELPER
========================================================= */

function normalize(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/* =========================================================
   HOME / HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Ananya Trading Company API is running",
  });
});

/* =========================================================
   TEST API
========================================================= */

app.get("/api/test", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.status(200).json({
      success: true,
      message: "Backend and MySQL connection successful",
    });
  } catch (error) {
    console.error("TEST API ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Backend is running but MySQL connection failed.",
      error: error.message,
    });
  }
});

/* =========================================================
   SIGNUP
   POST /api/auth/signup
========================================================= */

app.post("/api/auth/signup", async (req, res) => {
  try {
    console.log("=================================");
    console.log("SIGNUP REQUEST RECEIVED");
    console.log("Body:", {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });
    console.log("=================================");

    const {
      name,
      email,
      phone,
      password,
    } = req.body;

    /* -------------------------------------------------------
       REQUIRED FIELDS
    ------------------------------------------------------- */

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    /* -------------------------------------------------------
       CLEAN DATA
    ------------------------------------------------------- */

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim().toLowerCase();
    const cleanPhone = String(phone).trim();

    /* -------------------------------------------------------
       NAME VALIDATION
    ------------------------------------------------------- */

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Please enter your full name.",
      });
    }

    /* -------------------------------------------------------
       EMAIL VALIDATION
    ------------------------------------------------------- */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    /* -------------------------------------------------------
       PHONE VALIDATION
    ------------------------------------------------------- */

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter a valid 10 digit Indian phone number.",
      });
    }

    /* -------------------------------------------------------
       PASSWORD VALIDATION
    ------------------------------------------------------- */

    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    /* -------------------------------------------------------
       CHECK EMAIL ALREADY EXISTS
    ------------------------------------------------------- */

    const [existingUsers] = await db.execute(
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
        message: "This email is already registered!",
      });
    }

    /* -------------------------------------------------------
       HASH PASSWORD
    ------------------------------------------------------- */

    const hashedPassword = await bcrypt.hash(
      String(password),
      10
    );

    /* -------------------------------------------------------
       INSERT USER INTO MYSQL
    ------------------------------------------------------- */

    const [result] = await db.execute(
      `
      INSERT INTO users
      (
        name,
        email,
        phone,
        password,
        address,
        photo,
        role
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        cleanName,
        cleanEmail,
        cleanPhone,
        hashedPassword,
        "",
        "",
        "user",
      ]
    );

    /* -------------------------------------------------------
       SUCCESS
    ------------------------------------------------------- */

    console.log(
      "New user created successfully. ID:",
      result.insertId
    );

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
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
    console.error("=================================");
    console.error("SIGNUP ERROR");
    console.error(error);
    console.error("=================================");

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered!",
      });
    }

    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({
        success: false,
        message:
          "users table does not exist in ananya_trading database.",
      });
    }

    if (error.code === "ER_BAD_FIELD_ERROR") {
      return res.status(500).json({
        success: false,
        message:
          "users table columns do not match the backend code.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error while creating account.",
      error: error.message,
    });
  }
});

/* =========================================================
   LOGIN
   POST /api/auth/login
========================================================= */

app.post("/api/auth/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    /* -------------------------------------------------------
       FIND USER
    ------------------------------------------------------- */

    const [users] = await db.execute(
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

    /* -------------------------------------------------------
       USER NOT FOUND
    ------------------------------------------------------- */

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message:
          "Account not found. Please create an account first.",
      });
    }

    const user = users[0];

    /* -------------------------------------------------------
       PASSWORD CHECK
    ------------------------------------------------------- */

    const passwordMatch = await bcrypt.compare(
      String(password),
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    /* -------------------------------------------------------
       JWT TOKEN
    ------------------------------------------------------- */

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role || "user",
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    /* -------------------------------------------------------
       USER DATA
    ------------------------------------------------------- */

    const loggedInUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      photo: user.photo || "",
      role: user.role || "user",
    };

    /* -------------------------------------------------------
       SUCCESS
    ------------------------------------------------------- */

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${loggedInUser.name}!`,
      token,
      user: loggedInUser,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while logging in.",
      error: error.message,
    });
  }
});

/* =========================================================
   JWT AUTHENTICATION MIDDLEWARE
========================================================= */

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing.",
      });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    );

    req.user = decoded;

    next();
  } catch (error) {
    console.error(
      "AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
}

/* =========================================================
   GET CURRENT USER
   GET /api/auth/me
========================================================= */

app.get(
  "/api/auth/me",
  authenticateToken,
  async (req, res) => {
    try {
      const [users] = await db.execute(
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
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        user: users[0],
      });
    } catch (error) {
      console.error(
        "GET CURRENT USER ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while fetching user.",
      });
    }
  }
);

/* =========================================================
   UPDATE PROFILE
   PUT /api/auth/profile
========================================================= */

app.put(
  "/api/auth/profile",
  authenticateToken,
  async (req, res) => {
    try {
      const {
        name,
        phone,
        address,
        photo,
      } = req.body;

      /* -----------------------------------------------------
         NAME
      ----------------------------------------------------- */

      const cleanName = String(
        name || ""
      ).trim();

      if (cleanName.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid name.",
        });
      }

      /* -----------------------------------------------------
         PHONE
      ----------------------------------------------------- */

      const cleanPhone = String(
        phone || ""
      ).trim();

      if (
        cleanPhone &&
        !/^[6-9]\d{9}$/.test(cleanPhone)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Please enter a valid 10 digit Indian phone number.",
        });
      }

      /* -----------------------------------------------------
         UPDATE DATABASE
      ----------------------------------------------------- */

      await db.execute(
        `
        UPDATE users
        SET
          name = ?,
          phone = ?,
          address = ?,
          photo = ?
        WHERE id = ?
        `,
        [
          cleanName,
          cleanPhone,
          String(address || "").trim(),
          String(photo || "").trim(),
          req.user.id,
        ]
      );

      /* -----------------------------------------------------
         GET UPDATED USER
      ----------------------------------------------------- */

      const [users] = await db.execute(
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
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Profile updated successfully.",
        user: users[0],
      });
    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while updating profile.",
      });
    }
  }
);

/* =========================================================
   CHECK DELIVERY
   POST /api/check-delivery
========================================================= */

app.post(
  "/api/check-delivery",
  async (req, res) => {
    try {
      const {
        name,
        pincode,
        city,
        state,
        address,
      } = req.body;

      /* -----------------------------------------------------
         NAME
      ----------------------------------------------------- */

      if (
        !name ||
        normalize(name).length < 2
      ) {
        return res.status(400).json({
          success: false,
          validAddress: false,
          serviceable: false,
          message:
            "Please enter your full name.",
        });
      }

      /* -----------------------------------------------------
         ADDRESS
      ----------------------------------------------------- */

      if (
        !address ||
        normalize(address).length < 5
      ) {
        return res.status(400).json({
          success: false,
          validAddress: false,
          serviceable: false,
          message:
            "Please enter your complete delivery address.",
        });
      }

      /* -----------------------------------------------------
         CITY
      ----------------------------------------------------- */

      if (
        !city ||
        normalize(city).length < 2
      ) {
        return res.status(400).json({
          success: false,
          validAddress: false,
          serviceable: false,
          message:
            "Please enter a valid city.",
        });
      }

      /* -----------------------------------------------------
         STATE
      ----------------------------------------------------- */

      if (
        !state ||
        normalize(state).length < 2
      ) {
        return res.status(400).json({
          success: false,
          validAddress: false,
          serviceable: false,
          message:
            "Please enter a valid state.",
        });
      }

      /* -----------------------------------------------------
         PINCODE
      ----------------------------------------------------- */

      const pin = String(
        pincode || ""
      ).trim();

      if (
        !/^[1-9][0-9]{5}$/.test(pin)
      ) {
        return res.status(400).json({
          success: false,
          validAddress: false,
          serviceable: false,
          message:
            "Please enter a valid 6 digit Indian pincode.",
        });
      }

      /* -----------------------------------------------------
         INDIA POST PINCODE API
      ----------------------------------------------------- */

      const apiResponse = await fetch(
        `https://api.postalpincode.in/pincode/${pin}`
      );

      if (!apiResponse.ok) {
        return res.status(503).json({
          success: false,
          validAddress: false,
          serviceable: false,
          message:
            "Pincode verification service is temporarily unavailable. Please try again.",
        });
      }

      const data = await apiResponse.json();

      /* -----------------------------------------------------
         INVALID PINCODE
      ----------------------------------------------------- */

      if (
        !Array.isArray(data) ||
        !data[0] ||
        data[0].Status !== "Success" ||
        !Array.isArray(data[0].PostOffice) ||
        data[0].PostOffice.length === 0
      ) {
        return res.status(200).json({
          success: true,
          validAddress: false,
          serviceable: false,
          message:
            "This pincode does not appear to be a valid Indian delivery pincode.",
          pincode: pin,
        });
      }

      const postOffices =
        data[0].PostOffice;

      /* -----------------------------------------------------
         NORMALIZE CITY / STATE
      ----------------------------------------------------- */

      const normalizedCity =
        normalize(city);

      const normalizedState =
        normalize(state);

      /* -----------------------------------------------------
         CITY MATCH
      ----------------------------------------------------- */

      const cityMatch =
        postOffices.some((office) => {
          const possibleCities = [
            normalize(office.Name),
            normalize(office.District),
            normalize(office.Division),
            normalize(office.Region),
          ].filter(Boolean);

          return possibleCities.some(
            (value) =>
              value === normalizedCity ||
              value.includes(normalizedCity) ||
              normalizedCity.includes(value)
          );
        });

      /* -----------------------------------------------------
         STATE MATCH
      ----------------------------------------------------- */

      const stateMatch =
        postOffices.some((office) => {
          const officeState =
            normalize(office.State);

          return (
            officeState === normalizedState ||
            officeState.includes(
              normalizedState
            ) ||
            normalizedState.includes(
              officeState
            )
          );
        });

      /* -----------------------------------------------------
         CITY / STATE NOT MATCHED
      ----------------------------------------------------- */

      if (
        !cityMatch ||
        !stateMatch
      ) {
        return res.status(200).json({
          success: true,
          validAddress: false,
          serviceable: false,
          message:
            "Pincode is valid, but the entered city/state does not match this pincode.",
          pincode: pin,
        });
      }

      /* -----------------------------------------------------
         DELIVERY AVAILABLE
      ----------------------------------------------------- */

      return res.status(200).json({
        success: true,
        validAddress: true,
        serviceable: true,
        message:
          "Delivery is available at this address.",
        pincode: pin,
        city: String(city).trim(),
        state: String(state).trim(),
        postOffices:
          postOffices.map((office) => ({
            name: office.Name || "",
            district:
              office.District || "",
            state:
              office.State || "",
            division:
              office.Division || "",
            region:
              office.Region || "",
          })),
      });
    } catch (error) {
      console.error(
        "CHECK DELIVERY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        validAddress: false,
        serviceable: false,
        message:
          "Address verification failed. Please try again.",
      });
    }
  }
);

/* =========================================================
   404 HANDLER
========================================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
    path: req.originalUrl,
  });
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal server error.",
    });
  }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log("=================================");
  console.log(
    `Ananya API running on http://localhost:${PORT}`
  );
  console.log("=================================");
});