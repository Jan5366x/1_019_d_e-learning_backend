import express from "express";
import {
    PostFile as PostFileController,
} from "./controllers";

const router: express.Router = express.Router();

router.get("/upload", PostFileController);

export default router;