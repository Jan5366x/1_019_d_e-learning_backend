import mongoose from "mongoose";

const User = mongoose.model('User', {
    name: String,
    firstname: String,
    email: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    }

})
