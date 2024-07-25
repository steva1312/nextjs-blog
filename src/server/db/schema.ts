import { sql } from "drizzle-orm";
import { datetime } from "drizzle-orm/mysql-core";
import {
  integer,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `blog_${name}`);

export const users = createTable(
  "users",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 75}).unique().notNull(),
    fullName: varchar("full_name", { length: 50 }).notNull(),
    hashedPassword: varchar("name", { length: 100 })
  }
);

export const sessions = createTable(
  "sessions",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(),
    expiresAt: timestamp("expires_at").notNull()
  }
);

export const blogs = createTable(
  "blogs",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }),
  }
);