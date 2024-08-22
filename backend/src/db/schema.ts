import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 20 }).unique().notNull(),
  password: varchar("password").notNull(),
});

export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  content: varchar("content", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  roomId: integer("roomId")
    .notNull()
    .references(() => rooms.id),
  username: varchar("username", { length: 20 }).notNull(),
});

export const userRoomSubscriptions = pgTable("user_room_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => users.id),
  roomId: integer("roomId")
    .notNull()
    .references(() => rooms.id),
});
