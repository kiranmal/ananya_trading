
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
      quantity_step INT NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  /* Purani table pe missing column add karo */
  try {
    await db.execute(
      "ALTER TABLE products ADD COLUMN quantity_step INT NOT NULL DEFAULT 1"
    );
  } catch {
    /* column already exists */
  }
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
    quantityStep: Math.max(
      1,
      Number(row.quantity_step || 1)
    ),
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
    quantityStep: Math.max(
      1,
      Math.floor(Number(body.quantityStep ?? 1)) || 1
    ),
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
             paper_types, sizes, features, quantity_step)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
            product.quantityStep,
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
           paper_types, sizes, features, quantity_step)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          product.quantityStep,
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
          sizes = ?, features = ?, quantity_step = ?
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
          product.quantityStep,
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

/* =========================================================
   CATEGORIES
========================================================= */

const DEFAULT_CATEGORIES = [
  { name: "Visiting Cards", items: ["Premium Business Cards", "Standard Cards", "Matte Cards", "Glossy Cards"] },
  { name: "Stationery & Office", items: ["Letterheads", "Notebooks", "Envelopes", "Office Files", "Stamps"] },
  { name: "Marketing Materials", items: ["Flyers", "Brochures", "Posters", "Leaflets", "Calendars"] },
  { name: "Stickers & Labels", items: ["Product Labels", "Vinyl Stickers", "Round Stickers", "Packaging Labels"] },
  { name: "Packaging", items: ["Paper Bags", "Boxes", "Food Packaging", "Product Packaging"] },
  { name: "Clothing & Bags", items: ["T-Shirts", "Caps", "Tote Bags", "Corporate Bags"] },
  { name: "Mugs & Gifts", items: ["Coffee Mugs", "Photo Mugs", "Keychains", "Corporate Gifts"] },
  { name: "Pens & Drinkware", items: ["Ball Pens", "Premium Pens", "Water Bottles", "Travel Mugs"] },
  { name: "Custom Polo T-Shirts", items: ["Corporate Polo", "Printed Polo", "Custom T-Shirts"] },
];

async function ensureCategoriesTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id INT NOT NULL AUTO_INCREMENT,
      name VARCHAR(150) NOT NULL,
      items TEXT DEFAULT NULL,
      sort_order INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY category_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  const [rows] = await db.execute(
    "SELECT COUNT(*) AS count FROM categories"
  );

  if (rows[0].count === 0) {
    for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
      const cat = DEFAULT_CATEGORIES[i];
      await db.execute(
        "INSERT INTO categories (name, items, sort_order) VALUES (?, ?, ?)",
        [cat.name, JSON.stringify(cat.items), i]
      );
    }
    console.log("Default categories seeded");
  }
}

app.get("/api/categories", async (req, res) => {
  try {
    await ensureCategoriesTable();
    const [rows] = await db.execute(
      "SELECT id, name, items, sort_order FROM categories ORDER BY sort_order ASC, id ASC"
    );

    const categories = rows.map((row) => ({
      id: row.id,
      name: row.name,
      items: (() => {
        try {
          return JSON.parse(row.items || "[]");
        } catch {
          return [];
        }
      })(),
    }));

    return res.status(200).json({ success: true, categories });
  } catch (error) {
    console.error("Categories fetch error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to load categories.",
    });
  }
});

app.post(
  "/api/admin/categories",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const name = String(req.body?.name || "").trim();
      const items = Array.isArray(req.body?.items)
        ? req.body.items
            .map((item) => String(item).trim())
            .filter(Boolean)
        : [];

      if (name.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Category name must be at least 2 characters.",
        });
      }

      await ensureCategoriesTable();

      const [existing] = await db.execute(
        "SELECT id FROM categories WHERE name = ? LIMIT 1",
        [name]
      );

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Category already exists.",
        });
      }

      const [maxRow] = await db.execute(
        "SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM categories"
      );

      const [result] = await db.execute(
        "INSERT INTO categories (name, items, sort_order) VALUES (?, ?, ?)",
        [name, JSON.stringify(items), maxRow[0].maxOrder + 1]
      );

      return res.status(201).json({
        success: true,
        message: "Category added.",
        category: {
          id: result.insertId,
          name,
          items,
        },
      });
    } catch (error) {
      console.error("Category add error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to add category.",
      });
    }
  }
);

