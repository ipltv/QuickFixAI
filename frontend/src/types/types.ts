// frontend/src/types/types.ts
// This file defines the types used throughout the application, including user roles and authentication credentials.

// Define the possible user roles in the application
export type Role = "system_admin" | "client_admin" | "support" | "staff";
// Define the User type with required fields
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  clientId: string;
}

// Define the type for login credentials
export type LoginCredentials = { email: string; password: string };
