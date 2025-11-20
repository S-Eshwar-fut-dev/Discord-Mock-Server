import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
const upload = multer({ dest: "uploads/" });
const router = Router();
router.post("/", upload.single("file"), (req, res) => {
    if (!req.file)
        return res.status(400).json({ error: "file required" });
    const url = `/uploads/${req.file.filename}${path.extname(req.file.originalname)}`;
    try {
        fs.renameSync(req.file.path, `uploads/${req.file.filename}${path.extname(req.file.originalname)}`);
    }
    catch (e) { }
    res.json({ url });
});
export default router;
//# sourceMappingURL=uploads.js.map