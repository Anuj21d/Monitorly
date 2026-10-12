import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AuthUser } from "../types/auth.types.js";

/**
 * @name authUser
 * @description Verify the JWT stored in an HTTP-only cookie
 * @access Private
 */
export function authUser(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = req.cookies?.token;

  if (typeof token !== "string" || !token) {
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
      decoded.username.length === 0
    ) {
      res.status(401).json({
        message: "Invalid authentication token",
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
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: "Session expired. Please login again",
      });
      return;
    }

    res.status(401).json({
      message: "Invalid authentication token",
    });
  }
}
