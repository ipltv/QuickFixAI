import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { catchAsync } from "../utils/catchAsync.js";

const router = Router();

// Protected routes
router.use(authMiddleware);

router.post("/", catchAsync(userController.createUser));
router.get("/me", catchAsync(userController.getMeProfile));
router.get("/:id", catchAsync(userController.getUserById));
router.put("/:id", catchAsync(userController.updateUser));
router.delete("/:id", catchAsync(userController.deleteUser));

export default router;
