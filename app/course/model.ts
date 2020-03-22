import mongoose from "mongoose";
//import Lesson from "../lesson/model"; 
import UserM from "../user/model"

const CourseSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    //Lessons: [Lesson]
    student:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
});

export default mongoose.model("Course", CourseSchema);