app.put(
  "/api/admin/categories/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const name = String(req.body?.name || "").trim();
      const items = Array.isArray(req.body?.items)
        ? req.body.items
            .map((item) => String(item).trim())
            .filter(Boolean)
        : [];

      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid category id.",
        });
      }

      if (name.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Category name must be at least 2 characters.",
        });
      }

      await ensureCategoriesTable();

      const [existing] = await db.execute(
        "SELECT id FROM categories WHERE id = ? LIMIT 1",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      const [duplicate] = await db.execute(
        "SELECT id FROM categories WHERE name = ? AND id != ? LIMIT 1",
        [name, id]
      );

      if (duplicate.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Another category with this name already exists.",
        });
      }

      await db.execute(
        "UPDATE categories SET name = ?, items = ? WHERE id = ?",
        [name, JSON.stringify(items), id]
      );

      return res.status(200).json({
        success: true,
        message: "Category updated.",
        category: { id, name, items },
      });
    } catch (error) {
      console.error("Category update error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to update category.",
      });
    }
  }
);

app.delete(
  "/api/admin/categories/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "Invalid category id.",
        });
      }

      await ensureCategoriesTable();

      const [existing] = await db.execute(
        "SELECT id FROM categories WHERE id = ? LIMIT 1",
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }

      await db.execute("DELETE FROM categories WHERE id = ?", [id]);

      return res.status(200).json({
        success: true,
        message: "Category deleted.",
      });
    } catch (error) {
      console.error("Category delete error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to delete category.",
      });
    }
  }
);

/* =========================================================
   ORDERS
========================================================= */

async function ensureOrdersTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id INT NOT NULL AUTO_INCREMENT,
      order_id VARCHAR(60) DEFAULT NULL,
      user_id INT DEFAULT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'New',
      customer_name VARCHAR(150) DEFAULT NULL,
      email VARCHAR(190) DEFAULT NULL,
      phone VARCHAR(30) DEFAULT NULL,
      total DECIMAL(10,2) DEFAULT 0,
      total_price DECIMAL(10,2) DEFAULT 0,
      payment_method VARCHAR(50) DEFAULT NULL,
      payment_status VARCHAR(30) DEFAULT 'Pending',
      items LONGTEXT DEFAULT NULL,
      payload LONGTEXT DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY order_id (order_id),
      KEY user_id (user_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);

  /* Purane schema pe missing columns add karo */
  const addColumn = async (sql) => {
    try {
      await db.execute(sql);
    } catch {
      /* column already exists — skip */
    }
  };

  await addColumn(
    "ALTER TABLE orders ADD COLUMN payload LONGTEXT"
  );
  await addColumn(
    "ALTER TABLE orders ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );
  await addColumn(
    "ALTER TABLE orders ADD COLUMN total DECIMAL(10,2) DEFAULT 0"
  );
  await addColumn(
    "ALTER TABLE orders ADD UNIQUE KEY order_id (order_id)"
  );
}

const buildOrderTracking = (status) => {
  const s = String(status || "").toLowerCase();
  return {
    ordered: true,
    processing:
      s.includes("process") ||
      s.includes("ship") ||
      s.includes("out") ||
      s.includes("deliver"),
    shipped:
      s.includes("ship") ||
      s.includes("out") ||
      s.includes("deliver"),
    outForDelivery: s.includes("deliver"),
    delivered: s.includes("delivered"),
  };
};

const parseOrderRow = (row) => {
  let payload = {};
  try {
    payload = JSON.parse(row.payload || "{}");
  } catch {
    payload = {};
  }

  return {
    ...payload,
    id: payload.id || row.order_id,
    orderId: payload.orderId || row.order_id,
    orderNumber:
      payload.orderNumber || row.order_id,
    status: row.status,
    customerName:
      payload.customerName || row.customer_name,
    email: payload.email || row.email,
    total:
      payload.total ?? Number(row.total_price),
    grandTotal:
      payload.grandTotal ??
      Number(row.total_price),
    createdAt: payload.createdAt || row.created_at,
    updatedAt: row.updated_at,
    dbId: row.id,
  };
};

