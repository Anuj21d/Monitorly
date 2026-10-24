import express from "express";
import cors from "cors";
import axios from "axios";
import dns from "node:dns/promises";
import net from "node:net";

const app = express();
const HOST = "127.0.0.1";
const PORT = 42831;

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed."));
    },
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Monitorly Local Agent",
  });
});

function isPrivateOrLoopbackAddress(address: string): boolean {
  const normalized = address.toLowerCase().replace(/^::ffff:/, "");

  if (net.isIPv4(normalized)) {
    const [a, b] = normalized.split(".").map(Number);

    return (
      a === 10 ||
      a === 127 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254) ||
      a === 0
    );
  }

  if (net.isIPv6(normalized)) {
    return (
      normalized === "::1" ||
      normalized === "::" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      /^fe[89ab]/.test(normalized)
    );
  }

  return false;
}

app.post("/request", async (req, res) => {
  try {
    const { url, method = "GET", headers = {}, body } = req.body ?? {};

    if (typeof url !== "string" || !url.trim()) {
      res.status(400).json({ error: "A target URL is required." });
      return;
    }

    const target = new URL(url);

    if (!["http:", "https:"].includes(target.protocol)) {
      res.status(400).json({ error: "Only HTTP and HTTPS are supported." });
      return;
    }

    if (target.username || target.password) {
      res.status(400).json({
        error: "URLs must not contain embedded credentials.",
      });
      return;
    }

    const normalizedMethod = String(method).toUpperCase();
    const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD"];

    if (!allowedMethods.includes(normalizedMethod)) {
      res.status(400).json({ error: "Unsupported HTTP method." });
      return;
    }

    if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
      res.status(400).json({ error: "Headers must be an object." });
      return;
    }

    const hostname = target.hostname.replace(/^\[|\]$/g, "").toLowerCase();

    // Permit only the explicitly authorized local API target.
    const isAllowedLocalTarget =
      target.protocol === "http:" &&
      (hostname === "localhost" || hostname === "127.0.0.1") &&
      target.port !== "";

    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1"
    ) {
      if (!isAllowedLocalTarget) {
        res.status(403).json({
          error:
            "Local requests are restricted to http://localhost:5000 or http://127.0.0.1:5000.",
        });
        return;
      }
    } else {
      const addresses = net.isIP(hostname)
        ? [{ address: hostname }]
        : await dns.lookup(hostname, { all: true, verbatim: true });

      if (addresses.length === 0) {
        res.status(400).json({
          error: "The target host could not be resolved.",
        });
        return;
      }

      if (
        addresses.some(({ address }) => isPrivateOrLoopbackAddress(address))
      ) {
        res.status(403).json({
          error: "Private and local network targets are not allowed.",
        });
        return;
      }
    }

    const upstream = await axios({
      url: target.toString(),
      method: normalizedMethod,
      headers,
      data: ["GET", "HEAD"].includes(normalizedMethod) ? undefined : body,
      timeout: 10000,
      maxRedirects: 0,
      validateStatus: () => true,
      responseType: "text",
      transformResponse: [(data) => data],
    });

    res.status(200).json({
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
      body: normalizedMethod === "HEAD" ? "" : upstream.data,
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      res.status(502).json({
        error: "The target API request failed.",
        message:
          error.code === "ECONNABORTED"
            ? "The target API request timed out."
            : error.message,
      });
      return;
    }

    res.status(400).json({
      error: error instanceof Error ? error.message : "Invalid request.",
    });
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Monitorly Local Agent running at http://${HOST}:${PORT}`);
});
