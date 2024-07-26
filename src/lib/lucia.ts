import { db } from "@/server/db";
import { sessions, users } from "@/server/db/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "kolac-breee",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  }
})