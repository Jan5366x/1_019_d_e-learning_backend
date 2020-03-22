import mongoose, { Document, SchemaType } from "mongoose";
import { IStepElement } from "./step-element";

export interface IStep extends Document {
    _id: SchemaType;
    elements: IStepElement[];
    timeToSolve?: Date;
}

const StepSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    studentGroup: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User"
    }],
    elements: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "StepElement"
    }],
    timeToSolve: {
        type: Date,
        required: true
    }
});

export default mongoose.model<IStep>("Step", StepSchema);