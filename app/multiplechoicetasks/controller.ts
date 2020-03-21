import { RequestHandler, Request, Response } from 'express';
import mongoose, { model, get } from 'mongoose';
import MultipleChoiceTask from './models/MultipleChoiceTask';
import Answer, { AnswerSchema, Answer } from './models/Answer';
import BadRequestError from '../classes/BadRequestError';

const Post: RequestHandler = (req: Request, res: Response) => {
    const multipleChoiceTask = postMultipleChoiceTask(req.body);
    res.send(multipleChoiceTask);
};

const PostCollection: RequestHandler = (req: Request, res: Response) => {
    const results: any[] = [];
    if (req.body.length > 0) {
        req.body.forEach((element: any) => {
            results.push(postMultipleChoiceTask(element));
        });
    } else {
        throw new BadRequestError('Collection is not allowed to be emty')
    }
    res.send(results);
}

const Get: RequestHandler = async (req: Request, res: Response, next: Function) => {
    const result = await MultipleChoiceTask.findById(req.params.id);
    if (result != null) {
        res.send(result);
    } else {
        next(new BadRequestError('No MultipleChoiceTask found for ' + req.params.id));
    }
};

const GetCollection: RequestHandler = async (req: Request, res: Response) => {
    const result = await MultipleChoiceTask.find();
    res.send(result);
}

const Put: RequestHandler = (req: Request, res: Response) => {
    const multipleChoiceTask = getMultipleChoiceTask(req);
    multipleChoiceTask._id = undefined;
    MultipleChoiceTask.update({_id: req.params.id}, multipleChoiceTask).then(x => {
        res.send();
    });
};

const Delete: RequestHandler = (req: Request, res: Response) => {
    MultipleChoiceTask.deleteOne({_id: req.params.id}).then(() => {
        res.send();
    });
};

export { Post, Get, Put, Delete, GetCollection, PostCollection };

function postMultipleChoiceTask(body: any): any {
    validate(body);
    const multipleChoiceTask = getMultipleChoiceTask(body);
    multipleChoiceTask.save();
    return multipleChoiceTask;
}

const ERROR_MESSAGE_NULL = ' is not allowed to be null';

function validate(body: any): void {
    if (body.name == null) {
        throw new BadRequestError('name' + ERROR_MESSAGE_NULL);
    }
    if (body.name.length > 255) {
        throw new BadRequestError('name is longer then allowed => max 255 chars');
    }
    if (body.type == null || body.type > 2) {
        throw new BadRequestError('type' + ERROR_MESSAGE_NULL + ' and has to be 0 or 1');
    }
    if (body.taskDescription == null) {
        throw new BadRequestError('taskDescription' + ERROR_MESSAGE_NULL);
    }
    if (body.taskDescription.length > 5000) {
        throw new BadRequestError('tasDescription is longer then allowed => max 5000 chars');
    }
    if (body.answers == null || body.answers.length == 0) {
        throw new BadRequestError('name' + ERROR_MESSAGE_NULL + ' or empty');
    }
    for (let index = 0; index < body.answers.length; index++) {
        if (body.answers[index].correct == null ) {
            throw new BadRequestError('answers[' + index + '].correct are not allowed to be null');
        }
        if (body.answers[index].title == null) {
            throw new BadRequestError('answers[' + index + '].title are not allowed to be null');
        }
        if (body.answers[index].title.length > 255) {
            throw new BadRequestError('answers[' + index + '].title is longer then allowed => max 255 chars');
        }
    }
}

function getMultipleChoiceTask(body: any): any {
    return new MultipleChoiceTask({
        _id: new mongoose.Types.ObjectId(),
        name: body.name,
        type: body.type,
        taskDescription: body.taskDescription,
        answers: getAnswers(body.answers)
    });
}

function getAnswers(answers: any): any[] {
    const resultAnswers: any = [];
    answers.forEach((answer: any) => {
        resultAnswers.push(new Answer({_id: new mongoose.Types.ObjectId(),title: answer.title, correct: answer.correct}))
    });
    return resultAnswers;
}
