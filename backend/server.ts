import express from "express";
import dotenv from "dotenv";
import apiRouter from "./routes/index.js";
import cors from "cors";

dotenv.config();

const app = express();

// // Middleware
// app.use(express.json());

// // API routes
// app.use("/api", apiRouter);


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://viatora-travel-portal.vercel.app/"
  ],
  credentials: true
}));

app.use(express.json());

app.use("/api", apiRouter);


// Health check
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Viatora Backend API is running",
  });
});

// Use hosting-provided PORT
const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Viatora Backend running on port ${PORT}`);
});