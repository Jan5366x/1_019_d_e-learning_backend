import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    firstname: {
        type: String,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        maxlength: 255,
        unique: true,
        match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    avatar: {
        type: Buffer,
        required: true
    },
    permissions: [
        { type: String }
    ],
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }
});

const userModel: mongoose.Model<mongoose.Document> = mongoose.model("User", UserSchema);

const RoleSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: {
        type: String,
        minlength: 3,
        maxlength: 64,
        required: true,
        unique: true
    }
})

const roleModel: mongoose.Model<mongoose.Document> = mongoose.model("Role", RoleSchema);

export { userModel as UserM, roleModel as RoleM };