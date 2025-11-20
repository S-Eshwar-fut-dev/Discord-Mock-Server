import { Router } from "express";
import { v4 as uuid } from "uuid";
import { SESSIONS, USERS } from "../mock/data";

const router = Router();

// signup (simple): body { username }
router.post("/signup", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "username required" });
  const id = uuid();
  const user = {
    id,
    username,
    discriminator: Math.floor(1000 + Math.random() * 9000).toString(),
    avatar: null,
  };
  USERS[id] = user;
  const token = uuid();
  SESSIONS[token] = { userId: id, token };
  res.json({ user, token });
});

// login (accept any username for mock): returns token
router.post("/login", (req, res) => {
  const { username } = req.body;
  const user =
    Object.values(USERS).find((u) => u.username === username) ||
    Object.values(USERS)[0];
  const token = uuid();
  SESSIONS[token] = { userId: user.id, token };
  res.json({ token, user });
});

// me
router.get("/me", (req, res) => {
  const token = req.headers["authorization"]?.toString().replace("Bearer ", "");
  if (!token || !SESSIONS[token])
    return res.status(401).json({ error: "unauthorized" });
  const userId = SESSIONS[token].userId;
  res.json({ user: USERS[userId] });
});

export default router;
