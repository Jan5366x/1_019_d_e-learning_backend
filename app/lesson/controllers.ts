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

    res.send("Hello World")
};

const Read: RequestHandler = (req: Request, res: Response) => {
    // Read all Lessons
    // Save in MongoDB
    
    res.send("Hello World")
};

const Update: RequestHandler = (req: Request, res: Response) => {
    // Update Lesson
    // Save in MongoDB
    
    res.send("Hello World")
};

const Delete: RequestHandler = (req: Request, res: Response) => {
    // Delete Lesson
    // Save in MongoDB
    
    res.send("Hello World")
};

export { Create };