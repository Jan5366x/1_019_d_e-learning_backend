import mongoose from "mongoose";
//import Step from "../step/model"; 

const LessonSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
    //steps: [Step]
});

const LessonM = mongoose.model("Lesson", LessonSchema)

const PlannedLessonSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: {
        type: Date
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true }
});

const PlannedLessonM = mongoose.model("PlannedLesson", PlannedLessonSchema);

export { LessonM, PlannedLessonM }