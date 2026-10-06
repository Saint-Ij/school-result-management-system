import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import "dotenv/config";
import * as coreSchema from "./schema";
import * as Relations from "./relations";

const schema = { ...coreSchema, ...Relations };

const client = postgres(process.env.POSTGRES_URL!);
export const db = drizzle({ client, schema });
