import { createContext, ReactNode } from "react";
import { useChatHookReturnings } from "../types/types";
import useChat from "../hooks/useChat";

export const ChatContext = createContext<useChatHookReturnings | null>(null);

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const chat = useChat("wss://localhost:8080");

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;
