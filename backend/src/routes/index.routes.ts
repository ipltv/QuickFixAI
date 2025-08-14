// backend/src/routes/index.ts
// This file sets up the main router for the backend, integrating all route modules.
import express from 'express';
import userRoutes from './users.routes.js';
import authenticationRoutes from './authentication.routes.js';

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/api/auth', authenticationRoutes);

export default router;
