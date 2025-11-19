import express from "express";
import cors from "cors";
import { json } from "body-parser";
import authRoutes from "./routes/auth";
import guildRoutes from "./routes/guilds";
import channelRoutes from "./routes/channels";
import messageRoutes from "./routes/messages";
import uploadRoutes from "./routes/uploads";

const app = express();

// CORS - allow frontend dev origin via env
const FRONT = process.env.FRONTEND_ORIGIN ?? "http://localhost:3000";
app.use(cors({ origin: [FRONT, "http://localhost:3000"] }));
app.use(json());

// simple health route
app.get("/health", (req, res) =>
  res.json({ status: "ok", uptime: process.uptime() })
);

// api routes
app.use("/api/auth", authRoutes);
app.use("/api/guilds", guildRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/uploads", uploadRoutes);

export default app;
