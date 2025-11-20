import { Router } from "express";
import { MESSAGES, USERS } from "../mock/data";
import { paginate } from "../utils/pagination";
import { v4 as uuid } from "uuid";

const router = Router();

/**
 * GET /api/messages?channelId=c-general&limit=50&cursor=<messageId>
 */
router.get("/", (req, res) => {
  const channelId = String(req.query.channelId || "");
  const limit = Number(req.query.limit || 50);
  const cursor = req.query.cursor?.toString();
  if (!channelId) return res.status(400).json({ error: "channelId required" });
  const messages = MESSAGES[channelId] || [];
  const { items, nextCursor, total } = paginate(messages, limit, cursor);
  res.json({ items, nextCursor, total });
});

// fallback create - server will also broadcast over WebSocket, but mock also accepts POST
router.post("/", (req, res) => {
  const { channelId, authorId, content } = req.body;
  if (!channelId || !authorId || !content)
    return res
      .status(400)
      .json({ error: "channelId, authorId, content required" });
  const msg = {
    id: uuid(),
    channelId,
    author: USERS[authorId] || Object.values(USERS)[0],
    content,
    createdAt: new Date().toISOString(),
  };
  MESSAGES[channelId] = MESSAGES[channelId] || [];
  MESSAGES[channelId].push(msg);
  // note: WS broker is separate; frontend can listen to WS for created message.
  res.status(201).json(msg);
});

export default router;
