export interface User {
  id: string;
  email: string;
  name: string;
  role: "staff" | "support" | "client_admin" | "system_admin";
  clientId: string;
}
