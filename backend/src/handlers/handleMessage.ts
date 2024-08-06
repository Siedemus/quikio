import * as ws from "ws";
import regex from "../utils/regex";
import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { ClientEvents, Room } from "../types/types";
import { messageToJSON } from "../utils/messageToJSON";
import { sendErrorMessage } from "../utils/sendErrorMessage";
import {
  createUser,
  getRoomMessages,
  getUserByName,
  getSubscribedRooms,
  getNotSubscribedRooms,
  pushMessage,
} from "../db/querries";

const onlineWebSockets: { id: number; name: string; ws: ws.WebSocket }[] = [];

export const handleMessage = async (
  message: ClientEvents,
  ws: ws.WebSocket
) => {
  switch (message.event) {
    case "authorization":
      const isValid = validateUserData(message.payload);
      if (!isValid) {
        sendErrorMessage(ws, "VALIDATION_ERROR");
        break;
      }

      handleAuthorization(ws, message.payload);
      break;
    case "base":
      handleBaseMessageEvent(ws, message.payload);
      break;
    default:
      sendErrorMessage(ws, "WRONG_MESSAGE_EVENT_ERROR");
  }
};

const handleAuthorization = async (
  ws: ws.WebSocket,
  inputUser: { name: string; password: string }
) => {
  try {
    let user = await getUserByName(inputUser.name);
    if (user) {
      const passwordMatch = isPasswordMatch(user.password, inputUser.password);
      if (!passwordMatch) {
        sendErrorMessage(ws, "PASSWORD_MISMATCH_ERROR");
        return;
      }
    } else {
      user = await createUser(inputUser.name, inputUser.password);
    }

    const token = generateToken(user.name, user.id);
    const rooms = await createRooms(user);
    const onlineUsers = []!;

    ws.send(
      messageToJSON({
        event: "authorized",
        payload: { token, rooms, onlineUsers },
      })
    );
    onlineWebSockets.push({ id: user.id, name: user.name, ws: ws });
  } catch {
    sendErrorMessage(ws, "DATABASE_ERROR");
  }
};

const handleBaseMessageEvent = async (
  ws: ws.WebSocket,
  message: {
    content: string;
    token: string;
    id: number;
  }
) => {
  const decodedToken = decodeToken(message.token);

  if (!decodedToken) {
    sendErrorMessage(ws, "EXPIRED_TOKEN");
    return;
  }

  try {
    const newMessage = await pushMessage({
      userId: decodedToken.id,
      roomId: message.id,
      content: message.content,
    });

    for (const onlineWebSocket of onlineWebSockets) {
      const subscribedRooms = await getSubscribedRooms(onlineWebSocket.id);
      const isSubscribingToRoom = subscribedRooms.some(
        (subscribedRoom) => subscribedRoom.id === newMessage.roomId
      );

      if (isSubscribingToRoom) {
        onlineWebSocket.ws.send(
          messageToJSON({
            event: "NewMessageEvent",
            payload: newMessage,
          })
        );
      }
    }
  } catch {
    sendErrorMessage(ws, "DATABASE_ERROR");
  }
};

const validateUserData = (user: { password: string; name: string }) => {
  const trimmedPassword = user.password.trim();
  const trimmedName = user.name.trim();

  return (
    regex.usernameRegex.test(trimmedName) &&
    regex.passwordRegex.test(trimmedPassword)
  );
};

const isPasswordMatch = async (
  storedPassword: string,
  inputPassword: string
) => {
  return await bcrypt.compare(inputPassword, storedPassword);
};

const generateToken = (name: string, id: number) => {
  return jwt.sign({ name, id }, process.env.JWT_TOKEN_KEY!, {
    expiresIn: "6h",
  });
};

const createRooms = async (user: {
  id: number;
  name: string;
  password: string;
}) => {
  const rooms: Room[] = [];
  const subscribedRooms = await getSubscribedRooms(user.id);
  const notSubscribedRooms = await getNotSubscribedRooms(user.id);

  for (const subscribedRoom of subscribedRooms) {
    const messages = await getRoomMessages(subscribedRoom.id);
    rooms.push({
      name: subscribedRoom.name,
      id: subscribedRoom.id,
      messages,
    });
  }

  for (const notSubscribedRoom of notSubscribedRooms) {
    rooms.push(notSubscribedRoom);
  }

  return rooms;
};

const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY!) as JwtPayload;
    return { id: decoded.id, name: decoded.name };
  } catch {
    return null;
  }
};
