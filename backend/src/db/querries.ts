import db from "./db";
import { messages, rooms, userRoomSubscriptions, users } from "./schema";
import { eq, ne } from "drizzle-orm";
import bcrypt from "bcrypt";

// USER QUERRIES

export const getUserByName = async (name: string) => {
  const user = await db.select().from(users).where(eq(users.name, name));

  return user.length > 0 ? user[0] : null;
};

export const getUserById = async (id: number) => {
  const user = await db.select().from(users).where(eq(users.id, id));

  return user.length > 0 ? user[0] : null;
};

export const createUser = async (name: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, process.env.SALT!);
  const user = await db
    .insert(users)
    .values({ name, password: hashedPassword })
    .returning();
  return user[0];
};

// ROOMS QUERRIES

export const getSubscribedRooms = async (userId: number) => {
  return await db
    .select({
      name: rooms.name,
      id: userRoomSubscriptions.roomId,
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
      id: userRoomSubscriptions.roomId,
    })
    .from(userRoomSubscriptions)
    .where(ne(userRoomSubscriptions.userId, userId))
    .innerJoin(rooms, eq(userRoomSubscriptions.roomId, rooms.id));
};

// MESSAGES QUERRIES

export const pushMessage = async (message: {
  userId: number;
  roomId: number;
  content: string;
}) => {
  const { userId, roomId, content } = message;
  const NewMessageEvent = await db
    .insert(messages)
    .values({
      userId,
      roomId,
      content,
    })
    .returning();
  return NewMessageEvent[0];
};
