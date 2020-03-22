import { RequestHandler, Request, Response } from "express";
import StepElement, { IStepElement } from "../models/step-element";
import mongoose from "mongoose";
import ExpressError from "../../classes/ExpressError";
import Step from "../models/step";
import Quiz from "../../quizs/models/Quiz";

const CreateStepElement: RequestHandler = async (req: Request, res: Response, next: Function) => {

    const result = await Quiz.findById(req.body.quiz).exec();
    if(result == null) {
        return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ_QUIZ"));
    }
    const stepElement: IStepElement = new StepElement({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        quiz: result
    });

    stepElement.save(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_CREATED", err.message, 500));
        }
        Step.findByIdAndUpdate(
            req.params.stepId,
            { $push: { elements: stepElement._id } }
        ).exec(function(err: Error) {
            if (err) {
                return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
            }
            res.status(200).json({ message: "OK", doc: stepElement });
        });
    });
};

const UpdateStepElement: RequestHandler = async (req: Request, res: Response, next: Function) => {
    const result = await Quiz.findById(req.body.quiz).exec();
    if(result == null) {
        return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ_QUIZ"));
    }
    StepElement.findByIdAndUpdate(
        req.params.stepElementId,
        { title: req.body.title, quiz: result?.id }
    ).exec(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
        }
        res.status(200).json({ message: "OK" });
    });
};

const ReadStepElementById: RequestHandler = (req: Request, res: Response, next: Function) => {
    StepElement.findById(
        req.params.stepElementId
    ).populate("quiz").exec(function(err, doc) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
        }
        res.status(200).json({ message: "OK", doc });
    });
};

const DeleteStepElement: RequestHandler = (req: Request, res: Response, next: Function) => {
    StepElement.findByIdAndDelete(
        req.params.stepElementId
    ).exec(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_DELETE", err.message, 500));
        }
        res.status(200).json({ message: "OK" });
    });
}


export { CreateStepElement, UpdateStepElement, ReadStepElementById, DeleteStepElement };