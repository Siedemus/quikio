import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Chat from "./pages/Chat";
import ChatContextProvider from "./context/ChatContext";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" />,
    errorElement: <Navigate to="/login" />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/login",
    element: <Login />,
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
