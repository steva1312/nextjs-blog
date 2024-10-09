//dev
import * as postgresjs from "drizzle-orm/postgres-js";
import postgres from "postgres";

//production
import * as vercelPostgres from "drizzle-orm/vercel-postgres";
import * as vercel from "@vercel/postgres";

import * as schema from "./schema";

const dev = postgresjs.drizzle(postgres(process.env.POSTGRES_URL!, { max: 1000 }), { schema });

const prod = vercelPostgres.drizzle(vercel.sql, { schema });

export const db = process.env.PRODUCTION ? prod : dev;
