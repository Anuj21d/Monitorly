import type { Response, Request } from "express";

/**
 * @name registerUserController
 * @description Register a new user using username, email, and password
 * @access Public
 */

async function registerUserController(res: Response, req: Request) {}

/**
 * @name loginUserController
 * @description Authenticate a user using email and password and generate an access token
 * @access Public
 */

async function loginUserController(res: Response, req: Request) {}

export { registerUserController, loginUserController };
