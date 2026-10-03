const http = require("node:http");
const https = require("node:https");
require("dotenv").config({ quiet: true });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const { DatabaseSync } = require("node:sqlite");
const {
  randomUUID,
  randomBytes,
  scrypt,
  scryptSync,
  timingSafeEqual,
  createHash,
} = require("node:crypto");
const { promisify } = require("node:util");
const fs = require("node:fs");
const path = require("node:path");
const multer = require("multer");
const rateLimit = require("express-rate-limit");
const seed = require("../data/shops.json");
const deriveKey = promisify(scrypt);
const sessionAge = 7 * 24 * 60 * 60 * 1000;

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
function fail(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}
function transaction(db, action) {
  db.exec("BEGIN IMMEDIATE");
  try {
    const value = action();
    db.exec("COMMIT");
    return value;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
function openDatabase(filename) {
  if (filename !== ":memory:")
    fs.mkdirSync(path.dirname(filename), { recursive: true });
  const db = new DatabaseSync(filename);
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS shops (id TEXT PRIMARY KEY, data TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS products (id TEXT NOT NULL, shopId TEXT NOT NULL REFERENCES shops(id), data TEXT NOT NULL, PRIMARY KEY(shopId,id));
    CREATE TABLE IF NOT EXISTS users (id TEXT NOT NULL, shopId TEXT NOT NULL REFERENCES shops(id), email TEXT NOT NULL, name TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('customer','admin')), PRIMARY KEY(shopId,id), UNIQUE(shopId,email));
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, shopId TEXT NOT NULL, userId TEXT NOT NULL, expires INTEGER NOT NULL, FOREIGN KEY(shopId,userId) REFERENCES users(shopId,id));
    CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, shopId TEXT NOT NULL, userId TEXT NOT NULL, requestId TEXT NOT NULL, data TEXT NOT NULL, created INTEGER NOT NULL, UNIQUE(shopId,userId,requestId), FOREIGN KEY(shopId,userId) REFERENCES users(shopId,id));
    CREATE INDEX IF NOT EXISTS sessionExpiry ON sessions(expires);
    CREATE INDEX IF NOT EXISTS ordersByShopUser ON orders(shopId,userId,created);`);
  const adminEmail = (
    process.env.ADMIN_EMAIL || "admin@atelier.local"
  ).toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "AtelierDemo2026!";
  if (
    process.env.NODE_ENV === "production" &&
    (!process.env.ADMIN_EMAIL ||
      adminEmail === "admin@atelier.local" ||
      !process.env.ADMIN_PASSWORD ||
      adminPassword.length < 16 ||
      adminPassword === "AtelierDemo2026!")
  )
    fail(
      500,
      "Set a unique ADMIN_EMAIL and ADMIN_PASSWORD (16+ characters) for production.",
    );
  transaction(db, () => {
    for (const shop of seed.shops)
      db.prepare("INSERT OR IGNORE INTO shops VALUES (?,?)").run(
        shop.id,
        JSON.stringify(shop),
      );
    // Seed only once: removed products must stay removed on future restarts.
    db.exec(
      "CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value TEXT)",
    );
    if (!db.prepare("SELECT value FROM metadata WHERE key='seeded'").get()) {
      for (const product of seed.products)
        db.prepare("INSERT INTO products VALUES (?,?,?)").run(
          product.id,
          product.shopId,
          JSON.stringify(product),
        );
      db.prepare("INSERT INTO metadata VALUES (?,?)").run("seeded", "1");
    }
    for (const shop of seed.shops) {
      // A development database cannot accidentally retain demo admin access in production.
      if (process.env.NODE_ENV === "production")
        db.prepare(
          "DELETE FROM sessions WHERE userId IN (SELECT id FROM users WHERE email='admin@atelier.local')",
        ).run();
      if (process.env.NODE_ENV === "production")
        db.prepare(
          "UPDATE users SET role='customer',password='disabled' WHERE email='admin@atelier.local'",
        ).run();
      if (
        !db
          .prepare("SELECT id FROM users WHERE shopId=? AND email=?")
          .get(shop.id, adminEmail)
      ) {
        const salt = randomBytes(16).toString("hex");
        const password = `${salt}:${scryptSync(adminPassword, salt, 64).toString("hex")}`;
        db.prepare("INSERT INTO users VALUES (?,?,?,?,?,?)").run(
          randomUUID(),
          shop.id,
          adminEmail,
          "Shop Administrator",
          password,
          "admin",
        );
      }
    }
  });
  return db;
}
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
function getSession(req, db) {
  const match = (req.headers.cookie || "").match(
    /(?:^|;\s*)atelierSession=([a-f0-9]{64})(?:;|$)/,
  );
  if (!match) return null;
  return (
    db
      .prepare(
        "SELECT u.* FROM sessions s JOIN users u ON s.userId=u.id AND s.shopId=u.shopId WHERE s.token=? AND s.shopId=? AND s.expires>?",
      )
      .get(hashToken(match[1]), req.params.shopId, Date.now()) || null
  );
}
function createSession(res, db, user) {
  const token = randomBytes(32).toString("hex");
  db.prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
  db.prepare("INSERT INTO sessions VALUES (?,?,?,?)").run(
    hashToken(token),
    user.shopId,
    user.id,
    Date.now() + sessionAge,
  );
  res.cookie("atelierSession", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: sessionAge,
    path: "/",
  });
}
function validateText(value, label, max = 200, required = true) {
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim())
  )
    fail(400, `Invalid ${label}`);
  return value.trim();
}
function validateProduct(body, shopId, id) {
  const product = { id, shopId, createdAt: new Date().toISOString() };
  for (const key of [
    "name",
    "nameAr",
    "category",
    "categoryAr",
    "description",
    "descriptionAr",
    "finish",
    "badge",
  ])
    product[key] = validateText(
      body[key] ?? "",
      key,
      key.startsWith("description") ? 2000 : 120,
      ["name", "category", "description"].includes(key),
    );
  if (
    typeof body.price !== "number" ||
    !Number.isFinite(body.price) ||
    body.price <= 0 ||
    body.price > 100000
  )
    fail(400, "Invalid price");
  if (!Number.isInteger(body.stock) || body.stock < 0 || body.stock > 100000)
    fail(400, "Invalid stock");
  if (
    typeof body.image !== "string" ||
    !/^\/(images|uploads)\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/.test(
      body.image,
    )
  )
    fail(400, "Upload a JPG, PNG or WebP image");
  product.price = Math.round(body.price * 100) / 100;
  product.stock = body.stock;
  product.image = body.image;
  product.archived = body.archived === true;
  return product;
}
function requireUser(req, db, admin = false) {
  const user = getSession(req, db);
  if (!user) fail(401, "Please sign in to this shop");
  if (admin && user.role !== "admin")
    fail(403, "Administrator access required");
  return user;
}
function assertOrigin(req, res, next) {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  const origin = req.headers.origin;
  const origins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .filter(Boolean);
  let sameOrigin = false;
  try {
    sameOrigin = !!origin && new URL(origin).host === req.get("host");
  } catch {
    /* Invalid origins are rejected below. */
  }
  if (origin && !sameOrigin && !origins.includes(origin))
    return res.status(403).json({ message: "Origin is not allowed" });
  if (req.headers["sec-fetch-site"] === "cross-site")
    return res
      .status(403)
      .json({ message: "Cross-site requests are not allowed" });
  if (!req.is("application/json") && !req.is("multipart/form-data"))
    return res.status(415).json({ message: "Use JSON or multipart form data" });
  if (
    req.is("application/json") &&
    (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
  )
    return res.status(400).json({ message: "A JSON object is required" });
  next();
}
function registerRoutes(app, db) {
  const cache = new Map();
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  });
  const authLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message: "Too many sign-in attempts. Please try again later." },
  });
  app.use("/api", assertOrigin);
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.get("/api/shops", (req, res) =>
    res.json(
      db
        .prepare("SELECT data FROM shops")
        .all()
        .map((row) => JSON.parse(row.data)),
    ),
  );
  app.param("shopId", (req, res, next, shopId) => {
    if (!db.prepare("SELECT id FROM shops WHERE id=?").get(shopId))
      return res.status(404).json({ message: "Shop not found" });
    next();
  });
  app.get("/api/shops/:shopId/products", (req, res) => {
    const { shopId } = req.params;
    const isAdminList = req.query.includeArchived === "true";
    if (isAdminList) {
      requireUser(req, db, true);
      res.set("Cache-Control", "no-store");
    }
    const cached = cache.get(shopId);
    if (!isAdminList && cached && cached.expires > Date.now())
      return res.set("X-Catalog-Cache", "HIT").json(cached.data);
    const products = db
      .prepare("SELECT data FROM products WHERE shopId=?")
      .all(shopId)
      .map((row) => JSON.parse(row.data))
      .filter((product) => isAdminList || !product.archived);
    if (!isAdminList)
      cache.set(shopId, { expires: Date.now() + 15000, data: products });
    res.set("X-Catalog-Cache", "MISS").json(products);
  });
  app.get("/api/shops/:shopId/auth/me", (req, res) => {
    const user = getSession(req, db);
    res.set("Cache-Control", "no-store").json(user ? publicUser(user) : null);
  });
  app.post("/api/shops/:shopId/auth/:action", authLimit, async (req, res) => {
    const { shopId, action } = req.params;
    res.set("Cache-Control", "no-store");
    if (action === "logout") {
      const match = (req.headers.cookie || "").match(
        /atelierSession=([a-f0-9]{64})/,
      );
      if (match)
        db.prepare("DELETE FROM sessions WHERE token=?").run(
          hashToken(match[1]),
        );
      res.clearCookie("atelierSession", { path: "/" });
      return res.json({ ok: true });
    }
    if (!["login", "register"].includes(action)) fail(404, "Unknown action");
    const email = validateText(req.body.email, "email", 254).toLowerCase();
    const password = validateText(req.body.password, "password", 200);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 10)
      fail(400, "Use a valid email and a password of at least 10 characters");
    let user = db
      .prepare("SELECT * FROM users WHERE shopId=? AND email=?")
      .get(shopId, email);
    if (action === "register") {
      if (user)
        fail(409, "An account with this email already exists in this shop");
      const name = validateText(req.body.name, "name", 100);
      const salt = randomBytes(16).toString("hex");
      const hash = (await deriveKey(password, salt, 64)).toString("hex");
      user = {
        id: randomUUID(),
        shopId,
        email,
        name,
        password: `${salt}:${hash}`,
        role: "customer",
      };
      try {
        db.prepare("INSERT INTO users VALUES (?,?,?,?,?,?)").run(
          user.id,
          shopId,
          email,
          name,
          user.password,
          user.role,
        );
      } catch (error) {
        if (error.message.includes("UNIQUE"))
          fail(409, "An account with this email already exists in this shop");
        throw error;
      }
    } else {
      const [salt, expected] = (user?.password || "invalid:").split(":");
      const hash = await deriveKey(password, salt, 64);
      if (
        !expected ||
        expected.length !== 128 ||
        !timingSafeEqual(hash, Buffer.from(expected, "hex"))
      )
        fail(401, "Email or password is incorrect");
    }
    createSession(res, db, user);
    res.status(action === "register" ? 201 : 200).json(publicUser(user));
  });
  app.post("/api/shops/:shopId/products", (req, res) => {
    requireUser(req, db, true);
    const product = validateProduct(req.body, req.params.shopId, randomUUID());
    db.prepare("INSERT INTO products VALUES (?,?,?)").run(
      product.id,
      product.shopId,
      JSON.stringify(product),
    );
    cache.delete(product.shopId);
    res.status(201).json(product);
  });
  app.put("/api/shops/:shopId/products/:id", (req, res) => {
    requireUser(req, db, true);
    const existing = db
      .prepare("SELECT data FROM products WHERE shopId=? AND id=?")
      .get(req.params.shopId, req.params.id);
    if (!existing) fail(404, "Product not found");
    const product = validateProduct(req.body, req.params.shopId, req.params.id);
    product.createdAt =
      JSON.parse(existing.data).createdAt || product.createdAt;
    const result = db
      .prepare("UPDATE products SET data=? WHERE shopId=? AND id=?")
      .run(JSON.stringify(product), product.shopId, product.id);
    if (!result.changes) fail(404, "Product not found");
    cache.delete(product.shopId);
    res.json(product);
  });
  app.delete("/api/shops/:shopId/products/:id", (req, res) => {
    requireUser(req, db, true);
    const result = db
      .prepare("DELETE FROM products WHERE shopId=? AND id=?")
      .run(req.params.shopId, req.params.id);
    if (!result.changes) fail(404, "Product not found");
    cache.delete(req.params.shopId);
    res.json({ ok: true });
  });
  app.post(
    "/api/shops/:shopId/uploads",
    (req, res, next) => {
      requireUser(req, db, true);
      next();
    },
    upload.single("image"),
    (req, res) => {
      const file = req.file;
      if (!file) fail(400, "Choose an image");
      const bytes = file.buffer;
      let extension;
      if (bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])))
        extension = "jpg";
      else if (
        bytes
          .subarray(0, 8)
          .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
      )
        extension = "png";
      else if (
        bytes.toString("ascii", 0, 4) === "RIFF" &&
        bytes.toString("ascii", 8, 12) === "WEBP"
      )
        extension = "webp";
      else fail(400, "Only JPG, PNG and WebP images are accepted");
      const name = `${randomUUID()}.${extension}`;
      fs.mkdirSync(path.resolve("public/uploads"), { recursive: true });
      fs.writeFileSync(path.resolve("public/uploads", name), bytes);
      res.status(201).json({ image: `/uploads/${name}` });
    },
  );
  app.post("/api/shops/:shopId/orders", (req, res) => {
    const user = requireUser(req, db);
    res.set("Cache-Control", "no-store");
    const { shopId } = req.params;
    const requestId = validateText(req.body.requestId, "request ID", 80);
    if (!/^[a-f0-9-]{36}$/.test(requestId)) fail(400, "Invalid request ID");
    const shipping = {};
    for (const key of [
      "name",
      "email",
      "address",
      "city",
      "postalCode",
      "country",
    ])
      shipping[key] = validateText(req.body.shipping?.[key], key, 254);
    const items = req.body.items;
    if (!Array.isArray(items) || !items.length || items.length > 100)
      fail(400, "Your bag is empty or too large");
    const order = transaction(db, () => {
      const existing = db
        .prepare(
          "SELECT data FROM orders WHERE shopId=? AND userId=? AND requestId=?",
        )
        .get(shopId, user.id, requestId);
      if (existing) return JSON.parse(existing.data);
      const seen = new Set();
      const lines = items.map((item) => {
        if (
          typeof item.id !== "string" ||
          seen.has(item.id) ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          item.quantity > 99
        )
          fail(400, "Invalid quantity or duplicate product");
        seen.add(item.id);
        const row = db
          .prepare("SELECT data FROM products WHERE shopId=? AND id=?")
          .get(shopId, item.id);
        if (!row) fail(400, "A product is unavailable in this shop");
        const product = JSON.parse(row.data);
        if (product.archived || product.stock < item.quantity)
          fail(409, `${product.name} is out of stock`);
        product.stock -= item.quantity;
        db.prepare("UPDATE products SET data=? WHERE shopId=? AND id=?").run(
          JSON.stringify(product),
          shopId,
          item.id,
        );
        return {
          id: product.id,
          name: product.name,
          quantity: item.quantity,
          unitPriceCents: Math.round(product.price * 100),
        };
      });
      const subtotalCents = lines.reduce(
        (sum, item) => sum + item.unitPriceCents * item.quantity,
        0,
      );
      const shippingCents = subtotalCents >= 15000 ? 0 : 800;
      const value = {
        id: randomUUID(),
        shopId,
        items: lines,
        subtotalCents,
        shippingCents,
        totalCents: subtotalCents + shippingCents,
        shipping,
        status: "demo-confirmed",
        createdAt: new Date().toISOString(),
      };
      db.prepare("INSERT INTO orders VALUES (?,?,?,?,?,?)").run(
        value.id,
        shopId,
        user.id,
        requestId,
        JSON.stringify(value),
        Date.now(),
      );
      return value;
    });
    cache.delete(shopId);
    res.status(201).json(order);
  });
  app.get("/api/shops/:shopId/orders", (req, res) => {
    const user = requireUser(req, db);
    res.set("Cache-Control", "no-store").json(
      db
        .prepare(
          "SELECT data FROM orders WHERE shopId=? AND userId=? ORDER BY created DESC LIMIT 50",
        )
        .all(req.params.shopId, user.id)
        .map((row) => JSON.parse(row.data)),
    );
  });
  return cache;
}
function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status =
    error.status || (error instanceof multer.MulterError ? 400 : 500);
  if (status === 500) console.error("Request failed:", error.message);
  res.status(status).json({
    message:
      status === 500
        ? "Something went wrong. Please try again."
        : error.message,
  });
}
module.exports = {
  openDatabase,
  registerRoutes,
  errorHandler,
  assertOrigin,
  transaction,
  validateProduct,
};

function createApp(
  databasePath = process.env.DATABASE_PATH || "server/data/atelier.sqlite",
) {
  const app = express();
  const db = openDatabase(databasePath);
  app.disable("x-powered-by");
  const trustedProxies = (
    process.env.TRUST_PROXY ||
    (process.env.NODE_ENV === "production" ? "" : "loopback")
  )
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (trustedProxies.length) app.set("trust proxy", trustedProxies);
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "img-src": ["'self'", "data:"],
          "font-src": ["'self'", "https://fonts.gstatic.com"],
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          "script-src": ["'self'"],
        },
      },
      strictTransportSecurity:
        process.env.NODE_ENV === "production" ? undefined : false,
    }),
  );
  app.use(
    cors({
      origin: (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean),
      credentials: true,
    }),
  );
  if (process.env.NODE_ENV !== "test")
    app.use(morgan("tiny", { skip: (req) => req.path === "/api/health" }));
  app.use(express.json({ limit: "100kb" }));
  if (fs.existsSync("public/favicon.ico"))
    app.use(favicon(path.resolve("public/favicon.ico")));
  app.use(
    "/uploads",
    express.static(path.resolve("public/uploads"), {
      dotfiles: "deny",
      maxAge: "1d",
    }),
  );
  registerRoutes(app, db);
  app.use("/api", (req, res) =>
    res.status(404).json({ message: "Endpoint not found" }),
  );
  const staticRoot = fs.existsSync("dist/index.html") ? "dist" : "build";
  if (fs.existsSync(`${staticRoot}/index.html`)) {
    app.use(express.static(path.resolve(staticRoot)));
    app.get("/{*path}", (req, res) =>
      res.sendFile(path.resolve(staticRoot, "index.html")),
    );
  }
  app.use(errorHandler);
  return { app, db };
}

function startServer() {
  const { app, db } = createApp();
  const tls = process.env.TLS_KEY_PATH && process.env.TLS_CERT_PATH;
  const server = tls
    ? https.createServer(
        {
          key: fs.readFileSync(process.env.TLS_KEY_PATH),
          cert: fs.readFileSync(process.env.TLS_CERT_PATH),
        },
        app,
      )
    : http.createServer(app);
  server.listen(Number(process.env.PORT) || 4000, "0.0.0.0", () =>
    console.log(`Atelier API ready on port ${process.env.PORT || 4000}`),
  );
  const shutdown = () =>
    server.close(() => {
      db.close();
      process.exit(0);
    });
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}
module.exports.createApp = createApp;
module.exports.startServer = startServer;
