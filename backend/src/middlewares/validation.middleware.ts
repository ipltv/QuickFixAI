import type { Request, Response, NextFunction } from "express";
import { type ZodObject, ZodError } from "zod";
import { BadRequestError } from "../utils/errors.js";

export const validate =
  (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues
          .map((e) => `${e.path.join(".")} ${e.message}`)
          .join(", ");
        throw new BadRequestError(`Validation failed: ${errorMessages}`);
      }
      next(error);
    }
  };
