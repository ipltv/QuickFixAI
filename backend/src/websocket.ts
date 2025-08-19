import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { allowedOrigins } from "./middlewares/common.middleware.js";

export const initWebSocket = (server: HTTPServer) => {
  // Create the Socket.IO server and attach it to the HTTP server
  const io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  // --- WebSocket Logic ---
  io.on("connection", (socket) => {
    console.log("A user connected via WebSocket:", socket.id);

    // When a user opens a ticket, they should join a "room" for that ticket
    socket.on("joinTicketRoom", (ticketId) => {
      socket.join(ticketId);
      console.log(`Socket ${socket.id} joined room for ticket ${ticketId}`);
    });

    socket.on("leaveTicketRoom", (ticketId) => {
      socket.leave(ticketId);
      console.log(`Socket ${socket.id} left room for ticket ${ticketId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
  // --- End WebSocket Logic ---
  console.log("WebSocket server initialized");
  return io;
};
