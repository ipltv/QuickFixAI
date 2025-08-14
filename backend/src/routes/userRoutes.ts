import { Router } from 'express';
import { userController } from '../controllers/userController.js';
// import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth.js'; // Your middleware

const router = Router();

// Public route for creation (registration)
router.post('/', userController.createUser);

// Protected routes
// router.use(authMiddleware); // Apply middleware to all subsequent routes

router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', /* adminOnlyMiddleware, */ userController.deleteUser);

export default router;