import * as ws from "ws";
import regex from "../utils/regex";
import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { ClientEvents, OnlineUserSocket, Room } from "../types/types";
import { messageToJSON } from "../utils/messageToJSON";
import { sendErrorMessage } from "../utils/sendErrorMessage";
import {
  createUser,
  getRoomMessages,
  getUserByName,
  getSubscribedRooms,
  getNotSubscribedRooms,
  pushMessage,
  getRooms,
  subscribeToRoom,
  unsubscribeToRoom,
} from "../db/querries";
import onlineUsersManager from "../models/onlineUsersManager";

export const handleMessage = async (
  message: ClientEvents,
  ws: ws.WebSocket
) => {
  switch (message.event) {
    case "verifyToken":
      handleTokenVerification(ws, message.payload);
      break;
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
    case "subscribeRoom":
      handleRoomSubscription(ws, message.payload);
      break;
    case "unsubscribeRoom":
      handleRoomUnsubscription(ws, message.payload);
      break;

    default:
      sendErrorMessage(ws, "WRONG_MESSAGE_EVENT_ERROR");
  }
};

const handleTokenVerification = (
  ws: ws.WebSocket,
  message: { token: string; userId: number; username: string }
) => {
  const decodedToken = decodeToken(message.token);
  const usernameMatch = decodedToken?.name === message.username;
  const userIdMatch = decodedToken?.id === message.userId;

  if (!decodedToken || !usernameMatch || !userIdMatch) {
    sendErrorMessage(ws, "EXPIRED_OR_MISSMATCHING");
    return;
  }

  ws.send(messageToJSON({ event: "verifiedToken" }));
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
    onlineUsersManager.addUser({ id: user.id, name: user.name, ws });
    const onlineUsers = onlineUsersManager.getUsers();
    const formattedOnlineUsers = onlineUsers.map(({ id, name }) => ({
      id,
      name,
    }));

    ws.send(
      messageToJSON({
        event: "authorized",
        payload: {
          token,
          rooms,
          onlineUsers: formattedOnlineUsers,
          userId: user.id,
          username: user.name,
        },
      })
    );

    sendNewOnlineUser(onlineUsers, user.id);
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
    name: string;
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
      username: message.name,
    });
    const onlineUsers = onlineUsersManager.getUsers();

    for (const user of onlineUsers) {
      const subscribedRooms = await getSubscribedRooms(user.id);
      const isSubscribingToRoom = subscribedRooms.some(
        (subscribedRoom) => subscribedRoom.id === newMessage.roomId
      );

      if (isSubscribingToRoom) {
        user.ws.send(
          messageToJSON({
            event: "newMessage",
            payload: newMessage,
          })
        );
      }
    }
  } catch {
    sendErrorMessage(ws, "DATABASE_ERROR");
  }
};

const handleRoomSubscription = async (
  ws: ws.WebSocket,
  message: { token: string; id: number }
) => {
  const decodedToken = decodeToken(message.token);

  if (!decodedToken) {
    sendErrorMessage(ws, "EXPIRED_TOKEN");
    return;
  }

  try {
    if (!(await roomExists(message.id, ws))) {
      sendErrorMessage(ws, "ROOM_DOESNT_EXIST");
      return;
    }

    if (await isSubscribing(message.id, decodedToken.id)) {
      sendErrorMessage(ws, "ALREADY_SUBSCRIBING");
      return;
    }

    await subscribeToRoom({ userId: decodedToken.id, roomId: message.id });

    const user = onlineUsersManager.getUser(decodedToken.id);
    if (!user) return;

    const room = await createRoom(message.id);

    user.ws.send(messageToJSON({ event: "addRoom", payload: room }));
  } catch {
    sendErrorMessage(ws, "DATABASE_ERROR");
  }
};

const handleRoomUnsubscription = async (
  ws: ws.WebSocket,
  message: { token: string; id: number }
) => {
  const decodedToken = decodeToken(message.token);

  if (!decodedToken) {
    sendErrorMessage(ws, "EXPIRED_TOKEN");
    return;
  }

  try {
    if (!(await roomExists(message.id, ws))) {
      sendErrorMessage(ws, "ROOM_DOESNT_EXIST");
      return;
    }

    if (!(await isSubscribing(message.id, decodedToken.id))) {
      sendErrorMessage(ws, "ALREADY_NOT_SUBSCRIBING");
      return;
    }

    await unsubscribeToRoom({ userId: decodedToken.id, roomId: message.id });

    const user = onlineUsersManager.getUser(decodedToken.id);
    if (!user) return;

    user.ws.send(
      messageToJSON({ event: "removeRoom", payload: { id: message.id } })
    );
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

  for (const room of subscribedRooms) {
    const messages = await getRoomMessages(room.id);
    rooms.push({
      name: room.name,
      id: room.id,
      messages,
    });
  }

  for (const room of notSubscribedRooms) {
    rooms.push(room);
  }

  return rooms;
};

const sendNewOnlineUser = (onlineUsers: OnlineUserSocket[], userId: number) => {
  const newUser = onlineUsers.find((user) => user.id === userId);
  for (const onlineUser of onlineUsers) {
    if (newUser !== undefined && onlineUser.id !== newUser.id) {
      onlineUser.ws.send(
        messageToJSON({
          event: "newOnlineUser",
          payload: { id: newUser.id, name: newUser.name },
        })
      );
    }
  }
};

const decodeToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY!) as JwtPayload;
    return { id: decoded.id, name: decoded.name };
  } catch {
    return null;
  }
};

const roomExists = async (id: number, ws: ws.WebSocket) => {
  const rooms = await getRooms();
  return rooms.some((room) => room.id === id);
};

const isSubscribing = async (roomId: number, userId: number) => {
  const userSubscribitons = await getSubscribedRooms(userId);
  return userSubscribitons.some((subscribiton) => subscribiton.id === roomId);
};

const createRoom = async (roomId: number) => {
  const { id, name } = (await getRooms()).find((room) => room.id === roomId)!;
  const messages = await getRoomMessages(id);
  return {
    id,
    name,
    messages,
  };
};
