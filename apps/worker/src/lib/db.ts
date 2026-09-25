import { Pool } from "pg";
import { env } from "../config/env.js";

const globalForPool = globalThis as typeof globalThis & {
  pool?: Pool;
};

function createPool(): Pool {
  return new Pool({ connectionString: env.databaseUrl });
}

export const pool = globalForPool.pool ?? createPool();

if (env.nodeEnv !== "production") {
  globalForPool.pool = pool;
}

export async function disconnectDatabase(): Promise<void> {
  await pool.end();
}

export async function findUserContact(
  userId: string,
): Promise<{ email: string; fullName: string } | null> {
  const result = await pool.query<{ email: string; full_name: string }>(
    `SELECT email, full_name FROM users WHERE id = $1 LIMIT 1`,
    [userId],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return { email: row.email, fullName: row.full_name };
}

export async function createNotification(input: {
  userId: string;
  type: "system" | "trip_reminder" | "itinerary_alert";
  title: string;
  body: string;
}): Promise<void> {
  await pool.query(
    `INSERT INTO notifications (id, user_id, type, title, body, created_at)
     VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW())`,
    [input.userId, input.type, input.title, input.body],
  );
}

export async function expirePendingBookings(cutoff: Date): Promise<number> {
  const result = await pool.query(
    `UPDATE bookings
     SET status = 'expired', updated_at = NOW()
     WHERE status = 'pending'
       AND payment_status = 'unpaid'
       AND created_at < $1`,
    [cutoff],
  );

  return result.rowCount ?? 0;
}
