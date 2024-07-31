export type Message = {
  id: number;
  content: string;
  createdAt: Date;
  roomId: number;
  userId: number;
};

export type RoomBase = {
  id: number;
  name: string;
};

export type SubscribedRoom = RoomBase & {
  subscribed: true;
  messageHistory: Message[];
};

export type UnsubscribedRoom = RoomBase & {
  subscribed: false;
};

export type Room = SubscribedRoom | UnsubscribedRoom;

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
