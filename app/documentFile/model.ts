import mongoose from "mongoose";

const S3BucketSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    uniqueId: {type: String, required: true},
    files: [{ type: mongoose.Schema.Types.ObjectId, ref: "S3File" }]
})

const S3BucketM = mongoose.model("S3Bucket", S3BucketSchema);

const S3FileSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    mimetype: {type: String, required: true}
})

const S3FileM = mongoose.model("S3File", S3FileSchema);

export {S3BucketM, S3FileM}