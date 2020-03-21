import mongoose from "mongoose";
import Step from "../step/model"; 

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
});

export default mongoose.model("Lesson", LessonSchema);