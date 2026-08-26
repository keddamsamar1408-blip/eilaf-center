const fs = require("fs");
const { Pool } = require("pg");

const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/^DATABASE_URL\s*=\s*(.+)$/m);

if (!match) throw new Error("DATABASE_URL not found");

let connectionString = match[1].trim();

if (
  (connectionString.startsWith('"') && connectionString.endsWith('"')) ||
  (connectionString.startsWith("'") && connectionString.endsWith("'"))
) {
  connectionString = connectionString.slice(1, -1);
}

const pool = new Pool({ connectionString });

const bad = /ط§|ط¥|ط¹|ط¬|ط¯|ط®|ط­|ظ…|ظ†|ظ„|ظˆ|ظٹ|ظƒ|âœ|ï¸|أ©|├|┘|╪/;

(async () => {
  try {
    const tables = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    for (const row of tables.rows) {
      const table = row.table_name;

      const columns = await pool.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = $1
          AND data_type IN ('text', 'character varying', 'character')
        ORDER BY ordinal_position
        `,
        [table]
      );

      for (const col of columns.rows) {
        const column = col.column_name;

        const result = await pool.query(
          `SELECT * FROM "${table}" WHERE "${column}" ~ $1 LIMIT 20`,
          [bad.source]
        );

        if (result.rows.length > 0) {
          console.log("");
          console.log("========================================");
          console.log(`TABLE: ${table}`);
          console.log(`COLUMN: ${column}`);
          console.log("========================================");

          for (const item of result.rows) {
            console.dir(item, { depth: null });
          }
        }
      }
    }

    console.log("");
    console.log("Database corruption scan completed.");
  } catch (error) {
    console.error(error);
  } finally {
    await pool.end();
  }
})();
