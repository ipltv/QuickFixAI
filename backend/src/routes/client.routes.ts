// backend/src/routes/client.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { clientController } from "../controllers/client.controller.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

router.get("/", catchAsync(clientController.getAllClients));
router.post("/", catchAsync(clientController.createClient));
router.get("/profile", catchAsync(clientController.getProfile));
router.put("/:id", catchAsync(clientController.updateClient));
router.delete("/:id", catchAsync(clientController.deleteClient));

export default router;
