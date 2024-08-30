import hashIcon from "../../../resources/images/hash.svg";
import hamburgerIcon from "../../../resources/images/hamburger.svg";
import { Room } from "../../../types/types";
import getBgColorIdBased from "../../../utils/getBgColorIdBased";

const MessageBoxHeader = ({
  room,
  sidebarState,
}: {
  room: Room | undefined | null;
  sidebarState: {
    showSidebar: boolean;
    setShowSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  };
}) => {
  const { setShowSidebar } = sidebarState;
  const roomColor = room ? getBgColorIdBased(room.id) : "bg-gray-300";

  return (
    <section className="p-3 flex items-center border-b border-periwinkleGray min-h-[72px]">
      <button
        className="cursor-pointer block lg:hidden pr-2"
        onClick={() => setShowSidebar(true)}
      >
        <img
          src={hamburgerIcon}
          className={`w-10 h-10 rounded-full bg-vanillaIce p-1.5`}
        />
      </button>
      <div className="flex items-center gap-2">
        {room ? (
          <>
            <img
              src={hashIcon}
              className={`w-10 h-10 rounded-full ${roomColor}`}
            />
            <h1 className="text-xl font-bold">{room.name}</h1>
          </>
        ) : null}
      </div>
    </section>
  );
};

export default MessageBoxHeader;
