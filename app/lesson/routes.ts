import express from "express";
import {
    Create as CreateController,
    Read as ReadController
} from "./controllers";

const router: express.Router = express.Router();

router.post("/create", CreateController);
router.get("/all", ReadController);
router.put()
export default router;