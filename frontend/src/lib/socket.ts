import { io } from "socket.io-client";
import { WS_URL } from "../../src/config/env.ts";

// Create and export the socket instance.
// The 'autoConnect: false' option prevents it from connecting immediately.
// Connect manually when the app initializes.
export const socket = io(WS_URL, {
  autoConnect: false,
});
