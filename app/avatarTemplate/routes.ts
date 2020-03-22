import express from "express";
import avatarTemplates from "./templates/all";
const router = express.Router();

router.get("/", (req: express.Request, res: express.Response, next: Function) => {
    res.status(200).json({ message: "OK", templates: avatarTemplates.templates });
})

export default router;