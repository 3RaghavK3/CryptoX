import pool from "./src/config/db.js";
import bcrypt from "bcrypt";

async function resetPassword() {
  try {
    const email = "33raghavk33@gmail.com";
    const newPassword = "Password123!";
    
    // Hash the new password with the same cost factor (12) used in the app
    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    // Update the database
    await pool.query("UPDATE users SET password_hash = $1 WHERE email = $2", [passwordHash, email]);
    
    console.log(`Password for ${email} has been successfully reset to: ${newPassword}`);
  } catch (err) {
    console.error("Failed to reset password:", err);
  } finally {
    process.exit(0);
  }
}

resetPassword();
