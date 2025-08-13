import type { Express } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { FRONTEND_URL } from "../config/env.js"; // Import environment variables

export function commonMiddleware(app: Express): void {
  // Enable compression
  app.use(compression());
  // Enable CORS
  const allowedOrigins = [
    FRONTEND_URL,
    "http://frontend",
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
  ];
  const corsOptions = {
    origin: allowedOrigins,
  };
  app.use(cors(corsOptions));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 request per IP in 15 minutes
    standardHeaders: true, // Turn on standart header `RateLimit-*`
    legacyHeaders: false, // Turn off legacy header `X-RateLimit-*`
    message: "Too many requests, please try again later.",
  });
  app.use(limiter);

  // Use Helmet for security
  app.use(helmet());

  // Use Morgan for logging
  app.use(morgan("combined"));

  // Parse JSON bodies
  app.use(express.json());

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true }));
}

export default commonMiddleware;
