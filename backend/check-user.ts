import pool from "./src/config/db.js";

async function checkUser() {
  try {
    const res = await pool.query("SELECT * FROM users WHERE email = $1", ["33raghavk33@gmail.com"]);
    console.log(res.rows[0]);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

checkUser();
