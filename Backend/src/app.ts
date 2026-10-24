import express from "express";
import cors from "cors";
import { monitorRouter } from "./routes/monitors.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { proxyRouter } from "./routes/proxy.routes.js";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/monitors", monitorRouter);
app.use("/api/proxy", proxyRouter);

// Unknown /api routes must return a JSON 404, never the frontend HTML.
app.use("/api", (req, res) => {
  res.status(404).json({
    error: "Not found",
    method: req.method,
    path: req.originalUrl,
  });
});

const frontendDist = fileURLToPath(
  new URL("../../Frontend/dist", import.meta.url),
);

// Only serve the built frontend in production. In development Vite serves the
// UI on :5173, so a leftover Frontend/dist (from npm run build) must not
// change how the API on :5000 responds.
const hasFrontendBuild =
  process.env.NODE_ENV === "production" &&
  existsSync(`${frontendDist}/index.html`);

if (hasFrontendBuild) {
  // index: false stops express.static from auto-serving index.html for "/"
  // regardless of the Accept header. Page loads are handled below instead.
  app.use(express.static(frontendDist, { index: false }));

  // Serve the React entry point ONLY for real browser page loads
  // (GET/HEAD that accept text/html), e.g. a refresh on /api-tester.
  // API clients such as the API Tester send Accept: application/json
  // (or no text/html at all), so they fall through to the JSON 404 below.
  app.use((req, res, next) => {
    const isPageRequest =
      (req.method === "GET" || req.method === "HEAD") &&
      (req.headers.accept ?? "").includes("text/html");

    if (!isPageRequest) {
      next();
      return;
    }

    res.sendFile(`${frontendDist}/index.html`, (error) => {
      if (error) next(error);
    });
  });
} else {
  app.get("/", (_req, res) => {
    res.json({ message: "Monitorly API is running" });
  });
}

// Final fallback: any other unmatched request gets a JSON 404.
app.use((req, res) => {
  res.status(404).json({
    error: "Not found",
    method: req.method,
    path: req.originalUrl,
  });
});

export default app;