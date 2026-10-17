import pool from "../config/database.js";

interface CreateGoogleUserInput {
  username: string;
  email: string;
  googleSub: string;
}

export async function createGoogleUser(input: CreateGoogleUserInput) {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Create the Monitorly user.
    const [userResult] = await connection.execute(
      `INSERT INTO users (username, email, password)
       VALUES (?, ?, NULL)`,
      [input.username, input.email],
    );

    const userId = (userResult as { insertId: number }).insertId;

    // Link the Google account to the Monitorly user.
    await connection.execute(
      `INSERT INTO user_identities
       (user_id, provider, provider_user_id)
       VALUES (?, ?, ?)`,
      [userId, "google", input.googleSub],
    );

    await connection.commit();

    return {
      id: userId,
      username: input.username,
      email: input.email,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
