const fs = require("fs");
const { Pool } = require("pg");

const envPath = ".env.local";

if (!fs.existsSync(envPath)) {
  throw new Error("لم يتم العثور على .env.local");
}

const envText = fs.readFileSync(envPath, "utf8");

const match = envText.match(
  /^\s*DATABASE_URL\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\r\n#]+))/m
);

if (!match) {
  throw new Error("لم يتم العثور على DATABASE_URL داخل .env.local");
}

const DATABASE_URL = (match[1] || match[2] || match[3]).trim();

const pool = new Pool({
  connectionString: DATABASE_URL
});

function repair(text) {
  if (text == null || typeof text !== "string") return text;

  let result = text;

  for (let i = 0; i < 3; i++) {
    if (!/[طظأإؤئءة©…™šœž]|â|Ã|Â|ð|ï/.test(result)) {
      break;
    }

    try {
      const repaired = Buffer.from(result, "latin1").toString("utf8");

      if (!repaired || repaired === result) {
        break;
      }

      result = repaired;
    } catch {
      break;
    }
  }

  return result;
}

function looksCorrupted(value) {
  if (typeof value !== "string") return false;

  return (
    /ظ[^\s]|ط[^\s]|â|Ã|Â|ð|ï|أ©|أ®|أ©|ط§|ظ„|ظ…|ط±/.test(value)
  );
}

async function main() {
  const client = await pool.connect();

  try {
    console.log("");
    console.log("========================================");
    console.log("EILAF DATABASE UTF-8 REPAIR");
    console.log("========================================");
    console.log("");

    await client.query("BEGIN");

    await client.query(`
      CREATE TEMP TABLE backup_admins AS
      SELECT * FROM admins
    `);

    await client.query(`
      CREATE TEMP TABLE backup_items AS
      SELECT * FROM items
    `);

    console.log("Temporary backup created successfully.");
    console.log("");

    let repairedCount = 0;

    // ================================
    // ADMINS
    // ================================

    const admins = await client.query(`
      SELECT id, name
      FROM admins
      WHERE name IS NOT NULL
    `);

    for (const row of admins.rows) {
      if (!looksCorrupted(row.name)) continue;

      const repaired = repair(row.name);

      if (repaired !== row.name && !looksCorrupted(repaired)) {
        await client.query(
          `UPDATE admins SET name = $1 WHERE id = $2`,
          [repaired, row.id]
        );

        console.log(`admins.name [${row.id}]`);
        console.log(`  OLD: ${row.name}`);
        console.log(`  NEW: ${repaired}`);
        console.log("");

        repairedCount++;
      }
    }

    // ================================
    // ITEMS
    // ================================

    const items = await client.query(`
      SELECT
        id,
        title_ar,
        title_fr,
        description_ar,
        description_fr,
        location,
        price
      FROM items
    `);

    const fields = [
      "title_ar",
      "title_fr",
      "description_ar",
      "description_fr",
      "location",
      "price"
    ];

    for (const row of items.rows) {
      for (const field of fields) {
        const oldValue = row[field];

        if (!looksCorrupted(oldValue)) continue;

        const newValue = repair(oldValue);

        if (
          newValue !== oldValue &&
          !looksCorrupted(newValue)
        ) {
          await client.query(
            `UPDATE items
             SET ${field} = $1,
                 updated_at = NOW()
             WHERE id = $2`,
            [newValue, row.id]
          );

          console.log(`items.${field} [${row.id}]`);
          console.log(`  OLD: ${oldValue}`);
          console.log(`  NEW: ${newValue}`);
          console.log("");

          repairedCount++;
        }
      }
    }

    await client.query("COMMIT");

    console.log("========================================");
    console.log(`Repaired values: ${repairedCount}`);
    console.log("========================================");
    console.log("");
    console.log("Database repair completed.");
    console.log("");

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("");
    console.error("REPAIR FAILED");
    console.error(error);
    console.error("");

  } finally {
    client.release();
    await pool.end();
  }
}

main();
