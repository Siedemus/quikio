import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ChatContextProvider from "./context/ChatContext";
import AuthWrapper from "./components/common/AuthWrapper";
import ChatView from "./components/ChatView/ChatView";
import LoginForm from "./components/LoginForm/LoginForm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  {
    path: "/chat",
    element: (
      <AuthWrapper requireAuth>
        <ChatView />
      </AuthWrapper>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthWrapper>
        <LoginForm />
      </AuthWrapper>
    ),
  },
]);

function App() {
  return (
    <ChatContextProvider>
      <RouterProvider router={router} />
    </ChatContextProvider>
  );
}

export default App;
