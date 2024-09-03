import { useCallback, useEffect, useRef, useState } from "react";
import { JSONToMessage } from "../utils/JSONToMessage";
import { toast } from "sonner";
import { messageToJSON } from "../utils/messageToJSON";
import errorCodes from "../resources/errorCodes";
import getSessionToken from "../utils/getSessionToken";
import {
  AuthorizedEventPayload,
  ClientEvents,
  ErrorEventPayload,
  IUseChatData,
  IUseChatStateProps,
  Message,
  OnlineUser,
  RemoveRoomEventPayload,
  Room,
  ServerEvents,
  UseChatHookReturnings,
} from "../types/types";

const RECONNECT_DELAY = 5000;
const MAX_RECCONECTION_ATTEMPTS = 3;

const useChat = (url: string): UseChatHookReturnings => {
  const [state, setState] = useState<IUseChatStateProps>({
    loading: false,
    failed: false,
    authenticated: false,
  });
  const [chatData, setChatData] = useState<IUseChatData>({
    rooms: [],
    onlineUsers: [],
    userData: null,
  });
  const wsRef = useRef<null | WebSocket>(null);
  const connectionAttemptsRef = useRef(0);

  const updateState = (newState: Partial<IUseChatStateProps>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  };

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [url]);

  const connect = useCallback(() => {
    updateState({ loading: true, failed: false });
    wsRef.current = new WebSocket(url);

    wsRef.current.addEventListener("open", handleWSOpenEvent);
    wsRef.current.addEventListener("message", handleWSMessageEvent);
    wsRef.current.addEventListener("close", reconnect);
    wsRef.current.addEventListener("error", handleWSErrorEvent);

    return () => {
      wsRef.current?.close();
    };
  }, [url]);

  const handleWSOpenEvent = useCallback(() => {
    toast.success("Successfully established connection.");

    const token = getSessionToken();
    if (token && wsRef.current) {
      wsRef.current.send(
        messageToJSON({
          event: "verifyToken",
          payload: { token },
        })
      );
    }

    updateState({ failed: false, loading: false });
  }, []);

  const handleWSMessageEvent = useCallback(({ data }: { data: string }) => {
    const message = JSONToMessage(data);
    handleServerEvent(message);
  }, []);

  const handleWSErrorEvent = useCallback(() => {
    handleError(errorCodes["UNEXPECTED_ERROR_TRYING_AGAIN"]);
  }, []);

  const reconnect = useCallback(() => {
    updateState({ loading: true, failed: false });

    connectionAttemptsRef.current++;
    if (connectionAttemptsRef.current >= MAX_RECCONECTION_ATTEMPTS) {
      handleError(errorCodes["CANT_CONNECT_TO_SERVER"]);
      return;
    }  

    const timeout = RECONNECT_DELAY * connectionAttemptsRef.current;
    setTimeout(connect, timeout);
  }, [connect]);

  const handleServerEvent = useCallback((message: ServerEvents) => {
    const { event, payload } = message;

    switch (event) {
      case "error":
        handleError(payload);
        break;
      case "verifiedToken":
      case "authorized":
        handleAuthorizedMessage(payload);
        break;
      case "newMessage":
        handleNewBaseMessage(payload);
        break;
      case "newOnlineUser":
        handleNewOnlineUser(payload);
        break;
      case "addRoom":
        handleNewRoom(payload);
        break;
      case "removeRoom":
        handleRemoveRoom(payload);
        break;
      default:
        handleError(errorCodes["NOT_HANDLED_ERROR"]);
        break;
    }
  }, []);

  const handleError = useCallback((payload: ErrorEventPayload) => {
    const { code, content } = payload;
    const errorCodesArray = Object.values(errorCodes);
    const isCodeMatched = errorCodesArray.some((error) => error.code === code);
    const isTokenExpired = payload.code === 104 || payload.code === 108;

    toast.error(`ERROR-${code}: ${content}`);

    if (isCodeMatched) {
      updateState({ failed: true });
    }

    if (isTokenExpired) {
      updateState({ authenticated: false });
      sessionStorage.removeItem("token");
    }
  }, []);

  const handleAuthorizedMessage = useCallback(
    (payload: AuthorizedEventPayload) => {
      const { token, rooms, onlineUsers, ...userData } = payload;
      sessionStorage.setItem("token", token);

      setChatData((prevChatData) => ({
        ...prevChatData,
        rooms,
        onlineUsers,
        userData,
      }));
      updateState({ authenticated: true });
    },
    []
  );

  const handleNewBaseMessage = useCallback((payload: Message) => {
    setChatData((prevChatData) => ({
      ...prevChatData,
      rooms: prevChatData.rooms.map((room) =>
        room.id === payload.roomId
          ? {
              ...room,
              messages: [...(room.messages || []), payload],
            }
          : room
      ),
    }));
  }, []);

  const handleNewOnlineUser = useCallback((payload: OnlineUser) => {
    setChatData((prevChatData) => ({
      ...prevChatData,
      onlineUsers: [...prevChatData.onlineUsers, payload],
    }));
  }, []);

  const handleNewRoom = useCallback((payload: Room) => {
    setChatData((prevChatData) => ({
      ...prevChatData,
      rooms: prevChatData.rooms.map((room) =>
        room.id === payload.id ? { ...room, messages: payload.messages } : room
      ),
    }));
  }, []);

  const handleRemoveRoom = useCallback((payload: RemoveRoomEventPayload) => {
    setChatData((prevChatData) => ({
      ...prevChatData,
      rooms: prevChatData.rooms.map((room) =>
        room.id === payload.id ? { ...room, messages: undefined } : room
      ),
    }));
  }, []);

  const sendMessage = useCallback(
    (message: ClientEvents) => {
      if (!wsRef.current) {
        handleError(errorCodes["WEBSOCKET_REF_NULL"]);
        return;
      }
      wsRef.current.send(messageToJSON(message));
    },
    [handleError]
  );

  return { chatData, ...state, send: sendMessage };
};

export default useChat;
