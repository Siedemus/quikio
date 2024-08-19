import { Message } from "../../types/types";
import placeholderUser from "../../resources/images/placeholderUser.jpg";
import { useEffect, useRef } from "react";

const Messages = ({ messages }: { messages: Message[] }) => {
  const username = "michael";
  const listRef = useRef<HTMLUListElement | null>(null);

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, []);

  return messages.length !== 0 ? (
    <ul
      ref={listRef}
      className={`p-4 lg:p-6 flex flex-col gap-4 overflow-y-auto flex-grow`}
    >
      {messages.map((message) => (
        <li
          className={`flex max-w-[550px] w-full gap-4 items-center rounded-xl p-2 ${
            username === message.username
              ? "self-end flex-row-reverse bg-vanillaIce"
              : "bg-periwinkleGray"
          }`}
        >
          <img src={placeholderUser} className={`w-11 h-11 rounded-full`} />
          <div>
            <p
              className={`font-bold ${
                username === message.username ? "text-right" : ""
              }`}
            >
              {message.username}
            </p>
            <p
              className={`${username === message.username ? "text-right" : ""}`}
            >
              {message.content}
            </p>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="flex-grow flex items-center justify-center p-4 text-center">
      No messages. You sould type something!
    </p>
  );
};

export default Messages;
