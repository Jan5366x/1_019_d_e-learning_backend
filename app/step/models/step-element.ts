import mongoose, { Document, SchemaType } from "mongoose";
import { IQuiz } from "../../quizs/models/Quiz";

export interface IStepElement extends Document {
    _id: SchemaType;
    title: string;
    // video
    quiz: IQuiz;

}

const StepElementSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Quiz"
    }
});

export default mongoose.model<IStepElement>("StepElement", StepElementSchema);