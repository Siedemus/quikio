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
  roomId: number;
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
  username: string;
};

export type AuthorizationMessage = {
  event: "authorization";
  payload: {
    username: string;
    password: string;
  };
};

export type AuthorizedMessage = {
  event: "authorized";
  payload: {
    token: string;
    rooms: Room[];
    onlineUsers: OnlineUser[];
  };
};

export type ErrorMessage = {
  event: "error";
  payload: {
    code: number;
    content: string;
  };
};

export type BaseMessage = {
  event: "base";
  payload: {
    content: string;
    roomId: number;
    token: string;
  };
};

export type NewMessage = {
  event: "newMessage";
  payload: {
    userId: number;
    roomId: number;
    content: string;
  };
};

export type ClientMessages = AuthorizationMessage | BaseMessage;

export type ServerMessages = ErrorMessage | AuthorizedMessage | NewMessage;
export interface DecodedToken extends JwtPayload {
  id: string;
  username: string;
}
