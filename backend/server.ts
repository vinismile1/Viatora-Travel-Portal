import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import apiRouter from './routes/index.js';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json());

// Mount the unified API router
app.use('/api', apiRouter);

// ---------------- VITE DEV SERVER & PRODUCTION HANDLING ----------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Development Mode with Vite Middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware mounted successfully.");
  } else {
    // Production Mode serving static compiled files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving production build from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Viatora Server is live on http://localhost:${PORT}`);
  });
}

startServer();