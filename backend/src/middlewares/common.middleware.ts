import type { Express } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { FRONTEND_URL } from "../config/env.js"; // Import environment variables

/**
 * Configures and applies a set of common Express.js middleware.
 * This function provides security, logging, compression, rate-limiting,
 * and body parsing for an Express application.
 *
 * @param {Express} app - The Express application instance to apply the
 * middleware to.
 * @returns {void}
 *
 * @description
 * 1.  **Compression (compression):** Enables Gzip compression for all
 * responses, reducing their size and speeding up data transfer.
 * 2.  **CORS (cors):** Enables Cross-Origin Resource Sharing. It is
 * configured to allow requests only from a predefined list of
 * origins for enhanced security.
 * 3.  **Rate Limiting (rateLimit):** Limits requests to 100 per 15
 * minutes from a single IP address, protecting against brute-force
 * attacks.
 * 4.  **Helmet (helmet):** Sets various HTTP headers to improve security,
 * helping to prevent common vulnerabilities like XSS.
 * 5.  **Morgan (morgan):** An HTTP request logger middleware using the
 * "combined" format for monitoring and debugging.
 * 6.  **Parsers (express.json, express.urlencoded):** Parses incoming
 * JSON and URL-encoded request bodies.
 * 7.  **Cookie Parser (cookieParser):** Parses cookies attached to the
 * request object, making them accessible in the middleware and routes.
 */

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

  // Use cookie parser
  app.use(cookieParser());
}

export default commonMiddleware;
