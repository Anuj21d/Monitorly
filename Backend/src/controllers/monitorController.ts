import type { Response, Request } from "express";
import pool from "../config/database.js";

/**
 * @name createMonitorController
 * @description Create a new monitor for the authenticated user
 * @access Private
 */

export async function createMonitorController(req: Request, res: Response) {
  try {
    const user = (
      req as Request & {
        user?: { id: number; username?: string };
      }
    ).user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const {
      name,
      url,
      method = "GET",
      frequency,
      timeout = 10,
      headers = {},
      queryParams = {},
      authType = "none",
      body,
      expectedStatus = 200,
      targetMode = "public",
      expiresAt = null,
    } = req.body;

    if (expiresAt !== null) {
      if (
        typeof expiresAt !== "string" ||
        Number.isNaN(Date.parse(expiresAt)) ||
        new Date(expiresAt).getTime() <= Date.now()
      ) {
        return res.status(400).json({
          message: "Expiration date must be a valid future date and time",
        });
      }
    }

    const formattedExpiresAt = expiresAt
      ? new Date(expiresAt).toISOString().slice(0, 19).replace("T", " ")
      : null;

    if (!["public", "local"].includes(targetMode)) {
      return res.status(400).json({
        message: "Target mode must be public or local",
      });
    }

    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({
        message: "Name is required and must be at most 100 characters",
      });
    }

    if (typeof url !== "string" || url.length > 500) {
      return res.status(400).json({
        message: "A valid URL is required",
      });
    }

    let parsedUrl: URL;

    try {
      parsedUrl = new URL(url);
    } catch {
      return res.status(400).json({
        message: "URL format is invalid",
      });
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return res.status(400).json({
        message: "Only HTTP and HTTPS URLs are supported",
      });
    }

    const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

    if (
      typeof method !== "string" ||
      !allowedMethods.includes(method.toUpperCase())
    ) {
      return res.status(400).json({
        message: "Unsupported HTTP method",
      });
    }

    if (!Number.isInteger(frequency) || frequency < 30 || frequency > 86400) {
      return res.status(400).json({
        message: "Frequency must be between 30 and 86400 seconds",
      });
    }

    if (!Number.isInteger(timeout) || timeout < 1 || timeout > 120) {
      return res.status(400).json({
        message: "Timeout must be between 1 and 120 seconds",
      });
    }

    if (
      !Number.isInteger(expectedStatus) ||
      expectedStatus < 100 ||
      expectedStatus > 599
    ) {
      return res.status(400).json({
        message: "Expected status must be between 100 and 599",
      });
    }

    const isStringRecord = (value: unknown): value is Record<string, string> =>
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.values(value).every((item) => typeof item === "string");

    if (!isStringRecord(headers) || !isStringRecord(queryParams)) {
      return res.status(400).json({
        message:
          "Headers and query parameters must be objects containing string values",
      });
    }

    // Do not persist credentials until encryption is configured.
    if (authType !== "none") {
      return res.status(501).json({
        message:
          "Authenticated monitors are not available until secure credential storage is configured",
      });
    }

    let requestBody: unknown = null;

    if (body !== undefined && body !== null && body !== "") {
      try {
        requestBody = typeof body === "string" ? JSON.parse(body) : body;

        // Confirm the value can be represented as JSON.
        JSON.stringify(requestBody);
      } catch {
        return res.status(400).json({
          message: "Request body must contain valid JSON",
        });
      }
    }

    const [result] = await pool.execute(
      `INSERT INTO monitors
 (
   user_id,
   name,
   url,
   method,
   frequency,
   timeout,
   headers,
   query_params,
   auth_type,
   auth_config,
   request_body,
   expected_status,
   target_mode,
   expires_at
 )
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        name.trim(),
        url,
        method.toUpperCase(),
        frequency,
        timeout,
        JSON.stringify(headers),
        JSON.stringify(queryParams),
        "none",
        null,
        requestBody === null ? null : JSON.stringify(requestBody),
        expectedStatus,
        targetMode,
        formattedExpiresAt,
      ],
    );

    const insertResult = result as { insertId: number };

    return res.status(201).json({
      message: "Monitor created successfully",
      monitor: {
        id: insertResult.insertId,
        name: name.trim(),
        url,
        targetMode,
        method: method.toUpperCase(),
        status: "healthy",
        responseTime: null,
        uptime: 100,
        frequency,
        timeout,
        lastChecked: null,
        headers,
        queryParams,
        authType: "none",
        body: requestBody,
        expectedStatus,
      },
    });
  } catch (error) {
    console.error("Create monitor error:", error);

    return res.status(500).json({
      message: "Failed to create monitor",
    });
  }
}

/**
 * @name getMonitorsController
 * @description Get all monitors belonging to the authenticated user
 * @access Private
 */

export async function getMonitorsController(req: Request, res: Response) {
  try {
    const user = (
      req as Request & {
        user?: { id: number; username?: string };
      }
    ).user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const [rows] = await pool.execute(
      `SELECT
        id,
        name,
        url,
        method,
        status,
        response_time AS responseTime,
        uptime,
        frequency,
        timeout,
        last_checked AS lastChecked,
        headers,
        query_params AS queryParams,
        auth_type AS authType,
        request_body AS body,
        expected_status AS expectedStatus,
        target_mode AS targetMode,
        expires_at AS expiresAt,
        created_at AS createdAt,
        updated_at AS updatedAt
       FROM monitors
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [user.id],
    );

    return res.status(200).json({
      monitors: rows,
    });
  } catch (error) {
    console.error("Get monitors error:", error);

    return res.status(500).json({
      message: "Failed to retrieve monitors",
    });
  }
}

