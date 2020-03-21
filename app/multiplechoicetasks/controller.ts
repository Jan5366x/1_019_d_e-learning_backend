import { RequestHandler, Request, Response } from 'express';
import mongoose from 'mongoose';
import MultipleChoiceTask from './models/MultipleChoiceTask';
import BadRequestError from '../classes/BadRequestError';
import Answer from './models/Answer';

const Post: RequestHandler = (req: Request, res: Response, next: Function) => {
    const multipleChoiceTask = postMultipleChoiceTask(req.body, next);
    res.send(multipleChoiceTask);
};

const PostCollection: RequestHandler = (req: Request, res: Response, next: Function) => {
    const results: any[] = [];
    if (req.body.length > 0) {
        req.body.forEach((element: any) => {
            results.push(postMultipleChoiceTask(element, next));
        });
    } else {
        throw new BadRequestError('COLLECTION_REQUIRED', 'Collection is not allowed to be emty')
    }
    res.send(results);
}

const Get: RequestHandler = async (req: Request, res: Response, next: Function) => {
    const result = await MultipleChoiceTask.findById(req.params.id);
    if (result != null) {
        res.send(result);
    } else {
        next(new BadRequestError('TASK_REQUIRED', 'No MultipleChoiceTask found for ' + req.params.id));
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

function postMultipleChoiceTask(body: any, next: Function): any {
    validate(body, next);
    const multipleChoiceTask = getMultipleChoiceTask(body);
    multipleChoiceTask.save();
    return multipleChoiceTask;
}

const ERROR_MESSAGE_NULL = ' is not allowed to be null';

function validate(body: any, next: Function): void {
    if (body.name == null) {
        next(new BadRequestError('NAME_REQUIRED', 'name' + ERROR_MESSAGE_NULL));
        return;
    }
    if (body.name.length > 255) {
        next(new BadRequestError('NAME_TO_LONG', 'name is longer then allowed => max 255 chars'));
        return;
    }
    if (body.type == null || body.type > 2) {
        next(new BadRequestError('TYPE_REQUIRED', `type ${ERROR_MESSAGE_NULL} and has to be 0 or 1`));
        return;
    }
    if (body.taskDescription == null) {
        next(new BadRequestError('TASK_DESCRIPTION_REQUIRED', 'taskDescription' + ERROR_MESSAGE_NULL));
        return;
    }
    if (body.taskDescription.length > 5000) {
        next(new BadRequestError('TASK_DESCRIPTION_TO_LONG', 'tasDescription is longer then allowed => max 5000 chars'));
        return;
    }
    if (body.answers == null || body.answers.length == 0) {
        next(new BadRequestError('ANSWER_NAME_REQUIRED', `name ${ERROR_MESSAGE_NULL} or empty`));
        return;
    }
    for (let index = 0; index < body.answers.length; index++) {
        if (body.answers[index].correct == null ) {
            next(new BadRequestError('ANSWER_CORRECT_REQUIRED', `answers  ${index}].correct are not allowed to be null`));
            return;
        }
        if (body.answers[index].title == null) {
            next(new BadRequestError('ANSWER_TITLE_REQUIRED', `answers  ${index}].title are not allowed to be null`));
            return;
        }
        if (body.answers[index].title.length > 255) {
            next(new BadRequestError('ANSWER_TITLE_TO_LONG', `answers  ${index}].title is longer then allowed => max 255 chars`));
            return;
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

export { Post, Get, Put, Delete, GetCollection, PostCollection };
