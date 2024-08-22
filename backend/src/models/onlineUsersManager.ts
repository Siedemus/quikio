import type { OnlineUserSocket } from "../types/types";
import * as ws from "ws";

class OnlineUsersManager {
  private onlineUsers: OnlineUserSocket[] = [];

  addUser(user: OnlineUserSocket): void {
    this.onlineUsers.push(user);
  }

  removeUser(data: number | ws.WebSocket): void {
    if (typeof data === "number") {
      this.onlineUsers = this.onlineUsers.filter((user) => user.id !== data);
      return;
    }
    this.onlineUsers = this.onlineUsers.filter((user) => user.ws !== data);
  }

  getUser(userId: number): OnlineUserSocket | undefined {
    return this.onlineUsers.find((user) => user.id === userId);
  }

  getUsers(): OnlineUserSocket[] {
    return this.onlineUsers;
  }
}

export default new OnlineUsersManager();
