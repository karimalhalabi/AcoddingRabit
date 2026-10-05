import express from "express";
import { rateLimit } from "express-rate-limit";
import { DatabaseSync } from "node:sqlite";
import { randomBytes, scrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { validateSchedule } from "../src/util/helpers.js";
const app = express(),
  derive = promisify(scrypt);
mkdirSync(process.env.DATA_DIR || ".data", { recursive: true });
const db = new DatabaseSync(
  resolve(process.env.DATA_DIR || ".data", "tarteeb.sqlite"),
);
db.exec(
  "PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL); CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, userId INTEGER REFERENCES users(id), expires INTEGER); CREATE TABLE IF NOT EXISTS schedules (id TEXT NOT NULL, userId INTEGER REFERENCES users(id), data TEXT NOT NULL, updated TEXT NOT NULL, PRIMARY KEY(id,userId));",
);
// Development proxies may rewrite Host. Only explicitly configured frontend
// origins may differ from the backend host; arbitrary forwarded headers are ignored.
const allowedOrigins = new Set(
  (process.env.APP_ORIGINS || "http://localhost:5173,http://127.0.0.1:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
app.disable("x-powered-by");
app.use(express.json({ limit: "2mb" }));
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.headers.origin;
    if (origin) {
      let host;
      try {
        host = new URL(origin).host;
      } catch {
        return res.status(403).json({ error: "Invalid origin." });
      }
      if (host !== req.headers.host && !allowedOrigins.has(origin))
        return res
          .status(403)
          .json({ error: "Cross-origin requests are not allowed." });
    }
    if (!req.is("application/json"))
      return res.status(415).json({ error: "JSON requests are required." });
  }
  next();
});
const digest = (value) => createHash("sha256").update(value).digest("hex");
app.use("/api", (req, res, next) => {
  const token = req.headers.cookie
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("tarteeb_session="))
    ?.slice(16);
  if (token) {
    req.sessionToken = digest(token);
    req.user = db
      .prepare(
        "SELECT users.id, name, email FROM sessions JOIN users ON users.id=sessions.userId WHERE token=? AND expires>?",
      )
      .get(req.sessionToken, Date.now());
  }
  next();
});
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: "Too many attempts. Please try again in 15 minutes." },
});
function session(res, userId) {
  db.prepare("DELETE FROM sessions WHERE expires <= ?").run(Date.now());
  const token = randomBytes(32).toString("hex");
  db.prepare("INSERT INTO sessions VALUES (?,?,?)").run(
    digest(token),
    userId,
    Date.now() + 7 * 86400000,
  );
  res.cookie("tarteeb_session", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: 7 * 86400000,
    path: "/",
  });
}
function requireUser(req, res, next) {
  if (!req.user)
    return res
      .status(401)
      .json({ error: "Please sign in to save schedules to your account." });
  next();
}
app.get("/api/health", (_, res) => res.json({ status: "ok" }));
app.get("/api/auth/me", (req, res) => res.json({ user: req.user || null }));
app.post("/api/auth/register", authLimit, async (req, res) => {
  const { name, email, password } = req.body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 100 ||
    typeof email !== "string" ||
    email.length > 254 ||
    !/^\S+@\S+\.\S+$/.test(email) ||
    typeof password !== "string" ||
    password.length < 10 ||
    password.length > 128
  )
    return res.status(400).json({
      error: "Use a valid name, email, and a password of 10–128 characters.",
    });
  const salt = randomBytes(16).toString("hex"),
    key = await derive(password, salt, 64);
  try {
    const result = db
      .prepare("INSERT INTO users(name,email,password) VALUES (?,?,?)")
      .run(
        name.trim(),
        email.trim().toLowerCase(),
        `${salt}:${key.toString("hex")}`,
      );
    const user = {
      id: Number(result.lastInsertRowid),
      name: name.trim(),
      email: email.trim().toLowerCase(),
    };
    session(res, user.id);
    res.status(201).json({ user });
  } catch (error) {
    if (error.code === "ERR_SQLITE_ERROR" && error.message.includes("UNIQUE"))
      return res
        .status(409)
        .json({ error: "An account already exists for this email." });
    throw error;
  }
});
app.post("/api/auth/login", authLimit, async (req, res) => {
  const { email, password } = req.body;
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.length > 254 ||
    password.length > 128
  )
    return res.status(400).json({ error: "Enter your email and password." });
  const user = db
    .prepare("SELECT * FROM users WHERE email=?")
    .get(email.trim().toLowerCase());
  const [salt, stored] = user
    ? user.password.split(":")
    : ["invalid-user-salt", "00".repeat(64)];
  const key = await derive(password, salt, 64);
  if (!timingSafeEqual(key, Buffer.from(stored, "hex")) || !user)
    return res.status(401).json({ error: "Email or password is incorrect." });
  session(res, user.id);
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});
app.post("/api/auth/logout", (req, res) => {
  if (req.sessionToken)
    db.prepare("DELETE FROM sessions WHERE token=?").run(req.sessionToken);
  res.clearCookie("tarteeb_session", { path: "/" });
  res.json({ ok: true });
});
app.get("/api/schedules", requireUser, (req, res) => {
  res.json({
    schedules: db
      .prepare(
        "SELECT data FROM schedules WHERE userId=? ORDER BY updated DESC LIMIT 50",
      )
      .all(req.user.id)
      .map((row) => JSON.parse(row.data)),
  });
});
app.put("/api/schedules/:id", requireUser, (req, res) => {
  try {
    validateSchedule(req.body);
    if (
      req.body.id !== req.params.id ||
      typeof req.body.id !== "string" ||
      req.body.id.length > 100 ||
      typeof req.body.name !== "string" ||
      req.body.name.length > 100
    )
      throw new Error("Invalid schedule identity.");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  const count = db
    .prepare("SELECT COUNT(*) AS count FROM schedules WHERE userId=?")
    .get(req.user.id).count;
  const exists = db
    .prepare("SELECT id FROM schedules WHERE id=? AND userId=?")
    .get(req.params.id, req.user.id);
  if (count >= 50 && !exists)
    return res
      .status(400)
      .json({ error: "Your account has reached the 50-schedule limit." });
  db.prepare(
    "INSERT INTO schedules VALUES (?,?,?,?) ON CONFLICT(id,userId) DO UPDATE SET data=excluded.data,updated=excluded.updated",
  ).run(
    req.params.id,
    req.user.id,
    JSON.stringify(req.body),
    new Date().toISOString(),
  );
  res.json({ ok: true });
});
app.delete("/api/schedules/:id", requireUser, (req, res) => {
  db.prepare("DELETE FROM schedules WHERE id=? AND userId=?").run(
    req.params.id,
    req.user.id,
  );
  res.json({ ok: true });
});
app.use("/api", (_, res) =>
  res.status(404).json({ error: "Endpoint not found." }),
);
app.use((error, req, res, next) => {
  console.error(error.message);
  res.status(error.status || 500).json({
    error:
      error.status === 413
        ? "Request is too large."
        : "The server could not complete this request.",
  });
});
app.listen(Number(process.env.API_PORT || 3001), "0.0.0.0", () =>
  console.log("Tarteeb API ready"),
);
