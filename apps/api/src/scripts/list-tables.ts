import { resolve } from "node:path";
import { config } from "dotenv";
import pg from "pg";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), "../../.env") });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    await client.connect();
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("Supabase Database Tables:");
    for (const row of res.rows) {
      console.log(` - ${row.table_name}`);
    }
  } catch (err) {
    console.error("Error listing tables:", err);
  } finally {
    await client.end();
  }
}

main();
