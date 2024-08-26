import { useContext } from "react";
import Loader from "../components/common/Loader";
import { ChatContext } from "../context/ChatContext";
import ChatView from "../components/ChatView/ChatView";
import Failed from "../components/common/Failed";
import { Navigate } from "react-router-dom";

const Chat = () => {
  const { authenticated, loading, failed } = useContext(ChatContext)!;

  return authenticated ? (
    <ChatView />
  ) : loading ? (
    <Loader />
  ) : failed ? (
    <Failed content={"placeholder"} />
  ) : (
    <Navigate to={"/login"} />
  );
};

export default Chat;
