import { RequestHandler, Request, Response } from "express";
import Lesson from "./model"
const Create: RequestHandler = (req: Request, res: Response) => {
    // Create new Lesson
    // Save in MongoDB
    
    var lesson = new Lesson({
        title: req.body.title
    }); 

    console.log(lesson); 
    lesson.save();
    res.status(200).json({ message: "OK!" });
};

const Read: RequestHandler = (req: Request, res: Response) => {
    // Read all Lessons
    // Save in MongoDB
    Lesson.find({}).exec(function(err: Error, docs: Document){
        console.log(docs);
        
        res.status(200).json(docs);
    });
};

const Update: RequestHandler = (req: Request, res: Response) => {
    // Update Lesson
    // Save in MongoDB
    
    res.status(200).json({ message: "OK!" });

};

const Delete: RequestHandler = (req: Request, res: Response) => {
    // Delete Lesson
    // Save in MongoDB
    
    res.status(200).json({ message: "OK!" });
};

export { Create, Read };