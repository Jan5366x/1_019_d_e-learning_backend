import mongoose from 'mongoose';
//TODO: wenn wir uns für number/string im Task als Type entscheiden wird das hier nicht mehr benögtigt.

const MultipleChoiceTypeSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255
    }
});

export default mongoose.model('MultipleChoiceType', MultipleChoiceTypeSchema);