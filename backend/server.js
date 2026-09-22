
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
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://ananya-trading.vercel.app",
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

      // Allow all localhost/127.0.0.1 origins in development
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        return callback(null, true);
      }

      // Allow Vercel preview deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));

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
   ADMIN — GET ALL USERS
   GET /api/admin/users
========================================================= */

app.get(
  "/api/admin/users",
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
          role,
          status,
          created_at
        FROM users
        ORDER BY id DESC
        `
      );

      return res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.error(
        "ADMIN GET USERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while fetching users.",
      });
    }
  }
);

/* =========================================================
   ADMIN — UPDATE USER STATUS
   PUT /api/admin/users/:id/status
========================================================= */

app.put(
  "/api/admin/users/:id/status",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (
        !["Active", "Blocked"].includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid status value.",
        });
      }

      const [result] = await db.execute(
        `
        UPDATE users
        SET status = ?
        WHERE id = ?
        `,
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: `User ${status === "Blocked" ? "blocked" : "unblocked"} successfully.`,
      });
    } catch (error) {
      console.error(
        "ADMIN UPDATE USER STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Server error while updating user status.",
      });
    }
  }
);

/* =========================================================
   PRODUCTS
========================================================= */

async function ensureProductsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      category VARCHAR(100) DEFAULT 'General',
      subcategory VARCHAR(100) DEFAULT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      old_price DECIMAL(10,2) DEFAULT NULL,
      stock INT NOT NULL DEFAULT 0,
      status VARCHAR(20) NOT NULL DEFAULT 'Active',
      badge VARCHAR(50) DEFAULT NULL,
      rating DECIMAL(2,1) DEFAULT 4.8,
      reviews INT DEFAULT 0,
      discount VARCHAR(20) DEFAULT NULL,
      description TEXT DEFAULT NULL,
      images LONGTEXT DEFAULT NULL,
      paper_types TEXT DEFAULT NULL,
      sizes TEXT DEFAULT NULL,
      features TEXT DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
}

function parseProductList(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function mapProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    subcategory: row.subcategory || "",
    price: Number(row.price || 0),
    oldPrice: Number(row.old_price || row.price || 0),
    stock: Number(row.stock || 0),
    status: row.status || "Active",
    badge: row.badge || "",
    rating: Number(row.rating || 0),
    reviews: Number(row.reviews || 0),
    discount: row.discount || "",
    description: row.description || "",
    images: parseProductList(row.images),
    paperTypes: parseProductList(row.paper_types),
    sizes: parseProductList(row.sizes),
    features: parseProductList(row.features),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Administrator access required.",
    });
  }

  next();
}

function getProductPayload(body) {
  const images = Array.isArray(body.images)
    ? body.images
    : body.image
      ? [body.image]
      : [];

  return {
    name: String(body.name || "").trim(),
    category: String(body.category || "General").trim(),
    subcategory: String(body.subcategory || "").trim() || null,
    price: Number(body.price || 0),
    oldPrice: Number(body.oldPrice ?? body.price ?? 0),
    stock: Math.max(0, Number(body.stock ?? 0)),
    status: String(body.status || "Active").trim(),
    badge: String(body.badge || "").trim() || null,
    rating: Number(body.rating ?? 4.8),
    reviews: Math.max(0, Number(body.reviews ?? 0)),
    discount: String(body.discount || "").trim() || null,
    description: String(body.description || "").trim(),
    images,
    paperTypes: Array.isArray(body.paperTypes) ? body.paperTypes : [],
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    features: Array.isArray(body.features) ? body.features : [],
  };
}

app.get("/api/products", async (req, res) => {
  try {
    await ensureProductsTable();
    const [rows] = await db.execute(
      "SELECT * FROM products ORDER BY id DESC"
    );

    return res.status(200).json({
      success: true,
      products: rows.map(mapProduct),
    });
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load products.",
    });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    await ensureProductsTable();
    const [rows] = await db.execute(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product: mapProduct(rows[0]),
    });
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load product.",
    });
  }
});

app.post(
  "/api/products/import",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    const products = Array.isArray(req.body.products) ? req.body.products : [];

    if (products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required for import.",
      });
    }

    const connection = await db.getConnection();

    try {
      await ensureProductsTable();
      const [countRows] = await connection.execute(
        "SELECT COUNT(*) AS total FROM products"
      );

      if (Number(countRows[0].total) > 0) {
        return res.status(409).json({
          success: false,
          message: "Products already exist in the database.",
        });
      }

      await connection.beginTransaction();

      for (const item of products) {
        const product = getProductPayload(item);

        if (!product.name || product.price <= 0) {
          continue;
        }

        await connection.execute(
          `INSERT INTO products
            (name, category, subcategory, price, old_price, stock, status,
             badge, rating, reviews, discount, description, images,
             paper_types, sizes, features)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            product.name,
            product.category,
            product.subcategory,
            product.price,
            product.oldPrice,
            product.stock,
            product.status,
            product.badge,
            product.rating,
            product.reviews,
            product.discount,
            product.description,
            JSON.stringify(product.images),
            JSON.stringify(product.paperTypes),
            JSON.stringify(product.sizes),
            JSON.stringify(product.features),
          ]
        );
      }

      await connection.commit();
      const [rows] = await connection.execute(
        "SELECT * FROM products ORDER BY id DESC"
      );

      return res.status(201).json({
        success: true,
        message: "Products imported successfully.",
        products: rows.map(mapProduct),
      });
    } catch (error) {
      await connection.rollback();
      console.error("IMPORT PRODUCTS ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to import products.",
      });
    } finally {
      connection.release();
    }
  }
);

