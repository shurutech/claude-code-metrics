import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __pgClient: ReturnType<typeof postgres> | undefined;
}

const sql =
  global.__pgClient ??
  postgres(process.env.SUPABASE_DB_URL!, {
    prepare: false,
    ssl: "require",
    max: 1,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgClient = sql;
}

export default sql;
