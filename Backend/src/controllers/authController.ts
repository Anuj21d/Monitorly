import type { Response, Request } from "express";
import pool from "../config/database.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import { registerSchema } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";

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

    const token = jwt.sign(
      {
        id: result.insertId,
        username,
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
      maxAge: 3600000,
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

async function loginUserController(res: Response, req: Request) {}

export { registerUserController, loginUserController };
