import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

export function commonMiddleware(app: Express): void {
  // Enable CORS
  const allowedOrigins = [
    "http://frontend",
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173",
  ];
  const corsOptions = {
    origin: allowedOrigins,
  };
  app.use(cors(corsOptions));

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
