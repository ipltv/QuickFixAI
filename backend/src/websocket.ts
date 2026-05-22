import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { z } from "zod";
import { allowedOrigins } from "./middlewares/common.middleware.js";
import { verifyAccessToken } from "./utils/verifyAccessToken.js";
import { userCanAccessTicket } from "./utils/ticketAccess.js";

const ticketIdSchema = z.uuid();

export const initWebSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const rawToken = socket.handshake.auth?.token;
    if (typeof rawToken !== "string" || !rawToken) {
      return next(new Error("Unauthorized: No token provided"));
    }
    try {
      socket.data.user = verifyAccessToken(rawToken);
      next();
    } catch {
      return next(new Error("Unauthorized: Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      "WebSocket connected:",
      socket.id,
      "user:",
      socket.data.user.userId
    );

    socket.on("joinTicketRoom", async (ticketId: unknown, ack?: (result: { ok: boolean; error?: string }) => void) => {
      const parsed = ticketIdSchema.safeParse(ticketId);
      if (!parsed.success) {
        ack?.({ ok: false, error: "Invalid ticket ID" });
        return;
      }

      const allowed = await userCanAccessTicket(
        socket.data.user,
        parsed.data
      );
      if (!allowed) {
        ack?.({ ok: false, error: "Forbidden" });
        return;
      }

      await socket.join(parsed.data);
      console.log(
        `Socket ${socket.id} joined room for ticket ${parsed.data}`
      );
      ack?.({ ok: true });
    });

    socket.on("leaveTicketRoom", (ticketId: unknown) => {
      const parsed = ticketIdSchema.safeParse(ticketId);
      if (!parsed.success) {
        return;
      }
      void socket.leave(parsed.data);
      console.log(
        `Socket ${socket.id} left room for ticket ${parsed.data}`
      );
    });

    socket.on("disconnect", () => {
      console.log("WebSocket disconnected:", socket.id);
    });
  });

  console.log("WebSocket server initialized");
  return io;
};
