// backend/src/routes/client.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { clientController } from "../controllers/client.controller.js";

const router = Router();

// Apply authentication middleware to all routes in this router
router.use(authMiddleware);

router.get("/", clientController.getAllClients);
router.post("/", clientController.createClient); 
router.get("/profile", clientController.getProfile);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);

export default router;