import { RequestHandler, Request, Response } from "express";
import Answer, { IAnswer } from "../models/Answer";
import ExpressError from "../../classes/ExpressError";
import mongoose from "mongoose";
import Question from "../models/Question";

const CreateAnswer: RequestHandler = (req: Request, res: Response, next: Function) => {
    const answer: IAnswer = new Answer({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        correct: req.body.correct
    });

    answer.save(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_CREATED", err.message, 500));
        }
        Question.findByIdAndUpdate(
            req.params.questionId,
            { $push: { answers: answer._id} }
        ).exec(function(err: Error){
            if (err) {
                return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
            }
            res.status(200).json({ message: "OK", doc: answer });
        });
    });
};

const UpdateAnswerById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Answer.findByIdAndUpdate(
        req.params.answerId,
        { title: req.body.title, correct: req.body.correct }
    ).exec(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
        }
        res.status(200).json({ message: "OK" });
    });
};

const GetAnswerById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Answer.findById(
        req.params.answerId
    ).exec(function(err: Error, doc: IAnswer){
        if(err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
        }
        res.status(200).json({ message: "OK", doc })
    });
}

const DeleteAnswerById: RequestHandler = (req: Request, res: Response, next: Function) => {
    Answer.findByIdAndDelete(
        req.params.answerId
    ).exec(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_DELETE", err.message, 500));
        }
        res.status(200).json({ message: "OK" })
    });
};

export { CreateAnswer, UpdateAnswerById, GetAnswerById, DeleteAnswerById };