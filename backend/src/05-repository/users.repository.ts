import pool from "../config/db.js";

export const updatePreferredCurrency = async (userId: number, currency: string) => {
  const result = await pool.query(
    `UPDATE users SET preferred_currency = $1 WHERE user_id = $2 RETURNING user_id, name, email, preferred_currency;`,
    [currency, userId]
  );
  return result.rows[0];
};

export const getUserSettings = async (userId: number) => {
  const result = await pool.query(
    `SELECT user_id, name, email, preferred_currency FROM users WHERE user_id = $1;`,
    [userId]
  );
  return result.rows[0];
};
