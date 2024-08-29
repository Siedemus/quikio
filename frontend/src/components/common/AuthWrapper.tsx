import { ReactNode, useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import Failed from "./Failed";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({
  children,
  requireAuth,
}: {
  children: ReactNode;
  requireAuth?: boolean;
}) => {
  const { authenticated, loading, failed } = useContext(ChatContext)!;

  if (failed) return <Failed />;
  if (loading) return <Loader />;

  if (requireAuth && !authenticated) return <Navigate to="/login" replace />;
  if (!requireAuth && authenticated) return <Navigate to="/chat" replace />;

  return children;
};

export default AuthWrapper;
