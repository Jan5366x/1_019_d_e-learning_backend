import { RequestHandler, Request, Response } from "express";
import mongoose, { Query } from "mongoose";
import Lesson from "./model"
import ExpressError from "../classes/ExpressError";
const Create: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Create new Lesson
    // Save in MongoDB

    var lesson = new Lesson({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title
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
    Lesson.find({}).exec(function (err: Error, docs: Document) {
        console.log(docs);
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
        res.status(200).json({ meassage: "OK", docs: docs });
    });
};

const ReadById: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Read all Lessons
    // Save in MongoDB
    Lesson.find({ _id: req.params.id }).exec(function (err: Error, docs: Document) {
        console.log(docs);
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
        res.status(200).json({ meassage: "OK", docs: docs });
    });
};

const ReadByTitle: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Read all Lessons
    // Save in MongoDB
    Lesson.find({ title: req.params.title }).exec(function (err: Error, docs: Document) {
        console.log(docs);
        if (err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500));
        res.status(200).json({ meassage: "OK", docs: docs });
    });
};

const Update: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Update Lesson
    // Save in MongoDB
    console.log(req.params.id + " ; " + req.body.title)
<<<<<<< HEAD
    var result = Lesson.updateOne({_id: req.params.id}, {title: req.body.title}).exec(function(err:Error){
        if(err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500)); 
=======
    var result = Lesson.updateOne({ _id: req.params.id }, { title: req.body.title }).exec(function (err: Error) {
        return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
>>>>>>> master
    });

    res.status(200).json({ message: "OK" });
};

const Delete: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Delete Lesson
    // Save in MongoDB
<<<<<<< HEAD
    Lesson.deleteOne({_id: req.params.id}, function(err){
        if(err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500)); 
    }); 
=======
    Lesson.deleteOne({ _id: req.params.id }, function (err) {
        return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500));
    });
>>>>>>> master
    res.status(200).json({ message: "OK" });
};

export { Create, ReadAll, ReadById, ReadByTitle, Update, Delete };