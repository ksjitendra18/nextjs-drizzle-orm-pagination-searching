import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.local" });

if (!process.env.DB_URL) {
  throw new Error("DB_URL is missing");
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: {
    url: process.env.DB_URL,
  },
  dialect: "mysql",
});
