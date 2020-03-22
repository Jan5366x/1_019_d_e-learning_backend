import { RequestHandler, Request, Response } from "express";
import mongoose from "mongoose";
import Course from "./model"
import ExpressError from "../classes/ExpressError";
const Create: RequestHandler = (req: Request, res: Response) => {
    // Create new Lesson
    // Save in MongoDB
    
    var course = new Course({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    }); 

    console.log(course); 
    course.save();
    res.status(200).json({ message: "OK!" });
};

const ReadAll: RequestHandler = (req: Request, res: Response) => {
    // Read all Lessons
    // Save in MongoDB
    Course.find({}).exec(function(err: Error, docs: Document){
        console.log(docs);
        res.status(200).json(docs);
    });
};

const ReadById: RequestHandler = (req: Request, res: Response) => {
    // Read all Lessons
    // Save in MongoDB
    Course.find({_id: req.params.id}).exec(function(err: Error, docs: Document){
        console.log(docs);
        res.status(200).json(docs);
    });
};

const ReadByName: RequestHandler = (req: Request, res: Response) => {
    // Read all Lessons
    // Save in MongoDB
    Course.find({title: req.params.title}).exec(function(err: Error, docs: Document){
        console.log(docs);
        res.status(200).json(docs);
    });
};

const Update: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Update Lesson
    // Save in MongoDB
    console.log(req.params.id + " ; " + req.body.title)
    var result = Course.updateOne({_id: req.params.id}, {title: req.body.title}).exec(function(err:Error){
        return next(new ExpressError("COULD_NOT_UPDATE", ""+err, 400));
    });
    res.status(200).json({ message: "OK!" });
};

const Delete: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Delete Lesson
    // Save in MongoDB
    Course.deleteOne({_id: req.params.id}, function(err){
        return next(new ExpressError("COULD_NOT_DELETE", ""+err, 400));
    }); 
    res.status(200).json({ message: "OK!" });
};

export { Create, ReadAll, ReadById, ReadByName, Update, Delete };
