import sendIcon from "../../resources/images/send.svg";

const MessageTextArea = () => {
  return (
    <section className="p-4 flex gap-4 border-t border-periwinkleGray">
      <input
        type="text"
        className="w-full h-11 border border-periwinkleGray rounded-md"
      />
      <button className="w-11 h-11 bg-vanillaIce rounded-md hover:brightness-110 active:brightness-75 duration-300">
        <img src={sendIcon} className="w-full h-full p-2" />
      </button>
    </section>
  );
};

export default MessageTextArea;
