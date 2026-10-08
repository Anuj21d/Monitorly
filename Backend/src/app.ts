import express from "express";
import cors from "cors";
import { monitorRouter } from "./routes/monitors.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/monitors", monitorRouter);

app.get("/", (_req, res) => {
  res.json({
    message: "Monitorly API is running",
  });
});

export default app;
