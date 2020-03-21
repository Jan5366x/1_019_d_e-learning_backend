import mongoose from 'mongoose';

export const AnswerSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    correct: {
        type: Boolean,
        required: true
    }
});

export default mongoose.model('Answer', AnswerSchema);