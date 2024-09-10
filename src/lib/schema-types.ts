import { blogs, users } from "@/server/db/schema";

export type User = typeof users.$inferInsert;
export type UserSelect = typeof users.$inferSelect;
export type Blog = typeof blogs.$inferInsert;