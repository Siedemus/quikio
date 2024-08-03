import db from "./db";
import { messages, rooms, userRoomSubscriptions, users } from "./schema";
import { eq, ne } from "drizzle-orm";
import bcrypt from "bcrypt";

export const getUserByUsername = async (username: string) => {
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      password: users.password,
    })
    .from(users)
    .where(eq(users.name, username));

  return user.length > 0 ? user[0] : null;
};

export const createUser = async (name: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, process.env.SALT!);
  const user = await db
    .insert(users)
    .values({ name, password: hashedPassword, isOnline: false })
    .returning({ id: users.id, name: users.name, password: users.password });
  return user[0];
};

export const getSubscribedRooms = async (userId: number) => {
  return await db
    .select({
      name: rooms.name,
      roomId: userRoomSubscriptions.roomId,
    })
    .from(userRoomSubscriptions)
    .where(eq(userRoomSubscriptions.userId, userId))
    .innerJoin(rooms, eq(userRoomSubscriptions.roomId, rooms.id));
};

export const getRoomMessages = async (roomId: number) => {
  return await db.select().from(messages).where(eq(messages.roomId, roomId));
};

export const getNotSubscribedRooms = async (userId: number) => {
  return await db
    .select({
      name: rooms.name,
      roomId: userRoomSubscriptions.roomId,
    })
    .from(userRoomSubscriptions)
    .where(ne(userRoomSubscriptions.userId, userId))
    .innerJoin(rooms, eq(userRoomSubscriptions.roomId, rooms.id));
};

export const getOnlineUsers = async () => {
  return await db
    .select({
      id: users.id,
      username: users.name,
    })
    .from(users)
    .where(eq(users.isOnline, true));
};
