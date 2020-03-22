import mongoose, { SchemaType, Document } from "mongoose";

export interface IAnswer extends Document {
    _id: SchemaType;
    title: string;
    correct: boolean;
}

export const AnswerSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 5000
    },
    correct: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model<IAnswer>("Answer", AnswerSchema);