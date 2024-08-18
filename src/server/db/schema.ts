import { sql } from "drizzle-orm";
import {
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";

export const createTable = pgTableCreator((name) => `blog_${name}`);

export const accountTypeEnum = pgEnum("accout_type", ["email", "google", "github"]);

export const users = createTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 75}).unique().notNull(),
    accountType: accountTypeEnum("account_type").notNull(),
    fullName: varchar("full_name", { length: 50 }).notNull(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    picture: varchar("picture", { length: 150 }),
  }
);

export const sessions = createTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    expiresAt: timestamp("expires_at").notNull()
  }
);

export const resetTokens = createTable(
  "reset_tokens", 
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id).unique().notNull(),
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