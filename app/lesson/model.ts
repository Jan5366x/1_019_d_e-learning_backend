import mongoose from "mongoose";
//import Step from "../step/model"; 

const LessonSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    //steps: [Step]
});

export default mongoose.model("Lesson", LessonSchema);