app.post(
  "/api/products",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await ensureProductsTable();
      const product = getProductPayload(req.body);

      if (!product.name || product.price <= 0) {
        return res.status(400).json({
          success: false,
          message: "Product name and a valid price are required.",
        });
      }

      const [result] = await db.execute(
        `INSERT INTO products
          (name, category, subcategory, price, old_price, stock, status,
           badge, rating, reviews, discount, description, images,
           paper_types, sizes, features)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.name,
          product.category,
          product.subcategory,
          product.price,
          product.oldPrice,
          product.stock,
          product.status,
          product.badge,
          product.rating,
          product.reviews,
          product.discount,
          product.description,
          JSON.stringify(product.images),
          JSON.stringify(product.paperTypes),
          JSON.stringify(product.sizes),
          JSON.stringify(product.features),
        ]
      );

      const [rows] = await db.execute(
        "SELECT * FROM products WHERE id = ? LIMIT 1",
        [result.insertId]
      );

      return res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product: mapProduct(rows[0]),
      });
    } catch (error) {
      console.error("CREATE PRODUCT ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to create product.",
      });
    }
  }
);

app.put(
  "/api/products/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await ensureProductsTable();
      const product = getProductPayload(req.body);

      if (!product.name || product.price <= 0) {
        return res.status(400).json({
          success: false,
          message: "Product name and a valid price are required.",
        });
      }

      const [result] = await db.execute(
        `UPDATE products SET
          name = ?, category = ?, subcategory = ?, price = ?, old_price = ?,
          stock = ?, status = ?, badge = ?, rating = ?, reviews = ?,
          discount = ?, description = ?, images = ?, paper_types = ?,
          sizes = ?, features = ?
         WHERE id = ?`,
        [
          product.name,
          product.category,
          product.subcategory,
          product.price,
          product.oldPrice,
          product.stock,
          product.status,
          product.badge,
          product.rating,
          product.reviews,
          product.discount,
          product.description,
          JSON.stringify(product.images),
          JSON.stringify(product.paperTypes),
          JSON.stringify(product.sizes),
          JSON.stringify(product.features),
          req.params.id,
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      const [rows] = await db.execute(
        "SELECT * FROM products WHERE id = ? LIMIT 1",
        [req.params.id]
      );

      return res.status(200).json({
        success: true,
        message: "Product updated successfully.",
        product: mapProduct(rows[0]),
      });
    } catch (error) {
      console.error("UPDATE PRODUCT ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to update product.",
      });
    }
  }
);

app.delete(
  "/api/products/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await ensureProductsTable();
      const [result] = await db.execute(
        "DELETE FROM products WHERE id = ?",
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Product not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Product deleted successfully.",
      });
    } catch (error) {
      console.error("DELETE PRODUCT ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to delete product.",
      });
    }
  }
);

/* =========================================================
   FEEDBACK
========================================================= */

async function ensureFeedbackTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) DEFAULT NULL,
      phone VARCHAR(20) DEFAULT NULL,
      subject VARCHAR(255) DEFAULT NULL,
      message TEXT NOT NULL,
      type ENUM('contact','review','complaint') DEFAULT 'contact',
      product_id INT DEFAULT NULL,
      rating INT DEFAULT NULL,
      status ENUM('Pending','Reviewed','Resolved') DEFAULT 'Pending',
      admin_reply TEXT DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
}

app.post("/api/feedback", async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      message,
      type,
      product_id: productId,
      rating,
    } = req.body;
    const feedbackName = String(name || "").trim();
    const feedbackMessage = String(message || "").trim();

    if (feedbackName.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters.",
      });
    }

    if (feedbackMessage.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Message must be at least 5 characters.",
      });
    }

    const feedbackType = ["contact", "review", "complaint"].includes(type)
      ? type
      : "contact";
    const feedbackRating = rating ? Math.max(1, Math.min(5, Number(rating))) : null;
    const productIdValue = productId ? Number(productId) : null;

    await ensureFeedbackTable();
    const [result] = await db.execute(
      `INSERT INTO feedback
        (name, email, phone, subject, message, type, product_id, rating)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        feedbackName,
        email ? String(email).trim() : null,
        phone ? String(phone).trim() : null,
        subject ? String(subject).trim() : null,
        feedbackMessage,
        feedbackType,
        productIdValue,
        feedbackRating,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedbackId: result.insertId,
    });
  } catch (error) {
    console.error("POST FEEDBACK ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to submit feedback.",
    });
  }
});

