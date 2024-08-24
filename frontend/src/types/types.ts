export type Message = {
  id: number;
  content: string;
  createdAt: Date;
  roomId: number;
  userId: number;
  username: string;
};

export type Room = {
  name: string;
  id: number;
  messages: Message[] | undefined;
};

export type OnlineUser = {
  id: number;
  name: string;
};

export interface IChatData {
  rooms: Room[];
  onlineUsers: OnlineUser[];
}

export interface IChatContext {
  chatData: IChatData | null;
  sendMessage: (message: ClientEvents) => void;
}

export type AuthorizationEventPayload = {
  name: string;
  password: string;
};

export type AuthorizationEvent = {
  event: "authorization";
  payload: AuthorizationEventPayload;
};

export type AuthorizedEventPayload = {
  token: string;
  rooms: Room[];
  onlineUsers: OnlineUser[];
  userId: number;
  username: string;
};

export type AuthorizedEvent = {
  event: "authorized";
  payload: AuthorizedEventPayload;
};

export type ErrorEventPayload = {
  code: number;
  content: string;
};

export type ErrorEvent = {
  event: "error";
  payload: ErrorEventPayload;
};

export type BaseMessageEventPayload = {
  content: string;
  id: number;
  token: string;
  name: string;
};

export type BaseMessageEvent = {
  event: "base";
  payload: BaseMessageEventPayload;
};

export type NewMessageEvent = {
  event: "newMessage";
  payload: Message;
};

export type NewOnlineUserEvent = {
  event: "newOnlineUser";
  payload: OnlineUser;
};

export type SubscribeRoomEventPayload = {
  token: string;
  id: number;
};

export type SubscribeRoomEvent = {
  event: "subscribeRoom";
  payload: SubscribeRoomEventPayload;
};

export type UnsubscribeRoomEventPayload = {
  token: string;
  id: number;
};

export type UnsubscribeRoomEvent = {
  event: "unsubscribeRoom";
  payload: UnsubscribeRoomEventPayload;
};

export type addRoomEvent = {
  event: "addRoom";
  payload: Room;
};

export type RemoveRoomEventPayload = {
  id: number;
};

export type RemoveRoomEvent = {
  event: "removeRoom";
  payload: RemoveRoomEventPayload;
};

export type VerifyTokenEventPayload = {
  token: string;
  userId: number;
  username: string;
};

export type VerifyTokenEvent = {
  event: "verifyToken";
  payload: VerifyTokenEventPayload;
};

export type VerifiedTokenEvent = {
  event: "verifiedToken";
  payload: null
};

export type ClientEvents =
  | AuthorizationEvent
  | BaseMessageEvent
  | SubscribeRoomEvent
  | UnsubscribeRoomEvent
  | VerifyTokenEvent;

export type ServerEvents =
  | ErrorEvent
  | AuthorizedEvent
  | NewMessageEvent
  | NewOnlineUserEvent
  | addRoomEvent
  | RemoveRoomEvent
  | VerifiedTokenEvent;
