import http from "http";
import app from "./app.js";
import { initWebSocket } from "./websocket.js";
import { PORT } from "./config/env.js";

const server = http.createServer(app);
export const io = initWebSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
