import { RequestHandler, Request, Response } from "express";
import mongoose from "mongoose";
import { LessonM, PlannedLessonM } from "./model"
import ExpressError from "../classes/ExpressError";

const GetAll: RequestHandler = async (req: Request, res: Response, next: Function) => {
    try {
        var plannedLessons: mongoose.Document[] = await LessonM.find({}).select("_id date course").exec()

    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_GET_PLANNED_LESSONS", e.message, 500))
    }

    res.status(200).send({ message: "OK", planned: plannedLessons });
}

const GetBetween: RequestHandler = async (req: Request, res: Response, next: Function) => {
    const { startDateUTC, endDateUTC } = req.params

    const startDate = new Date(startDateUTC)
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateUTC)
    endDate.setHours(23, 59, 59, 999);

    try {
        var plannedLessons: mongoose.Document[] = await LessonM.find({ date: { $gte: startDate, $lte: endDate } });
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_GET_PLANNED_LESSONS", e.message, 500))
    }

    res.status(200).send({ message: "OK", planned: plannedLessons, startPoint: startDate.getTime(), endPoint: endDate.getTime() });
}


const GetById: RequestHandler = async (req: Request, res: Response, next: Function) => {
    try {
        var plannedLessons: mongoose.Document[] = await LessonM.find({ _id: req.params._id });
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_GET_PLANNED_LESSONS", e.message, 500))
    }

    res.status(200).send({ message: "OK", planned: plannedLessons });
}

const Create: RequestHandler = async (req: Request, res: Response, next: Function) => {

}

export { GetAll, GetBetween, GetById, Create }