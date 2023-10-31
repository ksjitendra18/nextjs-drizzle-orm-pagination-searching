import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    connectionString: process.env.DB_URL!,
  },
  driver: "mysql2",
} satisfies Config;
