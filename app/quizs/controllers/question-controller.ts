import { RequestHandler, Request, Response } from "express";
import Question, { IQuestion } from "../models/Question";
import mongoose, { Types } from "mongoose";
import ExpressError from "../../classes/ExpressError";
import Quiz, { IQuiz } from "../models/Quiz";

const CreateQuestion: RequestHandler = (req: Request, res: Response, next: Function) => {
    const question: IQuestion = new Question({
        _id: new mongoose.Types.ObjectId(),
        type: req.body.type,
        question: req.body.question
    });
    Quiz.update(
        { _id: req.params.quizId },
        { $push: { questions: question } }
    ).exec(function (err: Error) {
        if (err) {
            return next(new ExpressError('INTERNAL_ERROR_COULD_NOT_UPDATE', err.message, 500));
        }
        res.status(200).json({ message: 'OK', doc: question });
    });
}

const UpdateQuestion: RequestHandler = (req: Request, res: Response, next: Function) => {
    Quiz.updateOne(
        { _id: req.params.quizId, 'questions._id': req.params.questionId },
        {
            $set: {
                'questions.$.type': req.body.type,
                'questions.$.question': req.body.question
            }
        }
    ).exec(function (err: Error) {
        if (err) {
            return next(new ExpressError('INTERNAL_ERROR_COULD_NOT_UPDATE', err.message, 500));
        }
        res.status(200).json({ message: 'OK' });
    });
};

const GetQuestion: RequestHandler = (req: Request, res: Response, next: Function) => {
    Quiz.findOne(
        { _id: req.params.quizId, 'questions._id': req.params.questionId },
        { 'questions.$': '1' },
        function (err: Error, doc: IQuiz) {
            if (err) {
                return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
            }
            if (doc == null || doc.questions == null || doc.questions.length !== 1) {
                return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", `For Quiz Id : ${req.params.quizId} and Question Id: ${req.params.questionId} cannot find`, 500));
            }
            res.status(200).json({ message: 'OK', doc: doc.questions[0] });
        });
}

const DeleteQuestion: RequestHandler = (req: Request, res: Response, next: Function) => {
    Quiz.findByIdAndUpdate(
        req.params.quizId,
        {
            $pull: {
                'questions': { _id: req.params.questionId }
            }
        }
    ).exec(function (err: Error) {
        if (err) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_DELETE", err.message, 500));
        }
        res.status(200).json({ message: 'OK' });
    });
};

export { CreateQuestion, UpdateQuestion, DeleteQuestion, GetQuestion };