/* USER — order place karna (login required) */
app.post(
  "/api/orders",
  authenticateToken,
  async (req, res) => {
    try {
      const order = req.body || {};
      const orderNumber = String(
        order.orderNumber ||
          order.orderId ||
          order.id ||
          ""
      ).trim();

      if (!orderNumber) {
        return res.status(400).json({
          success: false,
          message: "Order number is required.",
        });
      }

      await ensureOrdersTable();

      const status = String(
        order.status || "New"
      );
      const customerName = String(
        order.customerName ||
          order.customer?.name ||
          order.name ||
          ""
      );
      const email = String(
        order.email ||
          order.customer?.email ||
          ""
      );
      const phone = String(
        order.phone ||
          order.customer?.phone ||
          ""
      );
      const total = Number(
        order.total ??
          order.grandTotal ??
          order.totalPrice ??
          0
      );

      const payload = {
        ...order,
        orderNumber,
        status,
        tracking:
          order.tracking ||
          buildOrderTracking(status),
      };

      await db.execute(
        `INSERT INTO orders
          (order_id, user_id, status,
           customer_name, email, phone,
           total_price, total,
           payment_method, payment_status,
           items, payload)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           user_id = VALUES(user_id),
           status = VALUES(status),
           payload = VALUES(payload),
           updated_at = CURRENT_TIMESTAMP`,
        [
          orderNumber,
          req.user?.id || null,
          status,
          customerName,
          email,
          phone,
          total,
          total,
          String(
            order.paymentMethod ||
              order.payment ||
              ""
          ),
          String(
            order.paymentStatus || "Pending"
          ),
          JSON.stringify(
            order.items ||
              order.products ||
              order.cart ||
              []
          ),
          JSON.stringify(payload),
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Order saved.",
        orderNumber,
      });
    } catch (error) {
      console.error("Order save error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to save order.",
      });
    }
  }
);

