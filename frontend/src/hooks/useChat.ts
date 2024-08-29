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
  IChatData,
  Message,
  OnlineUser,
  RemoveRoomEventPayload,
  Room,
  ServerEvents,
  useChatHookReturnings,
} from "../types/types";

const RECONNECT_DELAY = 5000;
const MAX_RECCONECTION_ATTEMPTS = 3;

const useChat = (url: string): useChatHookReturnings => {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [chatData, setChatData] = useState<IChatData>({
    rooms: [],
    onlineUsers: [],
    userData: null,
  });
  const wsRef = useRef<null | WebSocket>(null);
  const connectionAttemptsRef = useRef(0);

  useEffect(() => {
    connect(url);

    return () => {
      if (!wsRef.current) {
        handleError(errorCodes["WEBSOCKET_REF_NULL"]);
        return;
      }

      wsRef.current.close();
    };
  }, [url]);

  const connect = useCallback(
    (url: string) => {
      setLoading(true);
      setFailed(false);
      wsRef.current = new WebSocket(url);

      wsRef.current.addEventListener("open", () => {
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

        setLoading(false);
        setFailed(false);
      });

      wsRef.current.addEventListener(
        "message",
        ({ data }: { data: string }) => {
          const message = JSONToMessage(data);
          handleServerEvent(message);
        }
      );

      wsRef.current.addEventListener("close", () => {
        reconnect();
      });

      wsRef.current.addEventListener("error", () => {
        handleError(errorCodes["UNEXPECTED_ERROR_TRYING_AGAIN"]);
      });
    },
    [url]
  );

  const reconnect = useCallback(() => {
    setLoading(true);
    setFailed(false);

    connectionAttemptsRef.current++;
    if (connectionAttemptsRef.current >= MAX_RECCONECTION_ATTEMPTS) {
      handleError(errorCodes["CANT_CONNECT_TO_SERVER"]);
      return;
    }

    const timeout = RECONNECT_DELAY * connectionAttemptsRef.current;
    setTimeout(() => connect(url), timeout);
  }, []);

  const handleServerEvent = (message: ServerEvents) => {
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
  };

  const handleError = useCallback((payload: ErrorEventPayload) => {
    const { code, content } = payload;
    const errorCodesArray = Object.values(errorCodes);
    const isCodeMatched = errorCodesArray.some((error) => error.code === code);
    const isTokenExpired = payload.code === 104 || payload.code === 108;

    toast.error(`ERROR-${code}: ${content}`);
    if (isCodeMatched) {
      setFailed(true);
    }
    if (isTokenExpired) {
      setAuthenticated(false);
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
      setAuthenticated(true);
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

  return { chatData, authenticated, loading, failed, send: sendMessage };
};

export default useChat;
