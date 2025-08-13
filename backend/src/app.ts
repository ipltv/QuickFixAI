import express from "express";
import type { Request, Response, NextFunction } from "express";
import pool from "./db/db.js";
import commonMiddleware from "./middlewares/commonMiddleware.js";
import {
  FRONTEND_URL,
  PORT,
  NODE_ENV,
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  DATABASE_URL,
} from "./config/env.js"; // Import environment variables

const app = express();

// Middleware
commonMiddleware(app);

app.get("/api", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`Welcome to QuickFixAI. DB time is: ${result.rows[0].now}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database error");
  }
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
