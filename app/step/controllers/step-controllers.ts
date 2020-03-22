import { RequestHandler, Request, Response } from "express";
import ExpressError from "../../classes/ExpressError";
import mongoose from "mongoose";
import Step, { IStep } from "../models/step";
import StepElement from "../models/step-element";
import { UserM } from "../../user/model";

const CreateStep: RequestHandler = (req: Request, res: Response, next: Function) => {
    const step: IStep = new Step({
        _id: new mongoose.Types.ObjectId(),
        timeToSolve: req.body.timeToSolve
    });
    step.save(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_CREATED", err.message, 500));
        }
        res.status(200).json(step);
    })
};

const ReadAll: RequestHandler = (req: Request, res: Response, next: Function) => {
    Step.find({}).populate("elements").exec(function(err, step: IStep) {
        if (err || step == null) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_CREATED", err?.message, 500));
        }
        StepElement.populate(step.elements, { path: "quiz" }, function(err, doc) {
            if (err) {
                return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
            }
            res.status(200).json({ message: 'OK', doc: step});
        });
    });
};

const ReadById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Step.findById(req.params.stepId).populate("elements").exec(function(err, step) {
        if (err || step == null) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_CREATED", err?.message, 500));
        }
        StepElement.populate(step.elements, { path: "quiz" }, function(err, doc) {
            if (err) {
                return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err?.message, 500));
            }
            res.status(200).json({ message: 'OK', doc: step });
        });
    });
};

const UpdateById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Step.findByIdAndUpdate(
        req.params.stepId,
        { timeToSolve: req.body.timeToSolve }
    ).exec(function (err: Error) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
        }
        res.status(200).json({ message: "OK" });
    });
};

const DeleteById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Step.deleteOne({ _id: req.params.stepId }).exec(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500)); 
        }
        res.status(200).json({ message: "OK" });
    });
};

export { CreateStep, ReadAll, ReadById, DeleteById, UpdateById };