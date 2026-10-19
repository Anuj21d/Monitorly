import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  googleAuthController,
  getMeController,
} from "../controllers/authController.js";
import { authUser } from "../middleware/auth.middleware.js";

export const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register", registerUserController);

/**
 * @route POST /api/auth/login
 * @description Authenticate a user and generate an access token
 * @access Public
 */

authRouter.post("/login", loginUserController);

/**
 * @route POST /api/auth/logout
 * @description Clear the authentication cookie to log out the user
 * @access Public
 */

authRouter.post("/logout", authUser, logoutUserController);

/**
 * @route POST /api/auth/google
 * @description Authenticate or register a user using Google OAuth
 * @access Public
 */

authRouter.post("/google", googleAuthController);

/**
 * @route GET /api/auth/me
 * @description Get Authenticated user info
 * @access Private
 */

authRouter.get("/me", authUser, getMeController);
