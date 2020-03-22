import { RequestHandler, Request, Response } from "express";
import Answer, { IAnswer } from "../models/Answer";
import Quiz, { IQuiz } from "../models/Quiz";
import ExpressError from "../../classes/ExpressError";
import mongoose, { Document } from 'mongoose';

const CreateAnswer: RequestHandler = (req: Request, res: Response, next: Function) => {
    const answer: IAnswer = new Answer({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        correct: req.body.correct
    });

    Quiz.findOne(
        { _id: req.params.quizId, 'questions._id': req.params.questionId },
        { 'questions.$': '1' }
    ).exec(function (err: Error, doc: IQuiz) {
        if (err) {
            return next(new ExpressError('INTERNAL_ERROR_COULD_NOT_UPDATE', err.message, 500));
        }
        if (doc == null || doc.questions == null || doc.questions.length !== 1) {
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", `For Quiz Id : ${req.params.quizId} and Question Id: ${req.params.questionId} cannot find`, 500));
        }
        doc.questions[0].answers.push(answer);

        Quiz.updateOne(
            { _id: req.params.quizId, 'questions._id': req.params.questionId },
            {
                $set: {
                    'questions.$.answers': doc.questions[0].answers
                }
            }
        ).exec(function (err: Error) {
            if (err) {
                return next(new ExpressError('INTERNAL_ERROR_COULD_NOT_UPDATE', err.message, 500));
            }
            res.status(200).json({ message: 'OK', doc: doc });
        });
    });
};

export { CreateAnswer };