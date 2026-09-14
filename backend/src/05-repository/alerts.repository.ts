import pool from "../config/db.js";

export const addAlert = async (
  userId: number,
  coinId: string,
  type: string,
  price: number
) => {
  const query = `
    INSERT INTO alert_coins (user_id, coin_id, type, price, created_at)
    VALUES ($1, $2, $3, $4, NOW());
  `;
  await pool.query(query, [userId, coinId, type, price]);
};

export const updateAlert = async (
  userId: number,
  coinId: string,
  type: string,
  price: number
) => {
  const query = `
    UPDATE alert_coins
    SET price = $4
    WHERE user_id = $1 AND coin_id = $2 AND type = $3;
  `;
  const result = await pool.query(query, [userId, coinId, type, price]);
  return (result.rowCount ?? 0) > 0;
};

export const deleteAlert = async (
  userId: number,
  coinId: string,
  type: string
) => {
  const query = `
    DELETE FROM alert_coins
    WHERE user_id = $1 AND coin_id = $2 AND type = $3;
  `;
  const result = await pool.query(query, [userId, coinId, type]);
  return (result.rowCount ?? 0) > 0;
};

export const getAlertsForUser = async (userId: number) => {
  const query = `
    SELECT 
      a.coin_id, a.type, a.price, a.created_at, a.status,
      c.name as coin_name, c.symbol as coin_symbol, c.image_url as coin_image, c.current_price, c.price_change_percentage_24h
    FROM alert_coins a
    JOIN coins c ON a.coin_id = c.coin_id
    WHERE a.user_id = $1
    ORDER BY a.created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const processSatisfiedAlerts = async () => {
  const client = await pool.connect();
  
  await client.query("BEGIN");

  try {
    const { rows: alerts } = await client.query(`
      SELECT a.user_id, a.coin_id, a.type, a.price as target_price, c.current_price
      FROM alert_coins a
      JOIN coins c ON a.coin_id = c.coin_id
      WHERE a.status = 'ACTIVE' AND (
        (a.type = 'PRICE_ABOVE' AND c.current_price >= a.price)
        OR
        (a.type = 'PRICE_BELOW' AND c.current_price <= a.price)
      )
    `);

    const insertedNotifications = [];

    for (const alert of alerts) {
      const res = await client.query(
        `INSERT INTO notifications
         (user_id, coin_id, notification_type, status, created_at)
         VALUES ($1, $2, $3, 'PENDING', NOW())
         RETURNING *`,
        [alert.user_id, alert.coin_id, alert.type]
      );
      if (res.rows.length > 0) {
        const notif = res.rows[0];
        notif.target_price = alert.target_price;
        notif.current_price = alert.current_price;
        insertedNotifications.push(notif);
      }
    }

    for (const alert of alerts) {
      await client.query(
        `UPDATE alert_coins
         SET status = 'COMPLETED'
         WHERE user_id = $1
           AND coin_id = $2
           AND type = $3`,
        [alert.user_id, alert.coin_id, alert.type]
      );
    }

    await client.query("COMMIT");
    // We don't need to return them here anymore, we'll fetch all unsent separately
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

export const getUnsentNotifications = async () => {
  const query = `
    SELECT 
      n.id as notification_id, 
      n.user_id, 
      n.coin_id, 
      n.notification_type, 
      c.current_price, 
      a.price as target_price
    FROM notifications n
    JOIN coins c ON n.coin_id = c.coin_id
    JOIN alert_coins a ON n.user_id = a.user_id AND n.coin_id = a.coin_id AND n.notification_type = a.type
    WHERE n.status IN ('PENDING', 'FAILED')
  `;
  const res = await pool.query(query);
  return res.rows;
};

export const updateNotificationStatus = async (notificationId: number, status: string) => {
  const query = `
    UPDATE notifications
    SET status = $2
    WHERE notification_id = $1
  `;
  await pool.query(query, [notificationId, status]);
};