/* USER — apne orders */
app.get(
  "/api/orders/my",
  authenticateToken,
  async (req, res) => {
    try {
      await ensureOrdersTable();

      const [rows] = await db.execute(
        `SELECT * FROM orders
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [req.user?.id || 0]
      );

      return res.status(200).json({
        success: true,
        orders: rows.map(parseOrderRow),
      });
    } catch (error) {
      console.error("My orders error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to load orders.",
      });
    }
  }
);

/* USER — order number se track */
app.get(
  "/api/orders/track/:orderNumber",
  async (req, res) => {
    try {
      await ensureOrdersTable();

      const [rows] = await db.execute(
        `SELECT * FROM orders
         WHERE order_id = ? LIMIT 1`,
        [String(req.params.orderNumber)]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      return res.status(200).json({
        success: true,
        order: parseOrderRow(rows[0]),
      });
    } catch (error) {
      console.error("Track order error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to track order.",
      });
    }
  }
);

/* ADMIN — saare orders */
app.get(
  "/api/admin/orders",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await ensureOrdersTable();

      const [rows] = await db.execute(
        "SELECT * FROM orders ORDER BY created_at DESC"
      );

      return res.status(200).json({
        success: true,
        orders: rows.map(parseOrderRow),
      });
    } catch (error) {
      console.error("Admin orders error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to load orders.",
      });
    }
  }
);

/* ADMIN — status update */
app.put(
  "/api/admin/orders/:orderNumber/status",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const orderNumber = String(
        req.params.orderNumber
      );
      const status = String(
        req.body?.status || ""
      ).trim();

      if (!status) {
        return res.status(400).json({
          success: false,
          message: "Status is required.",
        });
      }

      await ensureOrdersTable();

      const [rows] = await db.execute(
        `SELECT * FROM orders
         WHERE order_id = ? LIMIT 1`,
        [orderNumber]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Order not found.",
        });
      }

      let payload = {};
      try {
        payload = JSON.parse(
          rows[0].payload || "{}"
        );
      } catch {
        payload = {};
      }

      payload.status = status;
      payload.tracking =
        buildOrderTracking(status);
      payload.updatedAt =
        new Date().toISOString();

      await db.execute(
        `UPDATE orders
         SET status = ?, payload = ?
         WHERE order_id = ?`,
        [
          status,
          JSON.stringify(payload),
          orderNumber,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "Order status updated.",
        status,
      });
    } catch (error) {
      console.error(
        "Order status update error:",
        error
      );
      return res.status(500).json({
        success: false,
        message:
          "Unable to update order status.",
      });
    }
  }
);

/* =========================================================
   DISCOUNT COUPONS
========================================================= */

async function ensureCouponsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS coupons (
      id INT NOT NULL AUTO_INCREMENT,
      code VARCHAR(50) NOT NULL,
      type ENUM('percent','flat') NOT NULL DEFAULT 'percent',
      value DECIMAL(10,2) NOT NULL DEFAULT 0,
      min_order DECIMAL(10,2) NOT NULL DEFAULT 0,
      valid_from DATETIME NOT NULL,
      valid_to DATETIME NOT NULL,
      active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY coupon_code (code)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
  `);
}

const formatCoupon = (row) => ({
  id: row.id,
  code: row.code,
  type: row.type,
  value: Number(row.value),
  minOrder: Number(row.min_order),
  validFrom: row.valid_from,
  validTo: row.valid_to,
  active: Boolean(row.active),
  createdAt: row.created_at,
});

/* ADMIN — list */
app.get(
  "/api/admin/coupons",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      await ensureCouponsTable();
      const [rows] = await db.execute(
        "SELECT * FROM coupons ORDER BY created_at DESC"
      );
      return res.status(200).json({
        success: true,
        coupons: rows.map(formatCoupon),
      });
    } catch (error) {
      console.error("Coupons fetch error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to load coupons.",
      });
    }
  }
);

/* ADMIN — create */
app.post(
  "/api/admin/coupons",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const code = String(req.body?.code || "")
        .trim()
        .toUpperCase();
      const type =
        req.body?.type === "flat" ? "flat" : "percent";
      const value = Number(req.body?.value);
      const minOrder = Number(req.body?.minOrder) || 0;
      const validFrom = req.body?.validFrom;
      const validTo = req.body?.validTo;

      if (code.length < 3 || !/^[A-Z0-9]+$/.test(code)) {
        return res.status(400).json({
          success: false,
          message:
            "Code must be at least 3 characters (letters & numbers only).",
        });
      }

      if (!value || value <= 0) {
        return res.status(400).json({
          success: false,
          message: "Discount value must be greater than 0.",
        });
      }

      if (
        type === "percent" &&
        value > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Percent discount cannot exceed 100.",
        });
      }

      const from = new Date(validFrom);
      const to = new Date(validTo);

      if (
        isNaN(from.getTime()) ||
        isNaN(to.getTime()) ||
        to <= from
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Valid To must be after Valid From.",
        });
      }

      await ensureCouponsTable();

      const [existing] = await db.execute(
        "SELECT id FROM coupons WHERE code = ? LIMIT 1",
        [code]
      );

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Coupon code already exists.",
        });
      }

      const [result] = await db.execute(
        `INSERT INTO coupons
          (code, type, value, min_order,
           valid_from, valid_to, active)
         VALUES (?, ?, ?, ?, ?, ?, 1)`,
        [code, type, value, minOrder, from, to]
      );

      return res.status(201).json({
        success: true,
        message: "Coupon created.",
        coupon: {
          id: result.insertId,
          code,
          type,
          value,
          minOrder,
          validFrom: from,
          validTo: to,
          active: true,
        },
      });
    } catch (error) {
      console.error("Coupon create error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to create coupon.",
      });
    }
  }
);

