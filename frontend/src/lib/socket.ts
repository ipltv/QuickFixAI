import { io } from "socket.io-client";
import { WS_URL } from "../../src/config/env.ts";

// Create and export the socket instance.
// autoConnect: false — connect from MainLayout after setting auth.token.
export const socket = io(WS_URL, {
  autoConnect: false,
});

/** Sets the access JWT used during the Socket.IO handshake. */
export function setSocketAuthToken(token: string): void {
  socket.auth = { token };
}
