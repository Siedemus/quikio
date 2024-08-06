import * as ws from "ws";

interface User {
  id: number;
  name: string;
  ws: ws.WebSocket;
}

class OnlineUsersManager {
  private onlineUsers: User[] = [];

  addUser(user: User): void {
    this.onlineUsers.push(user);
  }

  removeUser(userId: number): void {
    this.onlineUsers = this.onlineUsers.filter((user) => user.id !== userId);
  }

  getUser(userId: number): User | undefined {
    return this.onlineUsers.find((user) => user.id === userId);
  }

  getUsers(): User[] {
    return this.onlineUsers;
  }
}

export default new OnlineUsersManager();
