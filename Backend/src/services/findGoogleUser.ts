import pool from "../config/database.js";

interface GoogleUser {
  id: number;
  username: string;
  email: string;
}

export async function findGoogleUser(
  googleSub: string,
): Promise<GoogleUser | null> {
  const [rows] = await pool.execute(
    `SELECT u.id, u.username, u.email
     FROM users u
     INNER JOIN user_identities ui ON ui.user_id = u.id
     WHERE ui.provider = ? AND ui.provider_user_id = ?
     LIMIT 1`,
    ["google", googleSub],
  );

  const users = rows as GoogleUser[];

  return users[0] ?? null;
}
