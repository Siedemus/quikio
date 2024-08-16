import OnlineUsers from "./components/OnlineUsers";
import Rooms from "./components/rooms";
import Search from "./components/Search";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Search />
        <OnlineUsers onlineUsers={[]} />
        <Rooms rooms={[]} />
      </>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
