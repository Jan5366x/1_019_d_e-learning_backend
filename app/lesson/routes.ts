import express from "express";
import {
    Create as CreateController,
    ReadAll as ReadAllController,
    ReadById as ReadByIdController,
    ReadByTitle as ReadByTitleController,
    ReadByDate as ReadByDateController,
    ReadByDateStartEnd as ReadByDateStartEndController,
    Update as UpdateController,
    Delete as DeleteController
} from "./controllers";

const router: express.Router = express.Router();

//GET ROUTES
router.get("/", ReadAllController);
router.get("/oneById/:id", ReadByIdController);
router.get("/oneByTitle/:title", ReadByTitleController);
router.get("/oneByDate/:date", ReadByDateController)
router.get("/byStartAndEnd/:startDate/:endDate", ReadByDateStartEndController)

//POST ROUTES
router.post("/create", CreateController);

//PUT ROUTES
router.put("/:id", UpdateController); 

//DELETE ROUTES
router.delete("/:id", DeleteController);

export default router;