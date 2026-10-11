import { Router } from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/authController.js";

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
