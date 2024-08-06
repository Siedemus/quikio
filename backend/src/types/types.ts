import type { JwtPayload } from "jsonwebtoken";

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

export type ClientEvents = AuthorizationEvent | BaseMessageEvent;

export type ServerEvents = ErrorEvent | AuthorizedEvent | NewMessageEvent;
export interface DecodedToken extends JwtPayload {
  id: string;
  name: string;
}
