import hashIcon from "../../resources/images/hash.svg";

const MessageBoxHeader = ({
  roomName,
  roomColor,
}: {
  roomName: string;
  roomColor: string;
}) => {
  return (
    <section className="p-4 flex items-center justify-between border-b border-periwinkleGray max-h-[72px]">
      <div className="flex items-center gap-4">
        <img src={hashIcon} className={`w-10 h-10 rounded-full ${roomColor}`} />
        <h1 className="text-xl font-bold">{roomName}</h1>
      </div>
    </section>
  );
};

export default MessageBoxHeader;
