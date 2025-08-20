import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "QuickFixAI API Documentation",
      version: "1.0.0",
      description:
        "API documentation for the QuickFixAI application, an AI-powered support assistant for quick-service restaurants.",
    },
    servers: [
      {
        url: "http://localhost:3001/api",
      },
    ],
    // Add a security scheme for JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/types/*.ts"], 
};

export const swaggerSpec = swaggerJsdoc(options);
