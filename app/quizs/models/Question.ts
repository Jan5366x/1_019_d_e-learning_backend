import mongoose, { SchemaType, Document } from 'mongoose';
import { AnswerSchema, IAnswer } from './Answer';

export interface IQuestion extends Document {
    _id: SchemaType;
    type: number;
    question: string;
    answers: [IAnswer]
}

export const QuestionSchema = new mongoose.Schema({  
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: Number,
        required: true,
    },
    question: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5000
        
    },
    answers: [AnswerSchema]
});

export default mongoose.model<IQuestion>('Question', QuestionSchema);
