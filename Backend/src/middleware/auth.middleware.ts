import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/database.js";
import type { AuthUser } from "../types/auth.types.js";

/**
 * Read the JWT from the httpOnly "token" cookie (browser) or, as a fallback,
 * from an "Authorization: Bearer <token>" header (API Tester, curl, Postman).
 */
function getTokenFromRequest(req: Request): string | undefined {
  const cookieToken = req.cookies?.token;

  if (typeof cookieToken === "string" && cookieToken) {
    return cookieToken;
  }

  const authorization = req.headers.authorization;

  if (typeof authorization === "string") {
    const [scheme, value] = authorization.trim().split(/\s+/);

    if (scheme?.toLowerCase() === "bearer" && value) {
      return value;
    }
  }

  return undefined;
}

/**
 * @name authUser
 * @description Verify the JWT and reject revoked tokens
 * @access Middleware
 */
export async function authUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = getTokenFromRequest(req);

  if (!token) {
    res.status(401).json({
      message: "Authentication required",
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET is not configured");

    res.status(500).json({
      message: "Server configuration error",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "number" ||
      !Number.isSafeInteger(decoded.id) ||
      decoded.id <= 0 ||
      typeof decoded.username !== "string" ||
      decoded.username.length === 0 ||
      typeof decoded.jti !== "string" ||
      typeof decoded.exp !== "number"
    ) {
      res.status(401).json({
        message: "Invalid authentication token",
      });
      return;
    }

    // Check whether this token has been revoked.
    const [rows] = await pool.execute(
      `SELECT jti
       FROM revoked_tokens
       WHERE jti = ?
       LIMIT 1`,
      [decoded.jti],
    );

    if (Array.isArray(rows) && rows.length > 0) {
      res.status(401).json({
        message: "Token has been revoked. Please log in again.",
      });
      return;
    }

    const user: AuthUser = {
      id: decoded.id,
      username: decoded.username,
    };

    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: "Invalid or expired authentication token",
      });
      return;
    }

    console.error("Authentication middleware error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
}