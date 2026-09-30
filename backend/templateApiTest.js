require("dotenv").config();
const pool = require("./config/db");
const API = "http://localhost:5000/api";

const run = async () => {
  const login = await (await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD }),
  })).json();
  const auth = { Authorization: `Bearer ${login.token}`, "Content-Type": "application/json" };
  console.log("login:", !!login.token);

  /* create template for product 1 */
  const c = await fetch(`${API}/products/1/templates`, {
    method: "POST", headers: auth,
    body: JSON.stringify({
      name: "Executive", status: "Active", sortOrder: 9,
      design: {
        frontDesign: { background: "#123456", gradient: "", backgroundImage: "", elements: [
          { type: "text", text: "YOUR NAME", x: 50, y: 40, width: 60, fontSize: 18, fontWeight: 700, color: "#fff", align: "center" },
          { type: "hack", text: "bad", x: 0, y: 0 },
        ]},
        backDesign: { background: "#123456", gradient: "", backgroundImage: "", elements: [] },
      },
    }),
  });
  const cj = await c.json();
  const tid = cj.template?.id;
  console.log("POST =>", c.status, "id:", tid, "els kept:", cj.template?.design?.frontDesign?.elements?.length);

  /* DB verify */
  const [row] = await pool.execute("SELECT id, product_id, name, status, sort_order FROM product_templates WHERE id=?", [tid]);
  console.log("DB row:", JSON.stringify(row[0]));

  /* deactivate + verify public */
  await fetch(`${API}/products/1/templates/${tid}`, {
    method: "PUT", headers: auth, body: JSON.stringify({ status: "Inactive" }),
  });
  const pub = await (await fetch(`${API}/products/1/templates`)).json();
  console.log("public after deactivate:", pub.templates.map(t => t.name).join(", "));

  /* cross-product protection: try editing prod1 template via prod2 path */
  const x = await fetch(`${API}/products/2/templates/${tid}`, {
    method: "PUT", headers: auth, body: JSON.stringify({ status: "Active" }),
  });
  console.log("cross-product PUT =>", x.status, "(expect 404)");

  /* delete */
  const d = await fetch(`${API}/products/1/templates/${tid}`, { method: "DELETE", headers: auth });
  console.log("DELETE =>", d.status);
  const [gone] = await pool.execute("SELECT id FROM product_templates WHERE id=?", [tid]);
  console.log("DB after delete:", gone.length ? "STILL EXISTS" : "removed");

  /* unauthenticated create must fail */
  const noauth = await fetch(`${API}/products/1/templates`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Hack" }),
  });
  console.log("POST no-auth =>", noauth.status, "(expect 401)");

  await pool.end();
  console.log("DONE");
};
run().catch((e) => { console.error("FAIL:", e.message); process.exit(1); });
