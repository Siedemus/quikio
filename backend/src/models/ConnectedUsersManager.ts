import type { OnlineUser, ConnectedUser } from "../types/types";
import * as ws from "ws";

class ConnectedUsersManager {
  private connectedUsers: readonly ConnectedUser[] = [];

  addUserConnection(
    connectedUser: ConnectedUser
  ): readonly ConnectedUser[] | undefined {
    const user = this.connectedUsers.find((u) => u.id === connectedUser.id);

    if (!user) {
      console.log("added user");
      return this.updateConnectedUsers([...this.connectedUsers, connectedUser]);
    }

    const connectionExists = user.ws.some((s) => s === connectedUser.ws[0]);
    if (connectionExists) {
      return undefined;
    }

    const updatedUser: ConnectedUser = {
      ...user,
      ws: [...user.ws, ...connectedUser.ws],
    };

    const updatedConnectedUsers = [
      ...this.connectedUsers.filter((u) => u.id !== updatedUser.id),
      updatedUser,
    ];

    return this.updateConnectedUsers(updatedConnectedUsers);
  }

  removeUserConnection(ws: ws.WebSocket): readonly ConnectedUser[] | undefined {
    const user = this.connectedUsers.find((u) => u.ws.includes(ws));
    if (!user) {
      return undefined;
    }

    const updatedUser: ConnectedUser = {
      ...user,
      ws: user.ws.filter((s) => s !== ws),
    };

    if (updatedUser.ws.length === 0) {
      return this.updateConnectedUsers(
        this.connectedUsers.filter((u) => u.id === updatedUser.id)
      );
    }

    const updatedConnectedUsers = [
      ...this.connectedUsers.filter((u) => u.id !== updatedUser.id),
      updatedUser,
    ];
    return this.updateConnectedUsers(updatedConnectedUsers);
  }

  getConnectedUser(userId: number): ConnectedUser | undefined {
    return this.connectedUsers.find((u) => u.id === userId);
  }

  getConnectedUsers(): readonly ConnectedUser[] {
    return this.connectedUsers;
  }

  getOnlineUsers(): OnlineUser[] {
    return this.connectedUsers.map(({ id, name }) => ({
      id,
      name,
    }));
  }

  private updateConnectedUsers(
    updatedUsers: ConnectedUser[]
  ): readonly ConnectedUser[] {
    this.connectedUsers = Object.freeze(updatedUsers);
    return this.connectedUsers;
  }
}

export default new ConnectedUsersManager();
