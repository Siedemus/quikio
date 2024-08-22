import * as https from "https";
import * as ws from "ws";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "bun";
import { handleMessage } from "./handlers/handleMessage";
import { JSONToMessage } from "./utils/JSONToMessage";
import { sendErrorMessage } from "./utils/sendErrorMessage";
import onlineUsersManager from "./models/onlineUsersManager";

const PORT = process.env.PORT || 8080;

const __dirname = fileURLToPath(path.dirname(import.meta.url));
const serverOptions = {
  cert: fs.readFileSync(path.join(__dirname, "/../certs/server.crt")),
  key: fs.readFileSync(path.join(__dirname, "/../certs/key.pem")),
};

const server = https.createServer(serverOptions);
const wss = new ws.WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  if (req.headers.upgrade !== "websocket") {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n"), socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
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

    ws.on("close", (ws) => {
      onlineUsersManager.removeUser(ws);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
