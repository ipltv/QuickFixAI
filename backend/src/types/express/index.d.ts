import type { JwtPayload } from 'jsonwebtoken';
import type { Request, Response } from 'express';

// Augment the Express Request type
declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload;
    }
  }
}