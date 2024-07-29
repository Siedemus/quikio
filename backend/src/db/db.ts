import { Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import { messages, rooms, userRoomSubscriptions, users } from "./schema";
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DB_URL });
const db = drizzle(pool);

export default db;
