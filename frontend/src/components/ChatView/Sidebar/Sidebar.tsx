import { useContext } from "react";
import OnlineUsers from "./OnlineUsers";
import Rooms from "./Rooms";
import Search from "./Search";
import { ChatContext } from "../../../context/ChatContext";

const Sidebar = ({
  sidebarState,
}: {
  sidebarState: {
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  };
}) => {
  const { showSidebar } = sidebarState;
  const { chatData } = useContext(ChatContext)!;
  const { rooms, onlineUsers } = chatData;

  return (
    <section
      className={`w-[320px] bg-aliceBlue absolute ${
        showSidebar ? "block" : "hidden"
      } lg:static lg:block border-r border-periwinkleGray`}
    >
      <Search sidebarState={sidebarState} />
      <Rooms rooms={rooms} />
      <OnlineUsers onlineUsers={onlineUsers} />
    </section>
  );
};

export default Sidebar;
