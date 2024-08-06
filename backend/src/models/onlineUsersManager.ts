import type { OnlineUserSocket } from "../types/types";

class OnlineUsersManager {
  private onlineUsers: OnlineUserSocket[] = [];

  addUser(user: OnlineUserSocket): void {
    this.onlineUsers.push(user);
  }

  removeUser(userId: number): void {
    this.onlineUsers = this.onlineUsers.filter((user) => user.id !== userId);
  }

  getUser(userId: number): OnlineUserSocket | undefined {
    return this.onlineUsers.find((user) => user.id === userId);
  }

  getUsers(): OnlineUserSocket[] {
    return this.onlineUsers;
  }
}

export default new OnlineUsersManager();
