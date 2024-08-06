import type { JwtPayload } from "jsonwebtoken";
import * as ws from "ws";

export type Message = {
  id: number;
  content: string;
  createdAt: Date;
  roomId: number;
  userId: number;
};

export type Room = {
  name: string;
  id: number;
  messages?: {
    id: number;
    userId: number;
    roomId: number;
    content: string;
    createdAt: Date;
  }[];
};

export type OnlineUser = {
  id: number;
  name: string;
};

export type OnlineUserSocket = OnlineUser & {
  ws: ws.WebSocket;
};

export type AuthorizationEvent = {
  event: "authorization";
  payload: {
    name: string;
    password: string;
  };
};

export type AuthorizedEvent = {
  event: "authorized";
  payload: {
    token: string;
    rooms: Room[];
    onlineUsers: OnlineUser[];
  };
};

export type ErrorEvent = {
  event: "error";
  payload: {
    code: number;
    content: string;
  };
};

export type BaseMessageEvent = {
  event: "base";
  payload: {
    content: string;
    id: number;
    token: string;
  };
};

export type NewMessageEvent = {
  event: "NewMessageEvent";
  payload: {
    userId: number;
    roomId: number;
    content: string;
  };
};

export type NewOnlineUserEvent = {
  event: "newOnlineUser";
  payload: {
    id: number;
    name: string;
  };
};

export type SubscribeRoomEvent = {
  event: "subscribeRoom";
  payload: {
    token: string;
    id: number;
  };
};

export type UnsubscribeRoomEvent = {
  event: "unsubscribeRoom";
  payload: {
    token: string;
    id: number;
  };
};

export type addRoomEvent = {
  event: "addRoom";
  payload: {
    room: Room;
  };
};

export type RemoveRoomEvent = {
  event: "removeEvent";
  payload: {
    id: number;
  };
};

export type ClientEvents =
  | AuthorizationEvent
  | BaseMessageEvent
  | SubscribeRoomEvent
  | UnsubscribeRoomEvent;

export type ServerEvents =
  | ErrorEvent
  | AuthorizedEvent
  | NewMessageEvent
  | NewOnlineUserEvent
  | addRoomEvent
  | RemoveRoomEvent;
export interface DecodedToken extends JwtPayload {
  id: string;
  name: string;
}
