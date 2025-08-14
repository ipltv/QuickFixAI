// backend/src/routes/index.ts
// This file sets up the main router for the backend, integrating all route modules.
import express from 'express';
import userRoutes from './userRoutes.js';

const router = express.Router();

router.use('/api/users', userRoutes);

export default router;
