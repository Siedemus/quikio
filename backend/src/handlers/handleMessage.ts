import * as ws from "ws";
import regex from "../utils/regex";
import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { ClientEvents, Room } from "../types/types";
import { messageToJSON } from "../utils/messageToJSON";
import { sendErrorMessage } from "../utils/sendErrorMessage";
import {
  createUser,
  getOnlineUsers,
  getRoomMessages,
  getUserByUsername,
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
      if (!validateUserData(message.payload)) {
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
  inputUser: { username: string; password: string }
) => {
  let user;
  try {
    user = await getUserByUsername(inputUser.username);
    if (user) {
      if (!isPasswordMatch(user.password, inputUser.password)) {
        sendErrorMessage(ws, "PASSWORD_MISMATCH_ERROR");
        return;
      }
    } else {
      user = await createUser(inputUser.username, inputUser.password);
    }

    const token = generateToken(user.name, user.id);
    const rooms = await createRooms(user);
    const onlineUsers = await getOnlineUsers();

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
    roomId: number;
  }
) => {
  const decoded = decodeToken(message.token);

  if (decoded) {
    try {
      const NewMessageEvent = await pushMessage({
        userId: decoded.id,
        roomId: message.roomId,
        content: message.content,
      });

      for (const onlineWebSocket of onlineWebSockets) {
        const subscribedRooms = await getSubscribedRooms(onlineWebSocket.id);

        if (
          subscribedRooms.some(
            (subscribedRoom) => subscribedRoom.roomId === NewMessageEvent.roomId
          )
        ) {
          onlineWebSocket.ws.send(
            messageToJSON({
              event: "NewMessageEvent",
              payload: NewMessageEvent,
            })
          );
        }
      }
    } catch {
      sendErrorMessage(ws, "DATABASE_ERROR");
    }
  } else {
    sendErrorMessage(ws, "EXPIRED_TOKEN");
  }
};

const validateUserData = (user: { password: string; username: string }) => {
  const trimmedPassword = user.password.trim();
  const trimmedUsername = user.username.trim();

  return (
    regex.usernameRegex.test(trimmedUsername) &&
    regex.passwordRegex.test(trimmedPassword)
  );
};

const isPasswordMatch = async (
  storedPassword: string,
  inputPassword: string
) => {
  return bcrypt.compare(inputPassword, storedPassword);
};

const generateToken = (username: string, id: number) => {
  return jwt.sign({ username, id }, process.env.JWT_TOKEN_KEY!, {
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
    const messages = await getRoomMessages(subscribedRoom.roomId);
    rooms.push({
      name: subscribedRoom.name,
      roomId: subscribedRoom.roomId,
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
    return { id: decoded.id, username: decoded.username };
  } catch {
    return null;
  }
};
