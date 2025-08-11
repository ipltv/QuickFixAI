import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import pool from "./db/db.js";


const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:80";
const allowedOrigins = [
  "http://frontend",
  "http://localhost",
  "http://localhost:80",
  "http://localhost:5173",
];

const corsOptions = {
  origin: allowedOrigins,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
