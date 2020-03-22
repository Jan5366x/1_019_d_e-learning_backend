import { RequestHandler, Request, Response } from "express";
import Quiz, { IQuiz } from "../models/Quiz";
import mongoose, { Document } from "mongoose";
import ExpressError from "../../classes/ExpressError";
import Question from "../models/Question";

const Create: RequestHandler = (req: Request, res: Response, next: Function) => {
    const quiz: IQuiz = new Quiz({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        description: req.body.description
    });

    quiz.save(function (err) {
        console.log(err);
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COUD_NOT_CREATE", err.message, 500));
        }
        res.status(200).json({ message: "OK", doc: quiz });
    });
};

const ReadAll: RequestHandler = (req: Request, res: Response, next: Function) => {
    Quiz.find({}).populate("questions").populate("question.answers").exec(function (err: Error, docs: Document) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COUD_NOT_READ"), err.message, 500);
        }
        res.status(200).json({ message: "OK", docs: docs });
    });
};

const ReadById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Quiz.findById({ _id: req.params.id }).populate("questions").exec(function (err: Error, quiz: IQuiz) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
        }
        Question.populate(quiz.questions, { path: "answers"}, function(err, doc) {
            if (err) {
                return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
            }
            res.status(200).json({ message: "OK", doc: quiz });
        })
    });
};

const UpdateById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Quiz.updateOne(
        { _id: req.params.id },
        { name: req.body.name, description: req.body.description }
    ).exec(function (err: Error) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
        }
        res.status(200).json({ message: "OK" });
    });
};

const DeleteById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Quiz.deleteOne(
        { _id: req.params.id }
    ).exec(function(err: Error) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500)); 
        }
        res.status(200).json({ message: "OK" });
    });
};

export { Create, ReadAll, ReadById, UpdateById, DeleteById };