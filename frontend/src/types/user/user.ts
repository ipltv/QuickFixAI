import type { Role } from "../misc/roles.js";

// Define the User type with required fields
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  clientId: string;
}