/* ADMIN — update (edit / active toggle) */
app.put(
  "/api/admin/coupons/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      await ensureCouponsTable();

      const [rows] = await db.execute(
        "SELECT * FROM coupons WHERE id = ? LIMIT 1",
        [id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found.",
        });
      }

      const current = rows[0];

      const code = String(
        req.body?.code || current.code
      )
        .trim()
        .toUpperCase();
      const type =
        req.body?.type === "flat"
          ? "flat"
          : req.body?.type === "percent"
            ? "percent"
            : current.type;
      const value =
        req.body?.value !== undefined
          ? Number(req.body.value)
          : Number(current.value);
      const minOrder =
        req.body?.minOrder !== undefined
          ? Number(req.body.minOrder)
          : Number(current.min_order);
      const validFrom = req.body?.validFrom
        ? new Date(req.body.validFrom)
        : current.valid_from;
      const validTo = req.body?.validTo
        ? new Date(req.body.validTo)
        : current.valid_to;
      const active =
        req.body?.active !== undefined
          ? (req.body.active ? 1 : 0)
          : current.active;

      if (code.length < 3 || !/^[A-Z0-9]+$/.test(code)) {
        return res.status(400).json({
          success: false,
          message: "Invalid coupon code.",
        });
      }

      if (!value || value <= 0) {
        return res.status(400).json({
          success: false,
          message: "Discount value must be greater than 0.",
        });
      }

      if (new Date(validTo) <= new Date(validFrom)) {
        return res.status(400).json({
          success: false,
          message:
            "Valid To must be after Valid From.",
        });
      }

      const [dup] = await db.execute(
        "SELECT id FROM coupons WHERE code = ? AND id != ? LIMIT 1",
        [code, id]
      );

      if (dup.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Another coupon with this code exists.",
        });
      }

      await db.execute(
        `UPDATE coupons
         SET code = ?, type = ?, value = ?,
             min_order = ?, valid_from = ?,
             valid_to = ?, active = ?
         WHERE id = ?`,
        [
          code,
          type,
          value,
          minOrder,
          validFrom,
          validTo,
          active,
          id,
        ]
      );

      return res.status(200).json({
        success: true,
        message: "Coupon updated.",
      });
    } catch (error) {
      console.error("Coupon update error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to update coupon.",
      });
    }
  }
);

/* ADMIN — delete */
app.delete(
  "/api/admin/coupons/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      await ensureCouponsTable();

      const [result] = await db.execute(
        "DELETE FROM coupons WHERE id = ?",
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Coupon deleted.",
      });
    } catch (error) {
      console.error("Coupon delete error:", error);
      return res.status(500).json({
        success: false,
        message: "Unable to delete coupon.",
      });
    }
  }
);

/* USER — coupon validate (checkout) */
app.post("/api/coupons/validate", async (req, res) => {
  try {
    const code = String(req.body?.code || "")
      .trim()
      .toUpperCase();
    const orderTotal = Number(req.body?.total) || 0;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Enter a coupon code.",
      });
    }

    await ensureCouponsTable();

    const [rows] = await db.execute(
      "SELECT * FROM coupons WHERE code = ? LIMIT 1",
      [code]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    const coupon = rows[0];
    const now = new Date();

    if (!coupon.active) {
      return res.status(400).json({
        success: false,
        message: "This coupon is no longer active.",
      });
    }

    if (now < new Date(coupon.valid_from)) {
      return res.status(400).json({
        success: false,
        message: `Coupon starts from ${new Date(coupon.valid_from).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}.`,
      });
    }

    if (now > new Date(coupon.valid_to)) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired.",
      });
    }

    if (orderTotal < Number(coupon.min_order)) {
      return res.status(400).json({
        success: false,
        message: `Minimum order ₹${Number(coupon.min_order).toLocaleString("en-IN")} required for this coupon.`,
      });
    }

    const discount =
      coupon.type === "percent"
        ? Math.round(
            (orderTotal *
              Number(coupon.value)) /
              100
          )
        : Number(coupon.value);

    return res.status(200).json({
      success: true,
      message: "Coupon applied!",
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: Number(coupon.value),
      },
      discount: Math.min(discount, orderTotal),
    });
  } catch (error) {
    console.error("Coupon validate error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to validate coupon.",
    });
  }
});

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