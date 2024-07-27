import * as https from "https";
import * as ws from "ws";
import * as fs from "fs";

const PORT = process.env.PORT || 8080;

const serverOptions = {
  cert: fs.readFileSync("/../server.crt"),
  key: fs.readFileSync("/../key.pem"),
};

const server = https.createServer(serverOptions);

const wss = new ws.WebSocketServer({ noServer: true });

server.on("upgrade", (req, socket, head) => {
  if (req.headers.upgrade !== "websocket") {
    socket.write("HTTP/1.1 400 Bad Request\r\n\r\n"), socket.destroy();
    return;
  }

  wss.handleUpgrade(req, socket, head, (ws) => {
    
  });
});

server.listen(PORT, () => {
  console.log("Server is listening on port 8080");
});
