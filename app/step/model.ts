import mongoose from "mongoose";

const StepSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    elements: [{ type: mongoose.Schema.Types.ObjectId, ref: "" }, { type: mongoose.Schema.Types.ObjectId, ref: "" }]
})

const StepModel = mongoose.model("Step", StepSchema);

export { StepModel as Step };