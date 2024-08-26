import { useCallback, useEffect, useRef, useState } from "react";
import { JSONToMessage } from "../utils/JSONToMessage";
import { toast } from "sonner";
import { messageToJSON } from "../utils/messageToJSON";
import errorCodes from "../resources/errorCodes";
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
import getSessionToken from "../utils/getSessionToken";

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
  let connectionAttempts = 0;

  useEffect(() => {
    connect(url);

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      } else {
        handleError(errorCodes["UNEXPECTED_ERROR_DURING_CLOSING_CONNECTION"]);
        setFailed(true);
      }
    };
  }, [url]);

  const connect = useCallback(
    (url: string) => {
      setLoading(true);
      wsRef.current = new WebSocket(url);

      wsRef.current.addEventListener("open", () => {
        const token = getSessionToken();
        if (token) {
          console.log(token);
          wsRef.current?.send(
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
          console.log(data);

          const message = JSONToMessage(data);
          handleServerEvent(message);
        }
      );

      wsRef.current.addEventListener("close", () => {
        setLoading(true);
        connectionAttempts++;
        if (connectionAttempts > 3) {
          handleError(errorCodes["CANT_CONNECT_TO_SERVER"]);
          setFailed(true);
          return;
        }
        const timeout = 5 * 1000 * connectionAttempts;
        setTimeout(() => connect(url), timeout);
      });

      wsRef.current.addEventListener("error", () => {
        handleError(errorCodes["UNEXPECTED_ERROR"]);
        setFailed(true);
      });
    },
    [url]
  );

  const handleServerEvent = (message: ServerEvents) => {
    const { event, payload } = message;

    switch (event) {
      case "error":
        handleError(payload);
        break;
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
      case "verifiedToken":
        handleAuthorizedMessage(payload);
        break;
      default:
        handleError(errorCodes["NOT_HANDLED_ERROR"]);
        setFailed(true);
        break;
    }
  };

  const handleError = (payload: ErrorEventPayload) => {
    toast.error(`ERROR-${payload.code}: ${payload.content}`);
  };

  const handleAuthorizedMessage = (payload: AuthorizedEventPayload) => {
    const { token, rooms, onlineUsers, ...userData } = payload;
    sessionStorage.setItem("token", token);

    setChatData((prevChatData) => ({
      ...prevChatData,
      rooms,
      onlineUsers,
      userData,
    }));
    setAuthenticated(true);
  };

  const handleNewBaseMessage = (payload: Message) => {
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
  };

  const handleNewOnlineUser = (payload: OnlineUser) => {
    console.log(payload);

    setChatData((prevChatData) => ({
      ...prevChatData,
      onlineUsers: [...prevChatData.onlineUsers, payload],
    }));
  };

  const handleNewRoom = (payload: Room) => {
    setChatData((prevChatData) => ({
      ...prevChatData,
      rooms: prevChatData.rooms.map((room) =>
        room.id === payload.id ? { ...room, messages: payload.messages } : room
      ),
    }));
  };

  const handleRemoveRoom = (payload: RemoveRoomEventPayload) => {
    setChatData((prevChatData) => ({
      ...prevChatData,
      rooms: prevChatData.rooms.map((room) =>
        room.id === payload.id ? { ...room, messages: undefined } : room
      ),
    }));
  };

  const sendMessage = useCallback((message: ClientEvents) => {
    if (wsRef.current === null) {
      handleError(errorCodes["UNEXPECTED_ERROR"]);
      setFailed(true);
      return;
    }
    wsRef.current.send(messageToJSON(message));
  }, []);

  return { chatData, authenticated, loading, failed, send: sendMessage };
};

export default useChat;
