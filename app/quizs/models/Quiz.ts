import mongoose, { Document, SchemaType } from "mongoose";
import { IQuestion } from "./Question";

export interface IQuiz extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    questions: IQuestion[]
}

export const QuizSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 500
    },
    description: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 5000
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Question"
    }]
});

export default mongoose.model<IQuiz>("Quiz", QuizSchema);