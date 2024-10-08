import { useRef, useState } from "react";
import sendIcon from "../../../resources/images/send.svg";
import unsubscribeIcon from "../../../resources/images/unsubscribe.svg";
import { ClientEvents } from "../../../types/types";
import useQueryParam from "../../../hooks/useQueryParam";
import getSessionToken from "../../../utils/getSessionToken";
import { toast } from "sonner";

const MessageBoxTextArea = ({
  send,
  username,
}: {
  send: (message: ClientEvents) => void;
  username: string;
}) => {
  const [value, setValue] = useState("");
  const [roomQuery] = useQueryParam("r");
  const roomId = Number(roomQuery)!;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const token = getSessionToken()!;

  const handleBaseMessage = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue && inputRef.current) {
      inputRef.current.focus();
      toast.warning("You should type something.");
      return;
    }
    send({
      event: "base",
      payload: { content: value, id: roomId, token, name: username },
    });
    setValue("");
  };

  const handleUnsubscribe = () => {
    send({ event: "unsubscribeRoom", payload: { id: roomId, token } });
  };

  const onChange = (content: string) => {
    setValue(content);
  };

  const onKeyDown = (key: string) => {
    if (key === "Enter") handleBaseMessage();
  };

  return (
    <section className="p-4 flex gap-2 border-t border-periwinkleGray">
      <button
        className="w-11 h-11 bg-vanillaIce rounded-md hover:brightness-110 active:brightness-75 duration-300 px-1"
        onClick={handleUnsubscribe}
        title="Unsubscribe to room"
      >
        <img src={unsubscribeIcon} className="w-full h-full p-1" />
      </button>
      <input
        ref={inputRef}
        value={value}
        type="text"
        className="w-full h-11 border border-periwinkleGray rounded flex-shrink p-2"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => onKeyDown(e.key)}
      />
      <button
        className="w-11 h-11 bg-vanillaIce rounded-md hover:brightness-110 active:brightness-75 duration-300"
        onClick={handleBaseMessage}
        title="Send message"
      >
        <img src={sendIcon} className="w-full h-full p-2" />
      </button>
    </section>
  );
};

export default MessageBoxTextArea;
