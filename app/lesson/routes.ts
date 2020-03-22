import express from "express";
import {
    Create as CreateController,
    ReadAll as ReadAllController,
    ReadById as ReadByIdController,
    ReadByTitle as ReadByTitleController,
    Update as UpdateController,
    Delete as DeleteController
} from "./lessonController";

const router: express.Router = express.Router();

//GET ROUTES
router.get("/", ReadAllController);
router.get("/oneById/:id", ReadByIdController);
router.get("/oneByTitle/:title", ReadByTitleController);

//POST ROUTES
router.post("/", CreateController);

//PUT ROUTES
router.put("/:id", UpdateController);

//DELETE ROUTES
router.delete("/:id", DeleteController);

import {
    GetAll as PlannedGetAllController,
    GetBetween as PlannedGetBetweenController,
    GetById as PlannedGetByIDController,
    Create as PlannedCreateController
} from "./plannedLessonController"

const plannedRouter = express.Router();

router.use("/planned", plannedRouter)

// GET ROUTES
plannedRouter.get("/", PlannedGetAllController)
plannedRouter.get("/:startDate/:endDate", PlannedGetBetweenController)
plannedRouter.get("/:_id", PlannedGetByIDController)

// POST ROUTES
plannedRouter.post("/", PlannedCreateController)
export default router;