import { RequestHandler, Request, Response } from "express";
import mongoose, { Query } from "mongoose";
import StudentClass from "./model"
import ExpressError from "../classes/ExpressError";


const Create: RequestHandler = async (req: Request, res: Response, next: Function) => {
    // Create new Lesson
    // Save in MongoDB

    //Needs validation that elements are present

    var studentClass = new StudentClass({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        grade: req.body.grade,
        addendum: req.body.addendum,
        courses: req.body.courses,
        teacher: req.body.teacher,
        students: req.body.students
        //duties: req.body.duties
        //files: req.body.files
        //chats: req.body.chats
        //tasks: req.body.tasks
    }); 

    console.log(studentClass); 
    studentClass.save(function(err){
        if(err) {
            console.log(err.message)
            return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_CREATE", err.message, 500)); 
        }
    });
    res.status(200).json({ message: "OK!" });
};

const ReadAll: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Read all Lessons
    // Save in MongoDB
    StudentClass.find({}).exec(function(err: Error, docs: Document){
        console.log(docs);
        if(err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500)); 
        res.status(200).json({meassage: "OK", docs:docs});
    });
};

const ReadById: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Read all Lessons
    // Save in MongoDB
    StudentClass.find({_id: req.params.id}).exec(function(err: Error, docs: Document){
        console.log(docs);
        if(err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500)); 
        res.status(200).json({meassage: "OK", docs:docs});
    });
};

const ReadByName: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Read all Lessons
    // Save in MongoDB
    StudentClass.find({title: req.params.title}).exec(function(err: Error, docs: Document){
        console.log(docs);
        if(err)  return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_READ", err.message, 500)); 
        res.status(200).json({meassage: "OK", docs: docs});
    });
};

const Update: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Update Lesson
    // Save in MongoDB
    console.log(req.params.id + " ; " + req.body.title)
    var result = StudentClass.updateOne({_id: req.params.id}, {title: req.body.title}).exec(function(err:Error){
        return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500)); 
    });

    res.status(200).json({ message: "OK" });
};

const Delete: RequestHandler = (req: Request, res: Response, next: Function) => {
    // Delete Lesson
    // Save in MongoDB
    StudentClass.deleteOne({_id: req.params.id}, function(err){
       if(err) return next(new ExpressError("INTERNAL_ERROR_COULD_NOT_UPDATE", err.message, 500)); 
    }); 
    res.status(200).json({ message: "OK" });
};

export { Create, ReadAll, ReadById, ReadByName, Update, Delete };