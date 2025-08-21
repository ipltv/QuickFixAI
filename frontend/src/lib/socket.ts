import { io } from "socket.io-client";
import { API_URL } from "../../src/config/env.ts";

// Create and export the socket instance.
// The 'autoConnect: false' option prevents it from connecting immediately.
// Connect manually when the app initializes.
export const socket = io(API_URL, {
  autoConnect: false,
});
