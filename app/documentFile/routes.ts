import express from "express";
import {
    PostFile as PostFileController,
    CreateBucket as CreateBucketController,
    GetFile as GetFileController,
    DeleteFile as DeleteFileController
} from "./controllers";

const router: express.Router = express.Router();

router.post("/bucket", CreateBucketController);
router.get("/file", GetFileController);
router.post("/file", PostFileController);
router.delete("/file", DeleteFileController);


export default router;