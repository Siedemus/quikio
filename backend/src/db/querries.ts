import db from "./db";
import { messages, rooms, userRoomSubscriptions, users } from "./schema";
import { and, eq, isNull } from "drizzle-orm";
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
  const hashedPassword = await bcrypt.hash(password, +process.env.SALT!);

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
      id: rooms.id,
    })
    .from(userRoomSubscriptions)
    .innerJoin(rooms, eq(userRoomSubscriptions.roomId, rooms.id))
    .where(eq(userRoomSubscriptions.userId, userId));
};

export const getRoomMessages = async (roomId: number) => {
  return await db.select().from(messages).where(eq(messages.roomId, roomId));
};

export const getNotSubscribedRooms = async (userId: number) => {
  return await db
    .select({
      name: rooms.name,
      id: rooms.id,
    })
    .from(rooms)
    .leftJoin(
      userRoomSubscriptions,
      and(
        eq(rooms.id, userRoomSubscriptions.roomId),
        eq(userRoomSubscriptions.userId, userId)
      )
    )
    .where(isNull(userRoomSubscriptions.id));
};

export const getRooms = async () => {
  return await db.select().from(rooms);
};

export const subscribeToRoom = async (userSubscription: {
  userId: number;
  roomId: number;
}) => {
  return await db.insert(userRoomSubscriptions).values(userSubscription);
};

export const unsubscribeToRoom = async (userSubscription: {
  userId: number;
  roomId: number;
}) => {
  await db
    .delete(userRoomSubscriptions)
    .where(
      and(
        eq(userRoomSubscriptions.userId, userSubscription.userId),
        eq(userRoomSubscriptions.roomId, userSubscription.roomId)
      )
    );
};

// MESSAGES QUERRIES

export const pushMessage = async (message: {
  userId: number;
  roomId: number;
  content: string;
  username: string;
}) => {
  const { userId, roomId, content, username } = message;
  const NewMessageEvent = await db
    .insert(messages)
    .values({
      userId,
      roomId,
      content,
      username,
    })
    .returning();
  return NewMessageEvent[0];
};
