import { useContext } from "react";
import Loader from "../components/common/Loader";
import { ChatContext } from "../context/ChatContext";
import { Navigate } from "react-router-dom";
import Failed from "../components/common/Failed";
import LoginForm from "../components/LoginForm/LoginForm";

const Login = () => {
  const { authenticated, loading, failed } = useContext(ChatContext)!;

  return authenticated ? (
    <Navigate to="/chat" />
  ) : loading ? (
    <Loader />
  ) : failed ? (
    <Failed content="Smth went wrong" />
  ) : (
    <LoginForm />
  );
};

export default Login;
