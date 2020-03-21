import express from "express";
import {
    Create as CreateController,
    
} from "./controllers";

const router: express.Router = express.Router();

router.post("/create", CreateController);


export default router;