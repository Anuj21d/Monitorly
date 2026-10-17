import type { Response, Request } from "express";
import pool from "../config/database.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import {
  googleAuthSchema,
  loginSchema,
  registerSchema,
} from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { verifyGoogleCode } from "../services/googleAuthServiece.js";
import { findGoogleUser } from "../services/findGoogleUser.js";
import { createGoogleUser } from "../services/createGoogleUser.js";
import z from "zod";

/**
 * @name registerUserController
 * @description Register a new user using username, email, and password
 * @access Public
 */

async function registerUserController(req: Request, res: Response) {
  try {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid registration data",
        errors: validation.error.issues,
      });
    }

    const { username, email, password } = validation.data;

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    if (rows.length > 0) {
      return res.status(409).json({
        message: "Account Already Exists With this email",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (username , email , password ) VALUES (?,?,?)",
      [username, email, hashPassword],
    );

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const jti = randomUUID();

    const token = jwt.sign(
      {
        id: result.insertId,
        username,
        jti,
      },
      jwtSecret,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000,
    });

    res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: result.insertId,
        username,
        email,
      },
    });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      typeof error.code === "string" &&
      error.code === "ER_DUP_ENTRY"
    ) {
      return res.status(409).json({
        message: "Account already exists with this email",
      });
    }

    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

/**
 * @name loginUserController
 * @description Authenticate a user using email and password and generate an access token
 * @access Public
 */

async function loginUserController(req: Request, res: Response) {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Invalid login data",
        errors: validation.error.issues,
      });
    }

    const { email, password } = validation.data;

    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT id , username , email , password FROM users WHERE email = ? LIMIT 1",
      [email],
    );

    const user = rows[0];

    if (!user) {
      return res.status(401).json({
        message: "Invalid Email or Password",
      });
    }

    const isPasswordVaild = await bcrypt.compare(password, user.password);

    if (!isPasswordVaild) {
      return res.status(401).json({
        massage: "Invalid Email or Password",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const jti = randomUUID();

    const token = jwt.sign(
      {
        username: user.username,
        id: user.id,
        jti,
      },
      jwtSecret,
      {
        expiresIn: "1d",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400000,
    });

    res.status(200).json({
      message: "User Login Successfully",
      user: {
        username: user.username,
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

/**
 * @name logoutUserController
 * @description Log out the current user by clearing the authentication cookie
 * @access Public
 */

async function logoutUserController(req: Request, res: Response) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
  };

  const token = req.cookies?.token;

  if (typeof token !== "string" || !token) {
    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      message: "User logged out successfully",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured");

    return res.status(500).json({
      message: "Server configuration error",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.jti !== "string" ||
      typeof decoded.exp !== "number"
    ) {
      res.clearCookie("token", cookieOptions);

      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    const expiresAt = new Date(decoded.exp * 1000);

    await pool.execute(
      `INSERT INTO revoked_tokens (jti, expires_at)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE jti = VALUES(jti)`,
      [decoded.jti, expiresAt],
    );

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.clearCookie("token", cookieOptions);

      return res.status(200).json({
        message: "User logged out successfully",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.clearCookie("token", cookieOptions);

      return res.status(200).json({
        message: "User logged out successfully",
      });
    }

    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
}

/**
 * @controller googleAuthController
 * @description Verify Google authorization code and authenticate the user
 * @access Public
 */

const googleAuthController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const result = googleAuthSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Invalid request data",
        errors: result.error.flatten(),
      });
      return;
    }

    const { code } = result.data;

    // 1. Verify Google's authorization code.
    const googleUser = await verifyGoogleCode(code);

    if (!googleUser.emailVerified) {
      res.status(403).json({
        message: "Please use a verified Google email",
      });
      return;
    }

    // 2. Check whether this Google identity already exists.
    let user = await findGoogleUser(googleUser.sub);

    if (!user) {
      // 3. Check for an existing account with the same email.
      const [rows] = await pool.execute(
        "SELECT id FROM users WHERE email = ? LIMIT 1",
        [googleUser.email],
      );

      if ((rows as unknown[]).length > 0) {
        res.status(409).json({
          message:
            "An account with this email already exists. Sign in to that account before linking Google.",
        });
        return;
      }

      const usernameSchema = z.string().trim().min(1);

      const username = usernameSchema.parse(
        googleUser.name?.trim() ||
          googleUser.email.split("@")[0] ||
          "Google User",
      );

      // 4. Create a new Monitorly user and link Google.
      user = await createGoogleUser({
        username,
        email: googleUser.email,
        googleSub: googleUser.sub,
      });
    }

    // 5. Issue a Monitorly JWT.
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const jti = randomUUID();

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        jti,
      },
      secret,
      { expiresIn: "1d" },
    );

    // 6. Set the authentication cookie.
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Google authentication successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Google authentication error:", error);

    res.status(500).json({
      message: "Google authentication failed",
    });
  }
};

export {
  registerUserController,
  loginUserController,
  logoutUserController,
  googleAuthController,
};
