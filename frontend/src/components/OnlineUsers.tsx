import { OnlineUser } from "../types/types";
import { useSearchParams } from "react-router-dom";
import placeholderUser from "../resources/images/placeholderUser.jpg";

const OnlineUsers = ({ onlineUsers }: { onlineUsers: OnlineUser[] }) => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const filteredOnlineUsers = query
    ? onlineUsers.filter((user) => user.name.includes(query))
    : onlineUsers;

  return (
    <section className="max-w-[350px] min-h-[46vh] px-4 pt-2 border-r border-b border-periwinkleGray">
      <h2 className="py-2 font-bold">Online users</h2>
      {filteredOnlineUsers.length > 0 ? (
        <ul className="grid grid-cols-2 p-2 gap-4 max-h-[40vh] overflow-y-auto">
          {filteredOnlineUsers.map((user) => (
            <li className="flex items-center gap-2" key={user.id}>
              <img
                src={placeholderUser}
                className="w-11 h-11 rounded-full"
              ></img>
              <p className="truncate">{user.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className="min-h-[40vh] flex items-center justify-center">
          <p>No users found.</p>
        </div>
      )}
    </section>
  );
};

export default OnlineUsers;
