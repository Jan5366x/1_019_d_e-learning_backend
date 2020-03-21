import express from "express";
import {
    Create as CreateController,
    ReadAll as ReadAllController,
    ReadById as ReadByIdController,
    ReadByTitle as ReadByTitleController,
    Update as UpdateController,
    Delete as DeleteController
} from "./controllers";

const router: express.Router = express.Router();

//GET ROUTES
router.get("/", ReadAllController);
router.get("/:id", ReadByIdController);
router.get("/one/:title", ReadByTitleController);

//POST ROUTES
router.post("/create", CreateController);

//PUT ROUTES
router.put("/:id", UpdateController); 

//DELETE ROUTES
router.delete("/:id", DeleteController);

export default router;