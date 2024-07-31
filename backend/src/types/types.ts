type Message = {
  id: number;
  content: string;
  createdAt: Date;
  roomId: number;
  userId: number;
};

type RoomBase = {
  id: number;
  name: string;
};

type SubscribedRoom = RoomBase & {
  subscribed: true;
  messageHistory: Message[];
};

type UnsubscribedRoom = RoomBase & {
  subscribed: false;
};

type Room = SubscribedRoom | UnsubscribedRoom;

type OnlineUser = {
  id: number;
  username: string;
};

type AuthorizationMessage = {
  event: "authorization";
  payload: {
    username: string;
    password: string;
  };
};

type AuthorizedMessage = {
  event: "authorized";
  payload: {
    token: string;
    rooms: Room[];
    onlineUsers: OnlineUser[];
  };
};

type ErrorMessage = {
  event: "error";
  payload: {
    code: number;
    content: string;
  };
};
