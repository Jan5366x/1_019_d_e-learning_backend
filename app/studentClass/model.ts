import mongoose from "mongoose";

const StudentClassSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    grade: {
        type: String,
        minlength: 1,
        maxlength: 50
    },
    addendum: {
        type: String,
        minlength: 1,
        maxlength: 50
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
    //files
    //chats
    //duties
    //tasks
    
});

export default mongoose.model("StudentClass", StudentClassSchema);