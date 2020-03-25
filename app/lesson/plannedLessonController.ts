import { RequestHandler, Request, Response } from "express";
import mongoose from "mongoose";
import { LessonM, PlannedLessonM } from "./model"
import ExpressError from "../classes/ExpressError";
import CourseM from "../course/model"

const GetAll: RequestHandler = async (req: Request, res: Response, next: Function) => {
    try {
        var plannedLessons: mongoose.Document[] = await LessonM.find({}).select("_id date course").exec()

    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_GET_PLANNED_LESSONS", e.message, 500))
    }

    res.status(200).send({ message: "OK", plannedLesson: plannedLessons });
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

    res.status(200).send({ message: "OK", plannedLesson: plannedLessons, startPoint: startDate.getTime(), endPoint: endDate.getTime() });
}


const GetById: RequestHandler = async (req: Request, res: Response, next: Function) => {
    try {
        var plannedLessons: mongoose.Document[] = await LessonM.find({ _id: req.params._id });
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_GET_PLANNED_LESSONS", e.message, 500))
    }

    res.status(200).send({ message: "OK", planneLesson: plannedLessons });
}

const Create: RequestHandler = async (req: Request, res: Response, next: Function) => {
    if (req.body.course == null) return next(new ExpressError("COURSE_REQUIRED", "You have to provide a course.", 400));
    if (!mongoose.Types.ObjectId.isValid(req.body.course)) return next(new ExpressError("ID_INVALID", "You have to provide a vaild ObjectId", 400))

    try {
        var course = await CourseM.findOne({ _id: req.body.course }).exec()
        if ((course) == null) return next(new ExpressError("ID_DOESNT_EXIXT", "You have to provide a course that exists", 400));
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_VALIDATE_COURSE_ID", e.message, 500))
    }

    const createdPlannedLesson = new PlannedLessonM({
        _id: new mongoose.Types.ObjectId(),
        course: req.body.course,
        date: req.body.date != null ? new Date(req.body.date) : null
    })

    try {
        createdPlannedLesson.save();
    }
    catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_CREATING_PLANNED_LESSON", e.message, 500))
    }

    res.status(201).json({
        message: "PLANNED_LESSON_CREATED",
        plannedLesson: {
            _id: createdPlannedLesson._id,
            course: course,
            date: req.body.date != null ? new Date(req.body.date) : null
        }
    })
}

const Update: RequestHandler = async (req: Request, res: Response, next: Function) => {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) return next(new ExpressError("ID_INVALID", "You have to provide a vaild ObjectId", 400));

    try {
        var lesson = await PlannedLessonM.findOne({ _id: req.params._id }).populate("Lesson").select("_id course date").exec()
        if ((lesson) == null) return next(new ExpressError("ID_DOESNT_EXIXT", "You have to provide a plannedLesson that exists", 400));
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_VALIDATE_PLANNEDLESSON_ID", e.message, 500))
    }

    try {
        if (req.body.course != null && (await CourseM.findOne({ _id: req.body.course }).exec()) == null) return next(new ExpressError("ID_DOESNT_EXIXT", "You have to provide a course that exists", 400));
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_VALIDATE_COURSE_ID", e.message, 500))
    }

    try {
        await PlannedLessonM.updateOne({ _id: req.params._id }, { course: req.body.course, date: req.body.date != null ? new Date(req.body.date) : null }).exec()
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_UPDATING_PLANNEDLESSON", e.message, 500))
    }

    res.status(200).json({
        message: "UPDATED_PLANNEDLESSON",
        plannedLesson: lesson
    })

}

const Delete: RequestHandler = async (req: Request, res: Response, next: Function) => {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) return next(new ExpressError("ID_INVALID", "You have to provide a vaild ObjectId", 400));

    try {
        if ((await PlannedLessonM.findOne({ _id: req.params._id }).exec()) == null) return next(new ExpressError("ID_DOESNT_EXIXT", "You have to provide a plannedLesson that exists", 400));
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_VALIDATE_PLANNEDLESSON_ID", e.message, 500))
    }

    try {
        await PlannedLessonM.deleteOne({ _id: req.body._id }).exec()
    } catch (e) {
        return next(new ExpressError("INTERNAL_ERROR_DELETING_PLANNEDLESSON", e.message, 500))
    }

    res.status(200).json({ message: "DELETED_PLANNEDLESSON" });
}

export { GetAll, GetBetween, GetById, Create, Update, Delete }