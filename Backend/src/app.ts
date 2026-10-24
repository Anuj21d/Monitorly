import express from "express";
import cors from "cors";
import { monitorRouter } from "./routes/monitors.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import { proxyRouter } from "./routes/proxy.routes.js";

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

app.get("/", (_req, res) => {
  res.json({
    message: "Monitorly API is running",
  });
});

export default app;