/**
 * @name getMonitorController
 * @description Get a single monitor by its ID
 * @access Private
 */

export async function getMonitorController(req: Request, res: Response) {
  try {
    const user = (
      req as Request & {
        user?: { id: number; username?: string };
      }
    ).user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const monitorId = Number(req.params.id);

    if (!Number.isInteger(monitorId) || monitorId <= 0) {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    const [rows] = await pool.execute(
      `SELECT
        id,
        name,
        url,
        method,
        status,
        response_time AS responseTime,
        uptime,
        frequency,
        timeout,
        last_checked AS lastChecked,
        headers,
        query_params AS queryParams,
        auth_type AS authType,
        request_body AS body,
        expected_status AS expectedStatus,
        target_mode AS targetMode,
        expires_at AS expiresAt,
        created_at AS createdAt,
        updated_at AS updatedAt
       FROM monitors
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [monitorId, user.id],
    );

    const monitors = rows as Record<string, unknown>[];

    if (monitors.length === 0) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    return res.status(200).json({
      monitor: monitors[0],
    });
  } catch (error) {
    console.error("Get monitor error:", error);

    return res.status(500).json({
      message: "Failed to retrieve monitor",
    });
  }
}

/**
 * @name getMonitorHistoryController
 * @description Get recent check history for a monitor owned by the authenticated user
 * @access Private
 */
export async function getMonitorHistoryController(req: Request, res: Response) {
  try {
    const user = (
      req as Request & {
        user?: { id: number; username?: string };
      }
    ).user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const monitorId = Number(req.params.id);

    if (!Number.isInteger(monitorId) || monitorId <= 0) {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    const requestedLimit = Number(req.query.limit ?? 50);
    const limit = Number.isInteger(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 100)
      : 50;

    const [monitorRows] = await pool.execute(
      `SELECT id FROM monitors WHERE id = ? AND user_id = ? LIMIT 1`,
      [monitorId, user.id],
    );

    if ((monitorRows as Record<string, unknown>[]).length === 0) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    const [historyRows] = await pool.execute(
      `SELECT
         id,
         status,
         response_time AS responseTime,
         actual_status AS actualStatus,
         checked_at AS checkedAt
       FROM monitor_checks
       WHERE monitor_id = ?
       ORDER BY checked_at DESC, id DESC
       LIMIT ${limit}`,
      [monitorId],
    );

    return res.status(200).json({
      history: historyRows,
    });
  } catch (error) {
    console.error("Get monitor history error:", error);

    return res.status(500).json({
      message: "Failed to retrieve monitor history",
    });
  }
}

/**
 * @name updateMonitorController
 * @description Update an existing monitor by its ID
 * @access Private
 */

export async function updateMonitorController(req: Request, res: Response) {
  try {
    const user = (
      req as Request & {
        user?: { id: number; username?: string };
      }
    ).user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const monitorId = Number(req.params.id);

    if (!Number.isInteger(monitorId) || monitorId <= 0) {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    const [existingRows] = await pool.execute(
      `SELECT id, name, url, method, frequency, timeout,
        headers, query_params, request_body, expected_status,
        target_mode ,expires_at
        FROM monitors
       WHERE id = ? AND user_id = ?
       LIMIT 1`,
      [monitorId, user.id],
    );

    const existing = (existingRows as Record<string, unknown>[])[0];

    if (!existing) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    const input = req.body ?? {};

    const name = input.name ?? existing.name;
    const url = input.url ?? existing.url;
    const method = input.method ?? existing.method;
    const frequency = input.frequency ?? existing.frequency;
    const timeout = input.timeout ?? existing.timeout;
    const headers = input.headers ?? existing.headers ?? {};
    const queryParams = input.queryParams ?? existing.query_params ?? {};
    const body = input.body ?? existing.request_body;
    const expectedStatus = input.expectedStatus ?? existing.expected_status;

    const targetMode = input.targetMode ?? existing.target_mode;
    const expiresAt =
      input.expiresAt !== undefined ? input.expiresAt : existing.expires_at;

    const formattedExpiresAt =
      expiresAt === null
        ? null
        : new Date(expiresAt as string | Date)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

    if (expiresAt !== null) {
      const expirationTime =
        typeof expiresAt === "string"
          ? new Date(expiresAt).getTime()
          : expiresAt instanceof Date
            ? expiresAt.getTime()
            : Number.NaN;

      if (!Number.isFinite(expirationTime) || expirationTime <= Date.now()) {
        return res.status(400).json({
          message: "Expiration date must be a valid future date and time",
        });
      }
    }

    if (!["public", "local"].includes(targetMode)) {
      return res.status(400).json({
        message: "Target mode must be public or local",
      });
    }

    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
      return res.status(400).json({
        message: "Name is required and must be at most 100 characters",
      });
    }

    if (typeof url !== "string" || url.length > 500) {
      return res.status(400).json({
        message: "A valid URL is required",
      });
    }

    try {
      const parsedUrl = new URL(url);

      if (!["http:", "https:"].includes(parsedUrl.protocol)) {
        return res.status(400).json({
          message: "Only HTTP and HTTPS URLs are supported",
        });
      }
    } catch {
      return res.status(400).json({
        message: "URL format is invalid",
      });
    }

    const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

    if (
      typeof method !== "string" ||
      !allowedMethods.includes(method.toUpperCase())
    ) {
      return res.status(400).json({
        message: "Unsupported HTTP method",
      });
    }

    if (
      !Number.isInteger(Number(frequency)) ||
      Number(frequency) < 30 ||
      Number(frequency) > 86400
    ) {
      return res.status(400).json({
        message: "Frequency must be between 30 and 86400 seconds",
      });
    }

    if (
      !Number.isInteger(Number(timeout)) ||
      Number(timeout) < 1 ||
      Number(timeout) > 120
    ) {
      return res.status(400).json({
        message: "Timeout must be between 1 and 120 seconds",
      });
    }

    if (
      !Number.isInteger(Number(expectedStatus)) ||
      Number(expectedStatus) < 100 ||
      Number(expectedStatus) > 599
    ) {
      return res.status(400).json({
        message: "Expected status must be between 100 and 599",
      });
    }

    const isStringRecord = (value: unknown): value is Record<string, string> =>
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      Object.values(value).every((item) => typeof item === "string");

    const parseRecord = (value: unknown): Record<string, string> | null => {
      if (typeof value === "string") {
        try {
          value = JSON.parse(value);
        } catch {
          return null;
        }
      }

      return isStringRecord(value) ? value : null;
    };

    const parsedHeaders = parseRecord(headers);
    const parsedQueryParams = parseRecord(queryParams);

    if (!parsedHeaders || !parsedQueryParams) {
      return res.status(400).json({
        message:
          "Headers and query parameters must be objects containing string values",
      });
    }

    let requestBody: string | null = null;

    if (body !== null && body !== undefined && body !== "") {
      try {
        const parsedBody = typeof body === "string" ? JSON.parse(body) : body;

        requestBody = JSON.stringify(parsedBody);
      } catch {
        return res.status(400).json({
          message: "Request body must contain valid JSON",
        });
      }
    }

    const [result] = await pool.execute(
      `UPDATE monitors
       SET name = ?,
           url = ?,
           method = ?,
           frequency = ?,
           timeout = ?,
           headers = ?,
           query_params = ?,
           request_body = ?,
           expected_status = ?,
           target_mode = ?,
           expires_at = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [
        name.trim(),
        url,
        method.toUpperCase(),
        Number(frequency),
        Number(timeout),
        JSON.stringify(parsedHeaders),
        JSON.stringify(parsedQueryParams),
        requestBody,
        Number(expectedStatus),
        targetMode,
        formattedExpiresAt,
        monitorId,
        user.id,
      ],
    );

    const updateResult = result as { affectedRows: number };

    return res.status(200).json({
      message: "Monitor updated successfully",
      monitor: {
        id: monitorId,
        name: name.trim(),
        url,
        targetMode,
        method: method.toUpperCase(),
        frequency: Number(frequency),
        timeout: Number(timeout),
        headers: parsedHeaders,
        queryParams: parsedQueryParams,
        body: requestBody === null ? null : JSON.parse(requestBody),
        expectedStatus: Number(expectedStatus),
      },
      unchanged: updateResult.affectedRows === 0,
    });
  } catch (error) {
    console.error("Update monitor error:", error);

    return res.status(500).json({
      message: "Failed to update monitor",
    });
  }
}

/**
 * @name deleteMonitorController
 * @description Delete an existing monitor by its ID
 * @access Private
 */

export async function deleteMonitorController(req: Request, res: Response) {
  try {
    const user = (
      req as Request & {
        user?: { id: number; username?: string };
      }
    ).user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const monitorId = Number(req.params.id);

    if (!Number.isInteger(monitorId) || monitorId <= 0) {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    const [result] = await pool.execute(
      `DELETE FROM monitors
       WHERE id = ? AND user_id = ?`,
      [monitorId, user.id],
    );

    const deleteResult = result as { affectedRows: number };

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        message: "Monitor not found",
      });
    }

    return res.status(200).json({
      message: "Monitor deleted successfully",
      id: monitorId,
    });
  } catch (error) {
    console.error("Delete monitor error:", error);

    return res.status(500).json({
      message: "Failed to delete monitor",
    });
  }
}

