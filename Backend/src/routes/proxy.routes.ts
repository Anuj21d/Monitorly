import { Router } from "express";
import axios from "axios";

export const proxyRouter = Router();

proxyRouter.post("/", async (req, res) => {
  try {
    const { url, method = "GET", headers = {}, body } = req.body;

    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ error: "A target URL is required." });
      return;
    }

    const parsedUrl = new URL(url);

    if (parsedUrl.username || parsedUrl.password) {
      res.status(400).json({
        error: "URLs must not contain embedded credentials.",
      });
      return;
    }

    if (
      parsedUrl.hostname === "localhost" ||
      parsedUrl.hostname.endsWith(".localhost") ||
      parsedUrl.hostname === "127.0.0.1" ||
      parsedUrl.hostname === "::1"
    ) {
      res.status(403).json({
        error:
          "Local URLs are not supported by the external proxy. Use Local API Mode.",
      });
      return;
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      res.status(400).json({
        error: "Only HTTP and HTTPS URLs are supported.",
      });
      return;
    }

    const allowedMethods = [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ];

    const normalizedMethod = String(method).toUpperCase();

    if (!allowedMethods.includes(normalizedMethod)) {
      res.status(400).json({ error: "Unsupported HTTP method." });
      return;
    }

    if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
      res.status(400).json({ error: "Headers must be an object." });
      return;
    }

    const response = await axios({
      url: parsedUrl.toString(),
      method: normalizedMethod,
      headers,
      data: ["GET", "HEAD"].includes(normalizedMethod) ? undefined : body,
      timeout: 10000,
      validateStatus: () => true,
      maxRedirects: 0,
      responseType: "text",
      transformResponse: [(data) => data],
    });

    res.status(200).json({
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body: response.data,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      res.status(502).json({
        error: "Upstream request failed.",
        message:
          error.code === "ECONNABORTED"
            ? "The target API request timed out."
            : error.message,
      });
      return;
    }

    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid proxy request.",
    });
  }
});
