import express from "express";
import type { Request, Response, NextFunction } from "express";
import commonMiddleware from "./middlewares/common.middleware.js";
import routes from "./routes/index.routes.js";

const app = express();

// Middleware
commonMiddleware(app);


app.use("/", routes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
