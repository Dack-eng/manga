import { Pool } from "pg";

type Queryable = {
  query<T = unknown>(text: string, values?: unknown[]): Promise<{ rows: T[] }>;
};

const globalForDb = globalThis as typeof globalThis & {
  mangaDbPool?: Pool;
};

let pool: Pool | undefined;

function createPool() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set.");
  }

  try {
    const url = new URL(connectionString);
    const isLocalDatabase = ["localhost", "127.0.0.1"].includes(url.hostname);
    const sslMode = url.searchParams.get("sslmode");

    return new Pool({
      connectionString,
      ssl:
        !isLocalDatabase && sslMode !== "disable"
          ? { rejectUnauthorized: false }
          : undefined,
    });
  } catch {
    return new Pool({ connectionString });
  }
}

function getPool() {
  if (pool) {
    return pool;
  }

  if (globalForDb.mangaDbPool) {
    pool = globalForDb.mangaDbPool;
    return pool;
  }

  pool = createPool();

  if (process.env.NODE_ENV !== "production") {
    globalForDb.mangaDbPool = pool;
  }

  return pool;
}

export async function queryRows<T>(
  text: string,
  values: unknown[] = [],
  executor?: Queryable
): Promise<T[]> {
  const db = executor ?? getPool();
  const { rows } = await db.query<T>(text, values);
  return rows;
}

export async function withTransaction<T>(
  callback: (executor: Queryable) => Promise<T>
) {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool() {
  if (!pool) {
    return;
  }

  const currentPool = pool;
  pool = undefined;

  if (globalForDb.mangaDbPool === currentPool) {
    delete globalForDb.mangaDbPool;
  }

  await currentPool.end();
}
