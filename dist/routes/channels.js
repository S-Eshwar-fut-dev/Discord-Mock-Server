import { Router } from "express";
import { CHANNELS } from "../mock/data";
const router = Router();
router.get("/", (req, res) => {
    const guildId = req.query.guildId?.toString();
    if (guildId) {
        res.json(CHANNELS.filter((c) => c.guildId === guildId));
    }
    else {
        res.json(CHANNELS);
    }
});
router.post("/", (req, res) => {
    const { guildId, name, type } = req.body;
    if (!name)
        return res.status(400).json({ error: "name required" });
    const id = `c-${Date.now()}`;
    const c = { id, guildId: guildId ?? null, name, type: type ?? "text" };
    CHANNELS.push(c);
    res.status(201).json(c);
});
export default router;
//# sourceMappingURL=channels.js.map