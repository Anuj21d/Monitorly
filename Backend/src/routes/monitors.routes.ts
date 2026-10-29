import { Router } from "express";

import {
  createMonitorController,
  getMonitorsController,
  getMonitorController,
  updateMonitorController,
  deleteMonitorController,
  pauseMonitorController,
  resumeMonitorController,
  getMonitorHistoryController,
} from "../controllers/monitorController.js";
import { authUser } from "../middleware/auth.middleware.js";

export const monitorRouter = Router();

monitorRouter.use(authUser);
/**
 * @route POST /api/monitors
 * @description Create a new monitor
 * @access Private
 */
// 2. Add the controller as the second argument
monitorRouter.post("/", createMonitorController);

/**
 * @route GET /api/monitors
 * @description Get all monitors
 * @access Private
 */
monitorRouter.get("/", getMonitorsController);

/**
 * @route GET /api/monitors/:id
 * @description Get a single monitor by ID
 * @access Private
 */
monitorRouter.get("/:id", getMonitorController);

/**
 * @route GET /api/monitors/:id/history
 * @description Get recent check history for a monitor
 * @access Private
 */
monitorRouter.get("/:id/history", getMonitorHistoryController);

/**
 * @route PUT /api/monitors/:id
 * @description Update an existing monitor
 * @access Private
 */
monitorRouter.put("/:id", updateMonitorController);

/**
 * @route DELETE /api/monitors/:id
 * @description Delete a monitor
 * @access Private
 */
monitorRouter.delete("/:id", deleteMonitorController);

/**
 * @route PATCH /api/monitors/:id/pause
 * @description Pause a monitor
 * @access Private
 */
monitorRouter.patch("/:id/pause", pauseMonitorController);

/**
 * @route PATCH /api/monitors/:id/resume
 * @description Resume a paused monitor
 * @access Private
 */
monitorRouter.patch("/:id/resume", resumeMonitorController);
