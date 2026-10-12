import express from "express";
import cors from "cors";
import { monitorRouter } from "./routes/monitors.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/monitors", monitorRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Monitorly API is running",
  });
});

export default app;
