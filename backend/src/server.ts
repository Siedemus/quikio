import * as http from "http";
import * as ws from "ws";
import { handleMessage } from "./handlers/handleMessage";
import { JSONToMessage } from "./utils/JSONToMessage";
import { sendErrorMessage } from "./utils/sendErrorMessage";
import onlineUsersManager from "./models/onlineUsersManager";

const PORT = Number(process.env.PORT) || 10000;
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running");
});
const wss = new ws.WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket connection established");

  ws.on("message", (data) => {
    try {
      const message = JSONToMessage(data.toString());
      handleMessage(message, ws);
    } catch {
      sendErrorMessage(ws, "PARSING_ERROR");
    }
  });

  ws.on("error", () => {
    onlineUsersManager.removeUser(ws);
  });

  ws.on("close", () => {
    onlineUsersManager.removeUser(ws);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server is listening on port ${PORT} and host ${HOST}`);
});
