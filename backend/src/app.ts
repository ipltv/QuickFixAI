import express from "express";
import commonMiddleware from "./middlewares/common.middleware.js";
import routes from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

const app = express();

// Apply common middleware
commonMiddleware(app);

// Register all application routes
app.use("/", routes);

// Register custom error handler.
app.use(errorHandler);

export default app;
