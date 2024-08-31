import * as http from "http";
import * as ws from "ws";
import { handleMessage } from "./handlers/handleMessage";
import { JSONToMessage } from "./utils/JSONToMessage";
import { sendErrorMessage } from "./utils/sendErrorMessage";
import onlineUsersManager from "./models/onlineUsersManager";

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer();
const wss = new ws.WebSocketServer({ server });

wss.on("connection", (ws) => {
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
