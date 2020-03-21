import express from "express";
import {
    PostFile as PostFileController,
    CreateBucket as CreateBucketController,
} from "./controllers";

const router: express.Router = express.Router();

router.post("/createBucket", CreateBucketController);
router.get("/upload", PostFileController);

export default router;