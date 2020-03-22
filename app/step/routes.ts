import express from "express";
import { CreateStep, ReadAll, ReadById, DeleteById, UpdateById } from "./controllers/step-controllers";
import { CreateStepElement, UpdateStepElement, DeleteStepElement, ReadStepElementById } from "./controllers/step-element-controllers";

const router: express.Router = express.Router();

router.post("/", CreateStep);
router.get("/", ReadAll);
router.get("/:stepId", ReadById);
router.delete("/:stepId", DeleteById);
router.put("/:stepId", UpdateById);

router.post("/:stepId/stepelement", CreateStepElement);
router.get("/:stepId/stepelement/:stepElementId", ReadStepElementById);
router.put("/:stepId/stepelement/:stepElementId", UpdateStepElement);
router.delete("/:stepId/stepelement/:stepElementId", DeleteStepElement);

export default router;