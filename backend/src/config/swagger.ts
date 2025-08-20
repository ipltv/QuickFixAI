import swaggerJsdoc from "swagger-jsdoc";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { registry } from "../schemas/index.js";

// Generate the OpenAPI components (schemas) from the Zod registry
const generator = new OpenApiGeneratorV3(registry.definitions);
const components = generator.generateComponents();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "QuickFixAI API Documentation",
      version: "1.0.0",
      description: "API documentation for the QuickFixAI application.",
    },
    servers: [
      {
        url: "http://localhost:3001/api",
      },
    ],
    // Use the components generated from Zod schemas
    components,
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["../routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