/**
 * @name pauseMonitorController
 * @description Pause a monitor by its ID
 * @access Private
 */

export async function pauseMonitorController(req: Request, res: Response) {
  try {
    const user = (
      req as Request & {
        user?: { id: number; username?: string };
      }
    ).user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const monitorId = Number(req.params.id);

    if (!Number.isInteger(monitorId) || monitorId <= 0) {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    const [result] = await pool.execute(
      `UPDATE monitors
       SET status = 'paused',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [monitorId, user.id],
    );

    const updateResult = result as { affectedRows: number };

    if (updateResult.affectedRows === 0) {
      const [rows] = await pool.execute(
        `SELECT id, status
         FROM monitors
         WHERE id = ? AND user_id = ?
         LIMIT 1`,
        [monitorId, user.id],
      );

      if ((rows as unknown[]).length === 0) {
        return res.status(404).json({
          message: "Monitor not found",
        });
      }
    }

    return res.status(200).json({
      message: "Monitor paused successfully",
      id: monitorId,
      status: "paused",
    });
  } catch (error) {
    console.error("Pause monitor error:", error);

    return res.status(500).json({
      message: "Failed to pause monitor",
    });
  }
}

/**
 * @name resumeMonitorController
 * @description Resume a paused monitor by its ID
 * @access Private
 */

export async function resumeMonitorController(req: Request, res: Response) {
  try {
    const user = (
      req as Request & {
        user?: { id: number; username?: string };
      }
    ).user;

    if (!user?.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const monitorId = Number(req.params.id);

    if (!Number.isInteger(monitorId) || monitorId <= 0) {
      return res.status(400).json({
        message: "Invalid monitor ID",
      });
    }

    const [result] = await pool.execute(
      `UPDATE monitors
       SET status = 'healthy',
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ? AND status = 'paused'`,
      [monitorId, user.id],
    );

    const updateResult = result as { affectedRows: number };

    if (updateResult.affectedRows === 0) {
      const [rows] = await pool.execute(
        `SELECT id, status
         FROM monitors
         WHERE id = ? AND user_id = ?
         LIMIT 1`,
        [monitorId, user.id],
      );

      const monitors = rows as { id: number; status: string }[];

      if (monitors.length === 0) {
        return res.status(404).json({
          message: "Monitor not found",
        });
      }

      const monitor = monitors[0];

      if (monitor?.status !== "paused") {
        return res.status(400).json({
          message: "Monitor is not paused",
          status: monitor?.status,
        });
      }
    }

    return res.status(200).json({
      message: "Monitor resumed successfully",
      id: monitorId,
      status: "healthy",
    });
  } catch (error) {
    console.error("Resume monitor error:", error);

    return res.status(500).json({
      message: "Failed to resume monitor",
    });
  }
}
