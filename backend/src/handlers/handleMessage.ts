import * as ws from "ws";
import regex from "../utils/regex";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type {
  AuthorizationEventPayload,
  ClientEvents,
  ConnectedUser,
  OnlineUser,
  Room,
  VerifyTokenEventPayload,
} from "../types/types";
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
import onlineUsersManager from "../models/ConnectedUsersManager";
import checkToken from "../utils/checkToken";
import ConnectedUsersManager from "../models/ConnectedUsersManager";

export const handleMessage = async (
  message: ClientEvents,
  ws: ws.WebSocket
) => {
  switch (message.event) {
    case "verifyToken":
      handleTokenVerificationEvent(ws, message.payload);
      break;
    case "authorization":
      handleAuthorizationEvent(ws, message.payload);
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

const handleTokenVerificationEvent = (
  ws: ws.WebSocket,
  payload: VerifyTokenEventPayload
) => {
  try {
    const decodedToken = decodeToken(payload.token);

    if (!decodedToken) {
      sendErrorMessage(ws, "EXPIRED_OR_MISSMATCHING");
      return;
    }

    authorizeUser(ws, decodedToken);
  } catch {
    sendErrorMessage(ws, "DATABASE_ERROR");
  }
};

const handleAuthorizationEvent = async (
  ws: ws.WebSocket,
  payload: AuthorizationEventPayload
) => {
  const isValid = validateUserData(payload);
  if (!isValid) {
    sendErrorMessage(ws, "VALIDATION_ERROR");
    return;
  }

  try {
    let user = await getUserByName(payload.name);
    if (!user) {
      user = await createUser(payload.name, payload.password);
    } else {
      const passwordMatch = await isPasswordMatch(
        user.password,
        payload.password
      );
      if (!passwordMatch) {
        sendErrorMessage(ws, "PASSWORD_MISMATCH_ERROR");
        return;
      }
    }

    authorizeUser(ws, user);
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
    const connectedUsers = onlineUsersManager.getConnectedUsers();

    for (const user of connectedUsers) {
      const subscribedRooms = await getSubscribedRooms(user.id);
      const isSubscribingToRoom = subscribedRooms.some(
        (subscribedRoom) => subscribedRoom.id === newMessage.roomId
      );

      if (isSubscribingToRoom) {
        user.ws.forEach((socket) =>
          socket.send(
            messageToJSON({
              event: "newMessage",
              payload: newMessage,
            })
          )
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
    if (!(await roomExists(message.id))) {
      sendErrorMessage(ws, "ROOM_DOESNT_EXIST");
      return;
    }

    if (await isSubscribing(message.id, decodedToken.id)) {
      sendErrorMessage(ws, "ALREADY_SUBSCRIBING");
      return;
    }

    await subscribeToRoom({ userId: decodedToken.id, roomId: message.id });

    const user = onlineUsersManager.getConnectedUser(decodedToken.id);
    if (!user) return;

    const room = await createRoom(message.id);

    user.ws.forEach((socket) =>
      socket.send(messageToJSON({ event: "addRoom", payload: room }))
    );
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
    if (!(await roomExists(message.id))) {
      sendErrorMessage(ws, "ROOM_DOESNT_EXIST");
      return;
    }

    if (!(await isSubscribing(message.id, decodedToken.id))) {
      sendErrorMessage(ws, "ALREADY_NOT_SUBSCRIBING");
      return;
    }

    await unsubscribeToRoom({ userId: decodedToken.id, roomId: message.id });

    const user = onlineUsersManager.getConnectedUser(decodedToken.id);
    if (!user) return;

    user.ws.forEach((socket) =>
      socket.send(
        messageToJSON({ event: "removeRoom", payload: { id: message.id } })
      )
    );
  } catch {
    sendErrorMessage(ws, "DATABASE_ERROR");
  }
};

const decodeToken = (token: string) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_KEY!);

    const isValid = checkToken(decodedToken);
    if (!isValid) {
      return null;
    }

    return { id: decodedToken.id, name: decodedToken.name };
  } catch (e: any) {
    return null;
  }
};

const authorizeUser = async (ws: ws.WebSocket, user: OnlineUser) => {
  const { id, name } = user;
  const connectedUsers = ConnectedUsersManager.addUserConnection({
    id,
    name,
    ws: [ws],
  });

  if (!connectedUsers) {
    sendErrorMessage(ws, "ALREADY_ESTABLISHED");
    return;
  }

  const token = generateToken(user);
  const rooms = await createRooms(id);
  const onlineUsers = ConnectedUsersManager.getOnlineUsers();

  ws.send(
    messageToJSON({
      event: "verifiedToken",
      payload: {
        rooms,
        onlineUsers,
        token,
        userId: user.id,
        username: user.name,
      },
    })
  );

  sendNewOnlineUser(connectedUsers, id);
};

const sendNewOnlineUser = (
  connectedUsers: readonly ConnectedUser[],
  userId: number
) => {
  const newUser = connectedUsers.find((u) => u.id === userId);

  for (const connectedUser of connectedUsers) {
    if (newUser !== undefined && connectedUser.id !== newUser.id) {
      connectedUser.ws.forEach((socket) =>
        socket.send(
          messageToJSON({
            event: "newOnlineUser",
            payload: newUser,
          })
        )
      );
    }
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

const roomExists = async (id: number) => {
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

const createRooms = async (userId: number) => {
  const rooms: Room[] = [];
  const subscribedRooms = await getSubscribedRooms(userId);
  const notSubscribedRooms = await getNotSubscribedRooms(userId);

  for (const room of subscribedRooms) {
    const messages = await getRoomMessages(room.id);
    rooms.push({
      ...room,
      messages,
    });
  }

  for (const room of notSubscribedRooms) {
    rooms.push({ ...room, messages: undefined });
  }

  return rooms;
};

const generateToken = (user: OnlineUser) => {
  return jwt.sign(user, process.env.JWT_TOKEN_KEY!, {
    expiresIn: "6h",
  });
};
