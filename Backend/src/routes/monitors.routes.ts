import { Router } from "express";

export const monitorRouter = Router();

/**
 * @route POST /api/monitors
 * @description Create a new monitor
 * @access Private
 */

monitorRouter.post("");

/**
 * @route GET /api/monitors
 * @description Get all monitors
 * @access Private
 */

monitorRouter.get("");

/**
 * @route GET /api/monitors/:id
 * @description Get a single monitor by ID
 * @access Private
 */

monitorRouter.get("/:id");

/**
 * @route PUT /api/monitors/:id
 * @description Update an existing monitor
 * @access Private
 */

monitorRouter.put("/:id");

/**
 * @route DELETE /api/monitors/:id
 * @description Delete a monitor
 * @access Private
 */

monitorRouter.delete("/:id");

/**
 * @route PATCH /api/monitors/:id/pause
 * @description Pause a monitor
 * @access Private
 */

monitorRouter.patch("/:id/pause");

/**
 * @route PATCH /api/monitors/:id/resume
 * @description Resume a paused monitor
 * @access Private
 */

monitorRouter.patch("/:id/resume");
