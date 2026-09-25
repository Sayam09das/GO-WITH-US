import fs from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import pg from "pg";

const currentDir = dirname(fileURLToPath(import.meta.url));
const apiRoot = resolve(currentDir, "../..");
const monorepoRoot = resolve(apiRoot, "../..");

config({ path: resolve(monorepoRoot, ".env") });
config({ path: resolve(apiRoot, ".env") });

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const migrationDirs = [
  "20250923140000_init",
  "20250924143000_auth_system",
  "20250925143000_user_dashboard",
  "20250925183000_trips_itinerary",
  "20250925200000_discovery_bookings_reviews_stories",
  "20250925213000_production_indexes",
];

async function main() {
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres. Executing full migration files...");

    for (const dirName of migrationDirs) {
      const sqlPath = resolve(apiRoot, "prisma/migrations", dirName, "migration.sql");

      if (fs.existsSync(sqlPath)) {
        console.log(`Executing migration file ${dirName}...`);
        const sql = fs.readFileSync(sqlPath, "utf-8");
        try {
          await client.query(sql);
          console.log(`✓ Applied ${dirName}`);
        } catch (err: any) {
          console.log(`  ↪ ${dirName} execution output: ${err.message}`);
        }
      }
    }

    console.log("All migrations execution complete!");
  } catch (err) {
    console.error("Error applying migrations:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
