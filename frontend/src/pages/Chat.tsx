import MessageBox from "../components/MessageBox/MessageBox";
import OnlineUsers from "../components/OnlineUsers";
import Rooms from "../components/Rooms";
import Search from "../components/Search";

const Chat = () => {
  return (
    <section className="w-screen h-screen flex">
      <div className="w-[320px] bg-aliceBlue absolute hidden lg:static lg:block border-r border-periwinkleGray">
        <Search />
        <Rooms rooms={[]} />
        <OnlineUsers onlineUsers={[]} />
      </div>
      <MessageBox />
    </section>
  );
};

export default Chat;
