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
const FRONT = process.env.FRONTEND_ORIGIN ?? "http://localhost:3001";
app.use(cors({ origin: [FRONT, "http://localhost:3001"] }));
app.use(json());
// simple health route
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));
// api routes
app.use("/routes/auth", authRoutes);
app.use("/routes/guilds", guildRoutes);
app.use("/routes/channels", channelRoutes);
app.use("/routes/messages", messageRoutes);
app.use("/routes/uploads", uploadRoutes);
export default app;
//# sourceMappingURL=app.js.map