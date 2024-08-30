import { Room } from "../../../types/types";
import hashIcon from "../../../resources/images/hash.svg";
import useQueryParam from "../../../hooks/useQueryParam";
import getBgColorIdBased from "../../../utils/getBgColorIdBased";

const Rooms = ({ rooms }: { rooms: Room[] }) => {
  const [roomQuery, updateRoomQuery] = useQueryParam("r");
  const [searchQuery] = useQueryParam("q");

  const selectRoom = (id: number) => {
    updateRoomQuery(id.toString());
  };

  const isDisabled = (id: number) => {
    const queryId = Number(roomQuery);
    if (isNaN(queryId)) return false;
    return queryId === id;
  };

  const filteredRooms = searchQuery
    ? rooms.filter((user) => user.name.includes(searchQuery))
    : rooms;

  return (
    <section className="min-h-[46vh] w-full px-3 pt-2 border-b border-periwinkleGray">
      <h2 className="py-2 font-bold">Rooms</h2>
      {filteredRooms.length > 0 ? (
        <ul className="grid grid-cols-2 p-1 gap-4 max-h-[40vh] overflow-auto scroll-smooth">
          {filteredRooms.map((room) => {
            const color = getBgColorIdBased(room.id);

            return (
              <li key={room.id} title={room.name}>
                <button
                  onClick={() => selectRoom(room.id)}
                  className="flex w-full items-center gap-2 hover:bg-solitude rounded-full duration-300 cursor-pointer hover:text-hippieBlue disabled:bg-gray-200 disabled:hover:text-cocoaBean disabled:cursor-not-allowed"
                  disabled={isDisabled(room.id)}
                >
                  <img
                    src={hashIcon}
                    className={`w-9 h-9 rounded-full ${color}`}
                  />
                  <p className="truncate pr-1">{room.name}</p>
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="min-h-[40vh] flex justify-center items-center">
          <p>No rooms found.</p>
        </div>
      )}
    </section>
  );
};

export default Rooms;
