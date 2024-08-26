import MessageBoxHeader from "./MessageBoxHeader";
import MessagesList from "./MessagesList";
import MessageBoxTextArea from "./MessageBoxTextArea";
import useQueryParam from "../../../hooks/useQueryParam";
import { useContext } from "react";
import { ChatContext } from "../../../context/ChatContext";
import getSessionToken from "../../../utils/getSessionToken";

const MessageBox = ({
  sidebarState,
}: {
  sidebarState: {
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  };
}) => {
  const { chatData, send } = useContext(ChatContext)!;
  console.log(chatData);
  const { rooms, userData } = chatData;
  const { username } = userData!;
  const [roomQuery] = useQueryParam("r");
  const token = getSessionToken();

  const validateRoomQuery = () => {
    const roomId = Number(roomQuery);
    if (isNaN(roomId)) return null;
    return roomId;
  };

  const handleSubscribe = () => {
    send({ event: "subscribeRoom", payload: { id: room!.id, token: token! } });
  };

  const roomId = validateRoomQuery();
  const room = roomId ? rooms.find((room) => room.id === roomId) : null;

  return (
    <section className="w-full h-full flex flex-col">
      <MessageBoxHeader room={room} sidebarState={sidebarState} />
      {room ? (
        room.messages !== undefined ? (
          <>
            <MessagesList messages={room.messages} username={username} />
            <MessageBoxTextArea send={send} username={username} />
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center p-4 text-center gap-4">
            <p>You are not subscribing to this room.</p>
            <button
              className="bg-vanillaIce p-2 rounded hover:brightness-110 active:brightness-90"
              onClick={handleSubscribe}
            >
              Subscribe
            </button>
          </div>
        )
      ) : (
        <p className="flex h-full items-center justify-center text-center">
          You need to select a room to display messages.
        </p>
      )}
    </section>
  );
};

export default MessageBox;
