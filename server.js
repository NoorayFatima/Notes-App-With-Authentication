require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const notesRoutes = require("./routes/notes");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middleware ----
// The React frontend runs on a different port (Vite's dev server, usually
// 5173) than this API (3000). Browsers block cross-origin requests by
// default, so cors() adds the headers that allow the frontend to fetch
// from this API during local development.
app.use(cors());

// express.json() reads incoming JSON in the request body (e.g. from
// POST/PUT requests) and makes it available as req.body.
// Without this line, req.body would be undefined!
app.use(express.json());

// A tiny custom logging middleware — good to understand how middleware works.
// Every request passes through this before reaching a route handler.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next(); // MUST call next() or the request will hang forever
});

// ---- Root route (just to confirm the server is alive) ----
app.get("/", (req, res) => {
  res.status(200).json({
    message: "📝 Notes API is running!",
    endpoints: {
      "POST /api/auth/register": "Create an account (body: { username, email, password })",
      "POST /api/auth/login": "Log in (body: { email, password })",
      "GET /api/auth/me": "Get the logged-in user (requires Bearer token)",
      "GET /api/notes": "Get all of the logged-in user's notes (requires Bearer token)",
      "GET /api/notes/:id": "Get a single note (requires Bearer token)",
      "POST /api/notes": "Create a new note (requires Bearer token, body: { title, content })",
      "PUT /api/notes/:id": "Update a note (requires Bearer token, body: { title?, content? })",
      "DELETE /api/notes/:id": "Delete a note (requires Bearer token)",
    },
  });
});

// ---- Mount our routes ----
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

// ---- 404 handler ----
// Runs only if no route above matched the request.
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ---- Global error handler ----
// Catches errors thrown/passed to next(err) anywhere in the app.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong on the server" });
});

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
