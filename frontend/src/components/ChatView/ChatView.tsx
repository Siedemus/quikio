import MessageBox from "./MessageBox/MessageBox";
import Sidebar from "./Sidebar/Sidebar";
import { useState } from "react";

const ChatView = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  return (
    <section className="h-screen w-screen flex">
      <Sidebar sidebarState={{ showSidebar, setShowSidebar }} />
      <MessageBox sidebarState={{ showSidebar, setShowSidebar }} />
    </section>
  );
};

export default ChatView;
