import * as ws from "ws";
import { messageToJSON } from "./messageToJSON";
import { errorCodes } from "../resources/errorCodes";

export const sendErrorMessage = (
  ws: ws.WebSocket,
  errorCode: keyof typeof errorCodes
) => {
  const { code, content } = errorCodes[errorCode];
  ws.send(
    messageToJSON({
      event: "error",
      payload: { code, content },
    })
  );
};
