import mongoose from 'mongoose';
import MultipleChoiceType from './MultipleChoiceType';
import Answer, { AnswerSchema } from './Answer';

const MultipleChoiceTaskSchema = new mongoose.Schema({  
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    },
    type: { // Oder als String, beides Möglich finde einen Integer aber schöner. Man muss halt klar definieren was jetzt Single/Multiple ist
        type: Number,
        required: true,
    },
    taskDescription: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5000
    },
    answers: [AnswerSchema]
});

export default mongoose.model('MultipleChoiceTask', MultipleChoiceTaskSchema);
