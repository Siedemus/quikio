import { createContext, ReactNode } from "react";
import { UseChatHookReturnings } from "../types/types";
import useChat from "../hooks/useChat";

export const ChatContext = createContext<UseChatHookReturnings | null>(null);

const ChatContextProvider = ({ children }: { children: ReactNode }) => {
  const chat = useChat(import.meta.env.VITE_WSS_URL);

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
};

export default ChatContextProvider;
