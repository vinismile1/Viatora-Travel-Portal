import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./routes/index.js";

dotenv.config();

const app = express();

// ============================================================
// CORS CONFIGURATION
// ============================================================

const allowedOrigins = [
  "http://localhost:5173",
  "https://viatora-travel-portal.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin
      // e.g. Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`CORS blocked for origin: ${origin}`)
      );
    },
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ============================================================
// MIDDLEWARE
// ============================================================

app.use(express.json());

// ============================================================
// API ROUTES
// ============================================================

app.use("/api", apiRouter);

// ============================================================
// HEALTH CHECK
// ============================================================

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Viatora Backend API is running",
  });
});

// ============================================================
// SERVER
// ============================================================

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Viatora Backend running on port ${PORT}`
  );
});