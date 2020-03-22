import { RequestHandler, Request, Response } from "express";
import Question, { IQuestion } from "../models/Question";
import mongoose from "mongoose";
import ExpressError from "../../classes/ExpressError";
import Quiz from "../models/Quiz";

const CreateQuestion: RequestHandler = (req: Request, res: Response, next: Function) => {
    const question: IQuestion = new Question({
        _id: new mongoose.Types.ObjectId(),
        type: req.body.type,
        question: req.body.question
    });
    question.save(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_CREATED", err.message, 500));
        }
        Quiz.update(
            { _id: req.params.quizId },
            { $push: { questions: question._id } }
        ).exec(function (err: Error) {
            if (err) {
                return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
            }
            res.status(200).json({ message: "OK", doc: question });
        });
    })
}

const UpdateQuestion: RequestHandler = (req: Request, res: Response, next: Function) => {
    Question.findByIdAndUpdate(
        req.params.questionId,
        { type: req.body.type, question: req.body.question }
    ).exec(function (err: Error) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
        }
        res.status(200).json({ message: "OK" })
    });
};

const GetQuestion: RequestHandler = (req: Request, res: Response, next: Function) => {
    Question.findById(req.params.questionId).populate("answers").exec(function(error: Error, doc: IQuestion) {
        if (error) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", error.message, 500));
        }
        res.status(200).json({ message: "OK", doc: doc });
    });
}

const DeleteQuestion: RequestHandler = (req: Request, res: Response, next: Function) => {
    Question.findByIdAndDelete(req.params.questionId).exec(function(err) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_DELETE", err.message, 500));
        }
        res.status(200).json({ message: "OK" });
    });
};

export { CreateQuestion, UpdateQuestion, DeleteQuestion, GetQuestion };