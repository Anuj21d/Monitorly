import type { Response, Request } from "express";
import pool from "../config/database.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

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

    const token = jwt.sign(
      {
        username: user.username,
        id: user.id,
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

async function logoutUserController(req: Request, res: Response) {}

export { registerUserController, loginUserController, logoutUserController };
