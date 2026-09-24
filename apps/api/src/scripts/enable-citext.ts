import { resolve } from "node:path";
import { config } from "dotenv";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

console.log("Connecting to Supabase Postgres...");

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    await client.connect();
    console.log("Connected successfully! Enabling citext & uuid-ossp extensions...");

    await client.query('CREATE EXTENSION IF NOT EXISTS "citext";');
    console.log('✓ Successfully enabled "citext" extension!');

    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    console.log('✓ Successfully enabled "uuid-ossp" extension!');
  } catch (err) {
    console.error("Error enabling extensions:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
