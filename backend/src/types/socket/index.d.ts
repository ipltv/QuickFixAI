import type { JwtPayload } from "../auth/jwt.js";

declare module "socket.io" {
  interface SocketData {
    user: JwtPayload;
  }
}
