require("dotenv").config();
const m = require("mysql2/promise");
(async () => {
  const db = await m.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    ssl: { rejectUnauthorized: false },
  });
  const [r] = await db.query(
    `SELECT p.id, p.name, p.customization_type, p.customizable,
            LEFT(p.images, 140) img,
            (SELECT COUNT(*) FROM product_templates t
              WHERE t.product_id = p.id AND t.status='Active') tpls
     FROM products p
     WHERE p.name LIKE '%Letterhead%' OR p.name LIKE '%Notebook%'
        OR p.name LIKE '%Envelope%'`
  );
  r.forEach((x) =>
    console.log(JSON.stringify(x))
  );
  await db.end();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
