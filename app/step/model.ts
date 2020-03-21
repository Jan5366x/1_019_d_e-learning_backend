import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    elements: [{ type: mongoose.Schema.Types.ObjectId, ref: "" }, { type }]
})

export { };