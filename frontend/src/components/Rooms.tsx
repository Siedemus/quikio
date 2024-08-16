import { Room } from "../types/types";
import hashIcon from "../resources/images/hash.svg";
import roomColors from "../resources/roomColors";
import { useSearchParams } from "react-router-dom";
import useQueryParam from "../hooks/useQueryParam";

const Rooms = ({ rooms }: { rooms: Room[] }) => {
  const [, updateRoomQuery] = useQueryParam("r");
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

  const filteredRooms = searchQuery
    ? rooms.filter((user) => user.name.includes(searchQuery))
    : rooms;

  return (
    <section className="max-w-[350px] min-h-[46vh] px-4 pt-2 border-r border-b border-periwinkleGray">
      <h2 className="py-2 font-bold">Rooms</h2>
      {filteredRooms.length > 0 ? (
        <ul className="grid grid-cols-2 p-2 gap-4 max-h-[40vh] overflow-y-auto">
          {filteredRooms.map((room, i) => {
            const color = roomColors[i % roomColors.length];

            return (
              <li
                className="flex items-center gap-2 hover:bg-periwinkleGray rounded-full duration-300 cursor-pointer hover:text-aliceBlue"
                key={room.id}
                onClick={() => updateRoomQuery(room.id.toString())}
              >
                <img
                  src={hashIcon}
                  className={`w-11 h-11 rounded-full bg-${color}`}
                ></img>
                <p className="truncate">{room.name}</p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="min-h-[40vh] flex items-center justify-center">
          <p>No rooms found.</p>
        </div>
      )}
    </section>
  );
};

export default Rooms;
