import { RequestHandler, Request, Response } from "express";
import mongoose from "mongoose";
import { LessonM, PlannedLessonM } from "./model"
import ExpressError from "../classes/ExpressError";
const Create: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Create new Lesson
    // Save in MongoDB
    if (req.body.title == null) return next(new ExpressError("TITLE_REQUIRED", "You have to provide a title", 400))

    var lesson = new LessonM({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
    });

    console.log(lesson);
    lesson.save(function (err) {
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_CREATE", err.message, 500));
    });
    res.status(200).json({ message: "OK" });
};

const ReadAll: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Read all Lessons
    // Save in MongoDB
    LessonM.find({}).exec(function (err: Error, docs: Document) {
        console.log(docs);
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
        res.status(200).json({ meassage: "OK", docs: docs });
    });
};

const ReadById: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Read all Lessons
    // Save in MongoDB
    LessonM.find({ _id: req.params.id }).exec(function (err: Error, docs: Document) {
        console.log(docs);
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
        res.status(200).json({ meassage: "OK", docs: docs });
    });
};

const ReadByTitle: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Read all Lessons
    // Save in MongoDB
    LessonM.find({ title: req.params.title }).exec(function (err: Error, docs: Document) {
        console.log(docs);
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
        res.status(200).json({ meassage: "OK", docs: docs });
    });
};

// const ReadByDate: RequestHandler = (req: Request, res: Response, next: Function) => {
//     // Read all Lessons
//     // Save in MongoDB
//     LessonM.find({ date: req.params.date }).exec(function (err: Error, docs: Document) {
//         if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
//         res.status(200).json({ meassage: "OK", docs: docs });
//     });
// };

// const ReadByDateStartEnd: RequestHandler = (req: Request, res: Response, next: Function) => {
//     // Read all Lessons
//     // Save in MongoDB
//     LessonM.find({
//         date: {
//             $gte: req.params.startDate,
//             $lte: req.params.endDate
//         }
//     }).exec(function (err: Error, docs: Document) {
//         if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
//         console.log(docs)
//         res.status(200).json({ meassage: "OK", docs: docs });
//     });
// };

const Update: RequestHandler = (req: Request, res: Response, next: Function) => {
    LessonM.updateOne({ _id: req.params.id }, { title: req.body.title }).exec(function (err: Error) {
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
    });

    res.status(200).json({ message: "OK" });
};

const Delete: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Delete Lesson
    // Save in MongoDB
    LessonM.deleteOne({ _id: req.params.id }, function (err) {
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
    });
    res.status(200).json({ message: "OK" });
};

export { Create, ReadAll, ReadById, ReadByTitle, Update, Delete };