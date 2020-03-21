import { RequestHandler, Request, Response } from "express";
import mongoose, { Query } from "mongoose";
import Lesson from "./model"
const Create: RequestHandler = (req: Request, res: Response) => {
    // Create new Lesson
    // Save in MongoDB
    
    var lesson = new Lesson({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title
    }); 

    console.log(lesson); 
    lesson.save();
    res.status(200).json({ message: "OK!" });
};

const ReadAll: RequestHandler = (req: Request, res: Response) => {
    // Read all Lessons
    // Save in MongoDB
    Lesson.find({}).exec(function(err: Error, docs: Document){
        console.log(docs);
        res.status(200).json(docs);
    });
};

const ReadById: RequestHandler = (req: Request, res: Response) => {
    // Read all Lessons
    // Save in MongoDB
    Lesson.find({_id: req.params.id}).exec(function(err: Error, docs: Document){
        console.log(docs);
        res.status(200).json(docs);
    });
};

const ReadByTitle: RequestHandler = (req: Request, res: Response) => {
    // Read all Lessons
    // Save in MongoDB
    Lesson.find({title: req.params.title}).exec(function(err: Error, docs: Document){
        console.log(docs);
        res.status(200).json(docs);
    });
};

const Update: RequestHandler = (req: Request, res: Response) => {
    // Update Lesson
    // Save in MongoDB
    console.log(req.params.id + " ; " + req.body.title)
    var result = Lesson.updateOne({_id: req.params.id}, {title: req.body.title}).exec(function(err:Error){
        if(err) return err; 
    });

    res.status(200).json({ message: "OK!" });
};

const Delete: RequestHandler = (req: Request, res: Response) => {
    // Delete Lesson
    // Save in MongoDB
    Lesson.deleteOne({_id: req.params.id}, function(err){
        if(err) return err; 
    }); 
    res.status(200).json({ message: "OK!" });
};

export { Create, ReadAll, ReadById, ReadByTitle, Update, Delete };