app.get(
  "/api/admin/feedback",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await ensureFeedbackTable();
      const [rows] = await db.execute(
        "SELECT * FROM feedback ORDER BY id DESC"
      );

      return res.status(200).json({
        success: true,
        feedback: rows,
      });
    } catch (error) {
      console.error("GET ADMIN FEEDBACK ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to load feedback.",
      });
    }
  }
);

app.put(
  "/api/admin/feedback/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { status, adminReply, name, subject, rating, message } = req.body;
      const updates = [];
      const values = [];

      if (status !== undefined) {
        const normalizedStatus = String(status).trim();

        if (!["Pending", "Reviewed", "Resolved"].includes(normalizedStatus)) {
          return res.status(400).json({
            success: false,
            message: "Invalid status. Allowed: Pending, Reviewed, Resolved.",
          });
        }

        updates.push("status = ?");
        values.push(normalizedStatus);
      }

      if (adminReply !== undefined) {
        updates.push("admin_reply = ?");
        values.push(String(adminReply).trim());
      }

      if (name !== undefined) {
        updates.push("name = ?");
        values.push(String(name).trim());
      }

      if (subject !== undefined) {
        updates.push("subject = ?");
        values.push(String(subject).trim());
      }

      if (rating !== undefined) {
        updates.push("rating = ?");
        values.push(Math.min(5, Math.max(1, Number(rating) || 5)));
      }

      if (message !== undefined) {
        updates.push("message = ?");
        values.push(String(message).trim());
      }

      if (updates.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No fields provided to update.",
        });
      }

      await ensureFeedbackTable();
      values.push(req.params.id);
      const [result] = await db.execute(
        `UPDATE feedback SET ${updates.join(", ")} WHERE id = ?`,
        values
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Feedback updated successfully.",
      });
    } catch (error) {
      console.error("UPDATE FEEDBACK ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to update feedback.",
      });
    }
  }
);

app.delete(
  "/api/admin/feedback/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await ensureFeedbackTable();
      const [result] = await db.execute(
        "DELETE FROM feedback WHERE id = ?",
        [req.params.id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Feedback deleted successfully.",
      });
    } catch (error) {
      console.error("DELETE FEEDBACK ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to delete feedback.",
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