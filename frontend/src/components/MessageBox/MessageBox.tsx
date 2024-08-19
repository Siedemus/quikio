import MessageBoxHeader from "./MessageBoxHeader";
import Messages from "./Messages";
import MessageTextArea from "./MessageTextArea";

const MessageBox = () => {
  return (
    <section className="w-full h-full flex flex-col">
      <MessageBoxHeader roomName="genral" roomColor="bg-vanillaIce" />
      <Messages messages={[]} />
      <MessageTextArea />
    </section>
  );
};

export default MessageBox;
