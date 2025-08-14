import express from "express";
import type { Request, Response, NextFunction } from "express";
import db from "./db/db.js";
import commonMiddleware from "./middlewares/common.middleware.js";
import routes from "./routes/index.routes.js";

const app = express();

// Middleware
commonMiddleware(app);

app.get("/api", async (req, res) => {
  try {
    const result = await db.raw("SELECT NOW()");
    res.send(`Welcome to QuickFixAI. DB time is: ${result.rows[0].now}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database error");
  }
});

app.use("/", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
