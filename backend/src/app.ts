import express from "express";
import cors from "cors";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// CORS configuration
const corsOptions = {
  origin: FRONTEND_URL, // Adjust this to your frontend URL
};

// Middleware
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to QuickFixAI");
});

export default app;
