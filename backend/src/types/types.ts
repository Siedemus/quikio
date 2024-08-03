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
