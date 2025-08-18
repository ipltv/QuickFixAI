import { Router } from "express";
import { equipmentController } from "../controllers/equipment.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/rbac.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();
const resource = "equipment";

// All routes require authentication and permission checks.
router.use(authMiddleware, checkPermission(resource));

// Define CRUD routes for equipment
router.post("/", catchAsync(equipmentController.createEquipment));
router.get("/", catchAsync(equipmentController.getEquipment));
router.get("/:id", catchAsync(equipmentController.getEquipmentById));
router.put("/:id", catchAsync(equipmentController.updateEquipment));
router.delete("/:id", catchAsync(equipmentController.deleteEquipment));

export default router;
