const fs = require("fs");
const { Pool } = require("pg");

const envText = fs.readFileSync(".env.local", "utf8");

const match = envText.match(
  /^\s*DATABASE_URL\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\r\n#]+))/m
);

if (!match) {
  throw new Error("DATABASE_URL not found in .env.local");
}

const DATABASE_URL = (match[1] || match[2] || match[3]).trim();

const pool = new Pool({
  connectionString: DATABASE_URL
});

const adminName = "مدير المركز";

const items = {
  1: {
    title_ar: "جلسة إرشاد أسري فردية",
    title_fr: "Séance individuelle d'accompagnement familial",
    description_ar:
      "جلسة دعم نفسي وإرشاد أسري فردية مع مختص مرافقة نفسية لمساعدتك على تجاوز الصعوبات الأسرية.",
    description_fr:
      "Séance individuelle de soutien psychologique et d'accompagnement familial avec un spécialiste.",
    location: "مقر المركز - بئر خادم، الجزائر",
    price: "حسب الاتفاق"
  },

  2: {
    title_ar: "دورة تدريبية: مهارات التواصل الأسري",
    title_fr: "Formation : Compétences de communication familiale",
    description_ar:
      "برنامج تدريبي عملي لتطوير مهارات التواصل الفعال داخل الأسرة.",
    description_fr:
      "Programme pratique pour développer des compétences de communication efficace en famille."
  },

  3: {
    title_ar:
      "برنامج تعليمي: مرافقة نفسية للمراهقين",
    title_fr:
      "Programme éducatif : Accompagnement psychologique des adolescents",
    description_ar:
      "برنامج تعليمي متكامل موجه للآباء، لفهم ومرافقة أبنائهم المراهقين نفسيًا.",
    description_fr:
      "Un programme éducatif complet destiné aux parents pour accompagner leurs adolescents."
  },

  4: {
    title_ar:
      "ملتقى: الأسرة الجزائرية وتحديات العصر",
    title_fr:
      "Colloque : La famille algérienne et les défis de l'époque",
    description_ar:
      "ملتقى وطني يجمع مختصين في علم النفس الأسري لمناقشة تحديات الأسرة المعاصرة.",
    description_fr:
      "Un colloque national réunissant des spécialistes en psychologie familiale.",
    location:
      "مقر المركز - بئر خادم، الجزائر العاصمة",
    price: "مجاني"
  }
};

async function main() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("");
    console.log("========================================");
    console.log("EILAF DATABASE DATA RESTORATION");
    console.log("========================================");
    console.log("");

    // Admin
    await client.query(
      `UPDATE admins SET name = $1 WHERE id = 1`,
      [adminName]
    );

    console.log("admins.name [1] -> مدير المركز");

    // Items
    for (const [id, data] of Object.entries(items)) {
      for (const [field, value] of Object.entries(data)) {
        await client.query(
          `UPDATE items
           SET ${field} = $1,
               updated_at = NOW()
           WHERE id = $2`,
          [value, Number(id)]
        );

        console.log(`items.${field} [${id}] -> ${value}`);
      }
    }

    await client.query("COMMIT");

    console.log("");
    console.log("========================================");
    console.log("RESTORATION COMPLETED SUCCESSFULLY");
    console.log("========================================");
    console.log("");

  } catch (error) {
    await client.query("ROLLBACK");

    console.error("");
    console.error("RESTORATION FAILED");
    console.error(error);
    console.error("");

  } finally {
    client.release();
    await pool.end();
  }
}

main();
