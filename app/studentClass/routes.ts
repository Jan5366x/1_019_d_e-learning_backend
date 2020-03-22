import express from "express";
import {
    Create as CreateController,
    ReadAll as ReadAllController,
    ReadById as ReadByIdController,
    ReadByName as ReadByNameController,
    Update as UpdateController,
    Delete as DeleteController
} from "./controllers";

const router: express.Router = express.Router();

//GET ROUTES
router.get("/", ReadAllController);
router.get("/oneById/:id", ReadByIdController);
router.get("/oneByName/:name", ReadByNameController);

//POST ROUTES
router.post("/create", CreateController);

//PUT ROUTES
router.put("/:id", UpdateController); 

//DELETE ROUTES
router.delete("/:id", DeleteController);

export default router; 